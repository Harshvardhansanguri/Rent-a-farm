// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your Firebase configuration (Make sure this matches firebase-config.js)
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

// Get form element
const resetForm = document.getElementById("resetPasswordForm");

// Add event listener for form submission
resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent! Check your email.");
    } catch (error) {
        console.error("Error:", error.message);
        alert("Failed to send reset email. Check your email and try again.");
    }
});
