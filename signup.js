import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  import { app } from "./firebase-config.js";
  
  const auth = getAuth(app);
  
  document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        sendEmailVerification(user)
          .then(() => {
            alert("Signup successful! Please verify your email before logging in.");
          })
          .catch((error) => {
            console.error("Error sending email verification:", error);
          });
      })
      .catch((error) => {
        console.error("Error during signup:", error.message);
        alert("Signup failed: " + error.message);
      });
  });
  