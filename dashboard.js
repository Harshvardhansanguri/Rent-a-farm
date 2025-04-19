// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
    const userEmail = document.getElementById("user-email");
    const listingForm = document.getElementById("listingForm");
    const alertBox = document.getElementById("alert");
    const logoutButton = document.getElementById("logout");
    const landFormContainer = document.getElementById("landListingForm");

    // Check user authentication
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (userEmail) userEmail.textContent = `Logged in as: ${user.email}`;
            if (landFormContainer) landFormContainer.style.display = "block";
        } else {
            window.location.href = "login.html";
        }
    });

    // Logout button
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            signOut(auth).then(() => {
                alert("Logged out successfully!");
                window.location.href = "index.html";  // Redirect to the landing page
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

                // Adding the land listing to Firestore
                await addDoc(collection(db, "landListings"), {
                    userId: user.uid,
                    title: title,
                    location: location,
                    size: size,
                    imageUrl: imageUrl,
                    timestamp: new Date()
                });

                // Show success alert
                if (alertBox) {
                    alertBox.style.display = "block";
                    alertBox.style.backgroundColor = "#d4edda"; // green
                    alertBox.textContent = "Land listed successfully!";
                }

                listingForm.reset(); // Clear form
            } catch (error) {
                console.error("Error listing land:", error);
                // Show error alert
                if (alertBox) {
                    alertBox.style.display = "block";
                    alertBox.style.backgroundColor = "#f8d7da"; // red
                    alertBox.textContent = "Failed to list land. Try again!";
                }
            }
        });
    }

    // Display land listings
    const displayLandListings = async () => {
        const listingsContainer = document.getElementById("listingsContainer");

        // Get all land listings from Firestore
        const landListingsQuery = collection(db, "landListings");
        const querySnapshot = await getDocs(landListingsQuery);

        // Loop through each listing and create HTML elements
        querySnapshot.forEach((doc) => {
            const listing = doc.data();
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${listing.imageUrl}" alt="${listing.title}">
                <div class="p-4">
                    <h4>${listing.title}</h4>
                    <p>${listing.location}</p>
                    <p>Size: ${listing.size} sqm</p>
                </div>
            `;

            listingsContainer.appendChild(card);
        });
    };

    displayLandListings(); // Call function to display listings

});
