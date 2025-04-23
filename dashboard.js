// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyKOLfK_LMIQUYbJ1pGIbI-wV9yCqHA3I",
    authDomain: "rentafarm-2e5c2.firebaseapp.com",
    projectId: "rentafarm-2e5c2",
    storageBucket: "rentafarm-2e5c2.appspot.com",
    messagingSenderId: "898870527321",
    appId: "1:898870527321:web:bcc1d0723e2da3d80a3848",
    measurementId: "G-717F1GY0NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
    const listingForm = document.getElementById("listingForm");
    const alertBox = document.getElementById("alert");
    const logoutButton = document.getElementById("logout");
    const landFormContainer = document.getElementById("landListingForm");
    const userEmailDisplay = document.getElementById("user-email");

    // Check user authentication
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (userEmailDisplay) {
                userEmailDisplay.textContent = `Logged in as: ${user.email}`;
            }
            if (landFormContainer) {
                landFormContainer.style.display = "block";
            }
            displayLandListings();
        } else {
            window.location.href = "login.html";
        }
    });

    // Logout button
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            signOut(auth).then(() => {
                alert("Logged out successfully!");
                window.location.href = "index.html";
            }).catch((error) => console.error("Logout Error:", error));
        });
    }

    // Handle land listing submission
    if (listingForm) {
        listingForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in to list land.");
                return;
            }

            const title = document.getElementById("landTitle").value;
            const location = document.getElementById("landLocation").value;
            const size = document.getElementById("landSize").value;
            const imageFile = document.getElementById("landImage").files[0];

            if (!title || !location || !size || !imageFile) {
                alert("All fields are required!");
                return;
            }

            try {
                const storageRef = ref(storage, `landImages/${user.uid}/${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                const imageUrl = await getDownloadURL(storageRef);

                // Add to the correct collection: "listings"
                await addDoc(collection(db, "listings"), {
                    userId: user.uid,
                    title: title,
                    location: location,
                    size: size,
                    imageUrl: imageUrl,
                    timestamp: new Date()
                });

                if (alertBox) {
                    alertBox.style.display = "block";
                    alertBox.style.backgroundColor = "#d4edda";
                    alertBox.textContent = "Land listed successfully!";
                }

                listingForm.reset();
                displayLandListings();
            } catch (error) {
                console.error("Error listing land:", error);
                if (alertBox) {
                    alertBox.style.display = "block";
                    alertBox.style.backgroundColor = "#f8d7da";
                    alertBox.textContent = "Failed to list land. Try again!";
                }
            }
        });
    }

    // Display land listings
    const displayLandListings = async () => {
        const listingsContainer = document.getElementById("listingsContainer");
        if (!listingsContainer) return;

        listingsContainer.innerHTML = "";

        try {
            const landListingsQuery = collection(db, "listings");
            const querySnapshot = await getDocs(landListingsQuery);

            if (querySnapshot.empty) {
                listingsContainer.innerHTML = `<p class="text-gray-500 col-span-full">No listings available.</p>`;
                return;
            }

            querySnapshot.forEach((doc) => {
                const listing = doc.data();

                const card = document.createElement("div");
                card.className = "card bg-white rounded-lg shadow p-4";

                card.innerHTML = `
                    <img src="${listing.imageUrl}" alt="${listing.title}" class="w-full h-48 object-cover rounded-md mb-2" />
                    <h3 class="font-bold text-lg mb-1">${listing.title}</h3>
                    <p class="text-sm text-gray-700">📍 Location: ${listing.location}</p>
                    <p class="text-sm text-gray-700">📐 Size: ${listing.size}</p>
                `;

                listingsContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error loading listings:", error);
            listingsContainer.innerHTML = `<p class="text-red-500 col-span-full">Failed to load listings.</p>`;
        }
    };

    // Sidebar toggle functionality
    const toggleSidebarBtn = document.getElementById("toggleSidebar");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            if (mainContent) {
                mainContent.classList.toggle("collapsed");
            }
        });
    }
});
