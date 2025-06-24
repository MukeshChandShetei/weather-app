const API_KEY = "25a38333fedfd06cba4e1cba13db6d58"; // 🔑 Replace this with your OpenWeatherMap API Key
const loader = document.getElementById("loader");
// Get current weather for a city
export async function getCurrentWeather(city) {
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  loader.style.display = "block";

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error("Wrong city entered");
    }

    const data = await res.json();
    return data;
  } finally {
    loader.style.display = "none";
  }
}

// Get 5-day forecast
export async function getForecast(city) {
  const endpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  loader.style.display = "block";
  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error("Forecast data not found");
    }

    const data = await res.json();
    return data;
  } finally {
    loader.style.display = "none";
  }
}
