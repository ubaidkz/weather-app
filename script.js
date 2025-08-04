// Weather App - Complete JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cityInput = document.getElementById('city');
    const searchBtn = document.getElementById('search-btn');
    const tempDiv = document.getElementById('temp-div');
    const weatherInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecast = document.getElementById('hourly-forecast');
    const unitToggle = document.getElementById('unit-toggle');
    
    // Configuration
    const API_KEY = "0d5f2e624252890bc0a557b55fc87736"; // Note: In production, use backend for API calls
    let currentUnit = 'metric'; // Default to Celsius
    
    // Initialize the app
    function init() {
        // Set up event listeners
        searchBtn.addEventListener('click', getWeather);
        cityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') getWeather();
        });
        unitToggle.addEventListener('click', toggleUnits);
        
        // Set initial unit toggle text
        updateUnitToggleText();
    }

    // Main weather fetching function
    async function getWeather() {
        const city = cityInput.value.trim();
        
        if (!city) {
            showError("Please enter a city name.");
            return;
        }

        showLoading();
        
        try {
            const currentWeather = await fetchCurrentWeather(city);
            displayWeather(currentWeather);
            
            // Optional: Fetch hourly forecast
            // await getHourlyForecast(city);
        } catch (error) {
            console.error("Error:", error);
            showError(error.message || "Could not fetch weather data. Please check the city name and try again.");
        }
    }

    // Fetch current weather data from API
    async function fetchCurrentWeather(city) {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${currentUnit}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "City not found");
        }

        return await response.json();
    }

    // Display weather data in the UI
    function displayWeather(data) {
        const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
        const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph';
        
        tempDiv.innerHTML = `
            <span class="current-temp">${Math.round(data.main.temp)}${tempUnit}</span>
            <span class="feels-like">Feels like: ${Math.round(data.main.feels_like)}${tempUnit}</span>
        `;
        
        weatherInfo.innerHTML = `
            <p><strong>${data.name}, ${data.sys.country}</strong></p>
            <p>${capitalizeFirstLetter(data.weather[0].description)}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${Math.round(data.wind.speed)} ${windUnit}</p>
            <p>Pressure: ${data.main.pressure} hPa</p>
        `;
        
        // Weather icon
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.style.display = "block";
        weatherIcon.alt = data.weather[0].description;
    }

    // Toggle between Celsius and Fahrenheit
    function toggleUnits() {
        currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
        updateUnitToggleText();
        
        // Refresh weather if we already have data
        if (cityInput.value.trim()) {
            getWeather();
        }
    }

    // Update unit toggle button text
    function updateUnitToggleText() {
        unitToggle.textContent = `Switch to ${currentUnit === 'metric' ? 'Fahrenheit' : 'Celsius'}`;
    }

    // Show loading state
    function showLoading() {
        tempDiv.textContent = "Loading weather data...";
        weatherInfo.textContent = "";
        weatherIcon.style.display = "none";
        hourlyForecast.innerHTML = "";
    }

    // Show error message
    function showError(message) {
        tempDiv.textContent = message;
        weatherInfo.textContent = "";
        weatherIcon.style.display = "none";
        hourlyForecast.innerHTML = "";
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Initialize the app
    init();
});