import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Initialize Firebase authentication (optional, if needed)
const auth = getAuth();

// Display logged-in user's email
onAuthStateChanged(auth, (user) => {
  const emailDisplay = document.getElementById("user-email");
  if (user && emailDisplay) {
    emailDisplay.textContent = `Logged in: ${user.email}`;
  } else if (emailDisplay) {
    emailDisplay.textContent = "Not logged in";
  }
});

// Logout functionality
document.getElementById("logout").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "login.html"; // Redirect to login page after logout
  }).catch((error) => {
    console.error("Logout error:", error);
  });
});

const searchBtn = document.getElementById('search-btn');
const locationInput = document.getElementById('location');
const weatherInfo = document.getElementById('weather-info');
const locationName = document.getElementById('location-name');
const tempElement = document.getElementById('temp');
const humidityElement = document.getElementById('humidity');
const windspeedElement = document.getElementById('windspeed');
const cropTipsElement = document.getElementById('crop-tips');

searchBtn.addEventListener('click', async () => {
  const location = locationInput.value.trim();
  if (location) {
    // Replace with your OpenWeatherMap API key
    const apiKey = 'your-api-key';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        // Display weather data
        locationName.textContent = data.name;
        tempElement.textContent = `Temperature: ${data.main.temp}°C`;
        humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
        windspeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;

        // Display crop tips based on temperature (example logic)
        const temp = data.main.temp;
        if (temp < 15) {
          cropTipsElement.innerHTML = 'Cold-weather crops like spinach, kale, and lettuce will thrive.';
        } else if (temp >= 15 && temp <= 25) {
          cropTipsElement.innerHTML = 'Ideal for growing tomatoes, cucumbers, and peppers.';
        } else {
          cropTipsElement.innerHTML = 'Hot-weather crops like beans, okra, and melons are recommended.';
        }

        weatherInfo.classList.remove('hidden');
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error fetching weather data', error);
    }
  }
});
