import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Firebase config
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

// Display logged-in user's email
onAuthStateChanged(auth, (user) => {
  const emailDisplay = document.getElementById("user-email");
  if (user && emailDisplay) {
    emailDisplay.textContent = `Logged in: ${user.email}`;
  } else if (emailDisplay) {
    emailDisplay.textContent = "Not logged in";
  }
});

document.getElementById("listingForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const location = document.getElementById("location").value;
  const size = document.getElementById("size").value;
  const imageFile = document.getElementById("image").files[0];

  if (!imageFile) {
    alert("Please upload an image!");
    return;
  }

  try {
    // Upload image to Firebase Storage
    const imageRef = ref(storage, `listing_images/${Date.now()}-${imageFile.name}`);
    const snapshot = await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // Save to Firestore
    await addDoc(collection(db, "listings"), {
      title,
      description,
      price,
      location,
      size,
      imageUrl,
      timestamp: serverTimestamp()
    });

    alert("Land listed successfully!");
    document.getElementById("listingForm").reset();
  } catch (error) {
    console.error("Error:", error);
    alert("Error listing land. Try again.");
  }
});
