// --- DOM Elements ---
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherDisplay = document.getElementById('weather-display');
const errorMessage = document.getElementById('error-message');
const loadingAnimation = document.getElementById('loading-animation');

const cityNameEl = document.getElementById('city-name');
const weatherDescriptionEl = document.getElementById('weather-description');
const weatherIconEl = document.getElementById('weather-icon');
const temperatureEl = document.getElementById('temperature');
const feelsLikeEl = document.getElementById('feels-like');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

// --- API Configuration ---
// !! IMPORTANT: Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key !!
const apiKey = '4343edeeb230f5e1b0cf31edb33145dc';
const weatherApiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';

// --- Functions ---

/**
 * Fetches weather data from the API.
 * @param {string} city - The name of the city to get weather for.
 */
async function fetchWeatherData(city) {
    // Show loading animation and hide previous results/errors
    showLoading();
    hideWeatherDisplay();
    hideError();

    try {
        const response = await fetch(`${weatherApiBaseUrl}?q=${city}&appid=${apiKey}&units=metric`); // units=metric for Celsius

        if (!response.ok) {
            // Handle non-OK responses (e.g., 404 City Not Found, 401 Invalid API Key)
            const errorData = await response.json();
            throw new Error(errorData.message || 'City not found. Please check the city name.');
        }

        const data = await response.json();
        console.log('API Response Data:', data); // Log the data to inspect it
        displayWeather(data);

    } catch (error) {
        // Handle network errors or errors thrown from the response check
        console.error('Error fetching weather data:', error);
        displayError(error.message);
    } finally {
        // This block always executes, whether try succeeded or caught an error
        hideLoading();
    }
}

/**
 * Displays the fetched weather data on the UI.
 * @param {object} data - The weather data object from the API.
 */
function displayWeather(data) {
    if (!data) return;

    const { name, weather, main, wind } = data;
    const description = weather[0].description;
    const iconCode = weather[0].icon;
    const temp = main.temp;
    const feelsLike = main.feels_like;
    const humidity = main.humidity;
    const windSpeed = wind.speed;

    // Construct the icon URL
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Update UI elements
    cityNameEl.textContent = name;
    weatherDescriptionEl.textContent = description.charAt(0).toUpperCase() + description.slice(1); // Capitalize first letter
    weatherIconEl.src = iconUrl;
    weatherIconEl.alt = description; // Alt text for accessibility

    temperatureEl.textContent = `${temp}°C`;
    feelsLikeEl.textContent = `${feelsLike}°C`;
    humidityEl.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${windSpeed} km/h`; // OpenWeatherMap provides speed in m/s, but often displayed as km/h based on units

    showWeatherDisplay();
}

/**
 * Displays an error message to the user.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
    errorMessage.textContent = `❌ ${message}`;
    showError();
}

/**
 * Handles the search button click event.
 */
function handleSearch() {
    const city = cityInput.value.trim(); // Get city name and remove whitespace
    if (city) { // Only search if the input is not empty
        fetchWeatherData(city);
    } else {
        displayError('Please enter a city name.');
        hideWeatherDisplay(); // Hide any previous weather display
    }
}

// --- UI Visibility Toggles ---
function showWeatherDisplay() { weatherDisplay.classList.remove('hidden'); }
function hideWeatherDisplay() { weatherDisplay.classList.add('hidden'); }
function showError() { errorMessage.classList.remove('hidden'); }
function hideError() { errorMessage.classList.add('hidden'); }
function showLoading() { loadingAnimation.classList.remove('hidden'); }
function hideLoading() { loadingAnimation.classList.add('hidden'); }

// --- Event Listeners ---
searchButton.addEventListener('click', handleSearch);

// Optional: Allow searching by pressing Enter key in the input field
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Initial state: Hide weather display and error until a search is performed
hideWeatherDisplay();
hideError();

