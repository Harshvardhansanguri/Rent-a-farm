// ✅ Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyKOLfK_LMIQUYbJ1pGIbI-wV9yCqHA3I",
  authDomain: "rentafarm-2e5c2.firebaseapp.com",
  projectId: "rentafarm-2e5c2",
  storageBucket: "rentafarm-2e5c2.appspot.com",
  messagingSenderId: "898870527321",
  appId: "1:898870527321:web:bcc1d0723e2da3d80a3848",
  measurementId: "G-717F1GY0NN"
};

// ✅ Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Keep track of C or F
let currentUnit = "C";

// ✅ DOM Ready
window.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, user => {
    if (!user) location.href = "login.html";
  });

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () =>
      signOut(auth).then(() => location.href = "login.html")
    );
  }

  loadSearchHistory();

  // If user picks a historic search:
  document.getElementById("recent-searches")
    .addEventListener("change", e => {
      if (e.target.value) {
        document.getElementById("location").value = e.target.value;
        getWeather();
      }
    });
});

// ✅ Fetch & display weather
export async function getWeather() {
  const loc = document.getElementById("location").value.trim();
  if (!loc) return alert("Please enter a location!");

  try {
    const apiKey = "7046a2ad586845b98f1152852252204";
    const proxy  = "http://localhost:8080/";
    const res    = await fetch(`${proxy}https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${loc}`);

    if (!res.ok) throw new Error("Invalid location or API issue");
    const json = await res.json();
    const c   = json.current;

    // Update UI
    document.getElementById("condition-text").textContent = c.condition.text;
    document.getElementById("icon").src = `https:${c.condition.icon}`;
    document.getElementById("icon").alt = c.condition.text;

    document.getElementById("temperature").textContent = `${c.temp_c}°C`;
    document.getElementById("feels-like").textContent  = `Feels Like: ${c.feelslike_c}°C`;
    document.getElementById("humidity").textContent    = `${c.humidity}%`;
    document.getElementById("wind-speed").textContent  = `${c.wind_kph} kph`;

    const tip = c.temp_c > 35
      ? "High temperature — ensure crops are well irrigated!"
      : c.temp_c < 15
        ? "Cold weather — consider frost protection."
        : "Weather looks good for most crops.";
    document.getElementById("tips").textContent = tip;

    // Fade the results in
    const out = document.getElementById("weather-output");
    out.classList.remove("opacity-0");
    out.classList.add("fade-in-up");

    // Save & reload history
    updateSearchHistory(loc);

  } catch (err) {
    console.error("Error fetching weather:", err);
    alert("Failed to fetch weather. Please check the location or try again.");
  }
}

// Make it available to inline onclick
window.getWeather = getWeather;

// ✅ Toggle C ↔ F
export function toggleTempUnit() {
  const tEl = document.getElementById("temperature");
  const fEl = document.getElementById("feels-like");

  // parse out just the number
  const toNum = s => parseFloat(s.replace(/[^0-9.-]/g, ""));
  let tVal = toNum(tEl.textContent);
  let fVal = toNum(fEl.textContent);

  if (currentUnit === "C") {
    // to Fahrenheit
    tVal = (tVal * 9/5) + 32;
    fVal = (fVal * 9/5) + 32;
    tEl.textContent = `${tVal.toFixed(1)}°F`;
    fEl.textContent = `Feels Like: ${fVal.toFixed(1)}°F`;
    currentUnit = "F";
  } else {
    // back to Celsius
    tVal = (tVal - 32) * 5/9;
    fVal = (fVal - 32) * 5/9;
    tEl.textContent = `${tVal.toFixed(1)}°C`;
    fEl.textContent = `Feels Like: ${fVal.toFixed(1)}°C`;
    currentUnit = "C";
  }
}
window.toggleTempUnit = toggleTempUnit;

// ✅ Search History (last 3)
function updateSearchHistory(loc) {
  let hist = JSON.parse(localStorage.getItem("weatherSearchHistory") || "[]");
  hist = [loc, ...hist.filter(x => x !== loc)].slice(0,3);
  localStorage.setItem("weatherSearchHistory", JSON.stringify(hist));
  loadSearchHistory();
}
function loadSearchHistory() {
  const dd = document.getElementById("recent-searches");
  dd.innerHTML = `<option value="">Last 3 Searches</option>`;
  JSON.parse(localStorage.getItem("weatherSearchHistory") || "[]")
    .forEach(loc => {
      const o = document.createElement("option");
      o.value = o.textContent = loc;
      dd.appendChild(o);
    });
}
