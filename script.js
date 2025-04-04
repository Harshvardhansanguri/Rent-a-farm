// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2t0WFk7wV9kUxx0n-xZYbAhW46HCZeuM",
    authDomain: "rentafarm-be46f.firebaseapp.com",
    projectId: "rentafarm-be46f",
    storageBucket: "rentafarm-be46f.appspot.com",
    messagingSenderId: "566507900449",
    appId: "1:566507900449:web:86353ad73901d46b45dd60"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Function to show login form
function showLogin() {
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "none";
}

// Function to show signup form
function showRegister() {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "block";
}

// Function to log in user
function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            if (userCredential.user.emailVerified) {
                alert("Login successful!");
                window.location.href = "dashboard.html";
            } else {
                alert("Please verify your email before logging in.");
            }
        })
        .catch(error => alert("Error: " + error.message));
}

// Function to register user
function registerUser(event) {
    event.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            auth.currentUser.sendEmailVerification()
                .then(() => alert("Verification email sent. Please check your inbox."))
                .catch(error => alert("Error sending email: " + error.message));
        })
        .catch(error => alert("Error: " + error.message));
}

// Initialize
showLogin();
