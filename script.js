// ========== GLOBALS ==========
const API_KEY = '47f1779c2941108f3d1f897c97a50428';
const baseURL = 'https://api.openweathermap.org/data/2.5/';
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const themeToggle = document.getElementById('themeToggle');

// ========== SEARCH ==========
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeatherByCity(city);
  else alert("Please enter a city name.");
});

// ========== GEOLOCATION ==========
locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  } else {
    alert("Geolocation not supported by your browser.");
  }
});

// ========== FETCH WEATHER ==========
function fetchWeatherByCity(city) {
  const url = `${baseURL}weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("City not found or API error.");
      return res.json();
    })
    .then(data => updateUI(data))
    .catch(err => alert(err.message));
}

function fetchWeatherByCoords(lat, lon) {
  const url = `${baseURL}weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Location fetch failed.");
      return res.json();
    })
    .then(data => updateUI(data))
    .catch(err => alert(err.message));
}

// ========== UPDATE UI ==========
function updateUI(data) {
  document.getElementById('cityName').textContent = data.name;
  document.getElementById('currentTemp').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('wind').textContent = `${data.wind.speed} km/h`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
  document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  document.getElementById('weatherDesc').textContent = data.weather[0].description;
  document.getElementById('weatherIcon').textContent = getWeatherEmoji(data.weather[0].main);
  document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise);
  document.getElementById('sunset').textContent = formatTime(data.sys.sunset);
  updateBackground(data.weather[0].main);
  updateSuggestions(data.main.temp, data.weather[0].main);
}

// ========== TIME FORMAT ==========
function formatTime(unix) {
  return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ========== WEATHER EMOJIS ==========
function getWeatherEmoji(condition) {
  const map = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧️',
    Snow: '❄️', Thunderstorm: '🌩️', Drizzle: '🌦️',
    Mist: '🌫️', Haze: '🌁', Smoke: '🚬'
  };
  return map[condition] || '❓';
}

// ========== BACKGROUND ==========
function updateBackground(condition) {
  const bgMap = {
    Clear: 'linear-gradient(180deg, #FFDC8B, #FFD6C0)',
    Rain: 'linear-gradient(180deg, #BCC1CD, #A3D8F4)',
    Clouds: 'linear-gradient(180deg, #F9FAFB, #A3D8F4)',
    Snow: 'linear-gradient(180deg, #D6C9F0, #F9FAFB)',
    Thunderstorm: 'linear-gradient(180deg, #2D3A4B, #A3D8F4)'
  };
  document.body.style.background = bgMap[condition] || '#F9FAFB';
}

// ========== SUGGESTIONS ==========
function updateSuggestions(temp, condition) {
  const tip = document.getElementById('weatherTip');
  const clothing = document.getElementById('clothingSuggest');
  const alert = document.getElementById('healthAlert');

  if (temp >= 30) {
    tip.textContent = "Drink water & stay in shade.";
    clothing.textContent = "Wear light cottons.";
    alert.textContent = "UV index might be high!";
  } else if (temp <= 10) {
    tip.textContent = "Stay warm and layered!";
    clothing.textContent = "Coats & woollens recommended.";
    alert.textContent = "Protect from cold air.";
  } else {
    tip.textContent = "Enjoy your day out!";
    clothing.textContent = "Comfortable clothes suggested.";
    alert.textContent = condition.includes("Rain") ? "Carry umbrella!" : "No alerts.";
  }
}

// ========== DARK MODE ==========
themeToggle.addEventListener('change', () => {
  document.body.style.background = themeToggle.checked
    ? 'linear-gradient(180deg, #2D3A4B, #D6C9F0)' // Dark
    : 'linear-gradient(180deg, #FFDC8B, #FFD6C0)'; // Light
});

// ========== LIVE CLOCK ==========
function updateClock() {
  const now = new Date();
  document.getElementById('localTime').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

// ========== OFFLINE ==========
function checkOffline() {
  const status = document.getElementById('offlineStatus');
  status.textContent = navigator.onLine ? "Inactive" : "Active";
}
window.addEventListener("online", checkOffline);
window.addEventListener("offline", checkOffline);
checkOffline();

// ========== INITIAL ==========
fetchWeatherByCity("Mumbai"); // Default city on load
updateClock();
