import { getCurrentWeather, getForecast } from "./api.js";

let isCelsius = true; // default temperature unit
let currentTempCelsius = null;
// DOM Elements
const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("cityInput");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const desc = document.getElementById("description");
const extra = document.getElementById("extraInfo");
const themeToggleSwitch = document.getElementById("themeToggleSwitch");
const modeIcon = document.getElementById("modeIcon");
const currentCard = document.getElementById("currentWeather");
const forecastSection = document.getElementById("forecast");

const tempToggle = document.getElementById("tempToggle");

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggleSwitch.checked = true;
}

themeToggleSwitch.addEventListener("change", () => {
  const isDark = themeToggleSwitch.checked;
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
  modeIcon.textContent = isDark ? "🌙" : "☀️";
});

tempToggle.addEventListener("click", () => {
  if (currentTempCelsius === null) return;

  isCelsius = !isCelsius;
  updateTemperatureDisplay();
});

searchBtn.addEventListener("click", async () => {
  const city = input.value.trim();

  if (!city) {
    errorMessage.textContent = "Please enter a city name";
    return;
  }
  forecastSection.innerHTML = ""; // Clear previous forecast
  forecastSection.classList.add("hidden"); // Hide the forecast section
  currentCard.classList.add("hidden"); // Hide the current weather card
  showLoader();

  try {
    errorMessage.textContent = ""; // clear any previous error
    // Fetch current weather
    const weather = await getCurrentWeather(city);
    const forecast = await getForecast(city);

    // Set only after successful fetch
    localStorage.setItem("lastCity", city);

    renderCurrentWeather(weather);
    renderForecast(forecast);

    // Fetch forecast (Day 3 task – placeholder for now)
    // const forecast = await getForecast(city);
    // renderForecast(forecast);
  } catch (err) {
    errorMessage.textContent = err.message;
  } finally {
    hideLoader();
  }
});

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchBtn.click(); // triggers the same event as clicking the search button
  }
});

function renderCurrentWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  currentTempCelsius = data.main.temp; // this is crucial
  updateTemperatureDisplay();

  desc.textContent = `🌥️ Condition: ${data.weather[0].description}`;
  extra.textContent = `💧 Humidity: ${data.main.humidity}%,🌬️ Wind: ${data.wind.speed} m/s`;

  currentCard.classList.remove("hidden");
}

//  Update temp text based on unit
function updateTemperatureDisplay() {
  const tempValue = isCelsius
    ? `${currentTempCelsius.toFixed(1)}°C`
    : `${((currentTempCelsius * 9) / 5 + 32).toFixed(1)}°F`;

  temp.textContent = `🌡️ Temperature: ${tempValue}`;
  tempToggle.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
  document.querySelectorAll(".forecast-temp").forEach((el) => {
    const celsius = parseFloat(el.dataset.celsius);
    const tempText = isCelsius
      ? `${celsius.toFixed(1)}°C`
      : `${((celsius * 9) / 5 + 32).toFixed(1)}°F`;
    el.textContent = tempText;
  });
}

function renderForecast(data) {
  forecastSection.innerHTML = ""; // Clear previous data

  // Filter data to show one forecast per day at 12:00 PM
  const filtered = data.list.filter((item) => item.dt_txt.includes("12:00:00"));

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    const date = new Date(item.dt_txt).toDateString();
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

    card.innerHTML = `
        <h4>${date}</h4>
        <img src="${icon}" alt="${item.weather[0].description}" />
        
       <p class="forecast-temp" data-celsius="${item.main.temp}">
  ${
    isCelsius
      ? `${item.main.temp}°C`
      : `${((item.main.temp * 9) / 5 + 32).toFixed(1)}°F`
  }
</p>
        <p>${item.weather[0].description}</p>
      `;

    forecastSection.appendChild(card);
  });

  forecastSection.classList.remove("hidden");
}

//default window handler it takes hyderabad for default or else takes from the lastcitu that we are going to set

window.addEventListener("DOMContentLoaded", async () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
  const lastCity = localStorage.getItem("lastCity");
  const city = lastCity || "Hyderabad"; // Use lastCity if exists, otherwise default

  if (lastCity) input.value = lastCity;
  showLoader(); // ✅ Show loader
  try {
    const weather = await getCurrentWeather(city);
    const forecast = await getForecast(city);
    renderCurrentWeather(weather);
    renderForecast(forecast);
  } catch (err) {
    errorMessage.textContent = "Could not load initial city data.";
  } finally {
    hideLoader();
  }
});
