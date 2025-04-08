import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyKOLfK_LMIQUYbJ1pGIbI-wV9yCqHA3I",
    authDomain: "rentafarm-2e5c2.firebaseapp.com",
    projectId: "rentafarm-2e5c2",
    storageBucket: "rentafarm-2e5c2.firebasestorage.app",
    messagingSenderId: "898870527321",
    appId: "1:898870527321:web:bcc1d0723e2da3d80a3848",
    measurementId: "G-717F1GY0NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById("listingForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const imageFile = document.getElementById("image").files[0];

    if (!imageFile) {
        alert("Please upload an image!");
        return;
    }

    try {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `listing_images/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Save listing to Firestore
        await addDoc(collection(db, "listings"), {
            title,
            description,
            price,
            imageUrl,
            timestamp: serverTimestamp()
        });

        alert("Listing added successfully!");
        document.getElementById("listingForm").reset();
    } catch (error) {
        console.error("Error adding listing:", error);
        alert("Failed to add listing. Please try again.");
    }
});
