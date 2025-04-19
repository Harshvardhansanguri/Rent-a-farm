// Import Firebase authentication functions
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", function () {
    const auth = getAuth(app);
    const loginForm = document.getElementById("loginForm");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    // Toggle password visibility and switch eye icon
    togglePassword.addEventListener("click", function () {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;

        // Toggle the eye icon
        const icon = togglePassword.querySelector("i");
        if (passwordInput.type === "password") {
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        } else {
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        }
    });

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    if (user.emailVerified) {
                        alert("Login successful!");
                        window.location.href = "dashboard.html"; // Redirect after login
                    } else {
                        alert("Please verify your email before logging in.");
                    }
                })
                .catch((error) => {
                    console.error("Login error:", error.message);
                    alert("Login failed: " + error.message);
                });
        });
    } else {
        console.error("Login form not found! Check your HTML file.");
    }
});
