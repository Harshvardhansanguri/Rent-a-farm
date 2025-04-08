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

// Check user authentication and show/hide land listing form
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("user-email").textContent = `Logged in as: ${user.email}`;
        document.getElementById("landListingForm").style.display = "block"; // ✅ Show form when logged in
    } else {
        window.location.href = "login.html"; // Redirect if not logged in
    }
});

// Logout functionality
document.getElementById("logout").addEventListener("click", () => {
    signOut(auth).then(() => {
        alert("Logged out successfully!");
        window.location.href = "login.html";
    }).catch((error) => console.error("Logout Error:", error));
});

// Handle land listing submission
document.getElementById("listingForm").addEventListener("submit", async (e) => {
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
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `landImages/${user.uid}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);

        // Save listing to Firestore
        await addDoc(collection(db, "landListings"), {
            userId: user.uid,
            title: title,
            location: location,
            size: size,
            imageUrl: imageUrl,
            timestamp: new Date()
        });

        alert("Land listed successfully!");
        document.getElementById("listingForm").reset(); // Clear form
    } catch (error) {
        console.error("Error listing land:", error);
        alert("Failed to list land. Try again!");
    }
});
