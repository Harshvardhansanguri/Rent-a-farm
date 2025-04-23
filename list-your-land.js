// 1️⃣ Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 2️⃣ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCyKOLfK_LMIQUYbJ1pGIbI-wV9yCqHA3I",
  authDomain: "rentafarm-2e5c2.firebaseapp.com",
  projectId: "rentafarm-2e5c2",
  storageBucket: "rentafarm-2e5c2.firebasestorage.app",
  messagingSenderId: "898870527321",
  appId: "1:898870527321:web:bcc1d0723e2da3d80a3848",
  measurementId: "G-717F1GY0NN"
};

// 3️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 4️⃣ Auth state listener
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("✅ Authenticated user:", user.email);
  } else {
    console.log("❌ Not authenticated");
  }
});

// 5️⃣ Logout button
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.href = "login.html";
      })
      .catch(err => console.error("Logout error:", err));
  });
}

// 6️⃣ Land listing form
const listingForm = document.getElementById("listingForm");
listingForm.addEventListener("submit", async event => {
  event.preventDefault();

  // Collect form data
  const title       = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const price       = document.getElementById("price").value.trim();
  const location    = document.getElementById("location").value.trim();
  const size        = document.getElementById("size").value.trim();
  const imageFile   = document.getElementById("image").files[0];

  // Basic validation
  if (!title || !description || !price || !location || !size) {
    return alert("Please fill all fields.");
  }

  if (!imageFile) {
    return alert("Please upload an image!");
  }

  try {
    console.log("📷 Image File Info:", imageFile);
  
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(imageFile.type)) {
      return alert("Unsupported file type. Please upload JPG or PNG image.");
    }
  
    const sanitizedFileName = imageFile.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
    const storagePath = `listing_images/${Date.now()}_${sanitizedFileName}`;
    console.log("📤 Uploading to:", storagePath);
  
    const imageRef = ref(storage, storagePath);
    const snap = await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(snap.ref);
  
    console.log("✅ Uploaded! Image URL:", imageUrl);
  
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
    listingForm.reset();
  
  } catch (err) {
    console.error("🔥 Upload or listing error:", err);
    alert("Upload failed: " + (err.message || "Unknown error"));
  }
  
});
