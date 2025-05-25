function getWeather() {
    const apiKey = "a5fd3324bcf56a33c0be3c24487cf6fa"; // ← Replace this with your real API key
    const city = document.getElementById('city').value.trim();
    const errorDiv = document.getElementById('error-message');

    if (!city) {
        showError("Please enter a city.");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Clear old results
    clearUI();

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                showError("City not found.");
            } else {
                displayWeather(data);
            }
        })
        .catch(error => {
            console.error("Weather error:", error);
            showError("Failed to fetch weather data.");
        });

    // Fetch forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error("Forecast error:", error);
            showError("Failed to fetch forecast data.");
        });
}

function displayWeather(data) {
    const tempDiv = document.getElementById('temp-div');
    const infoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    tempDiv.innerHTML = `<p>${temperature}°C</p>`;
    infoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = "block";
}

function displayHourlyForecast(hourlyData) {
    const forecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8); // 8 x 3-hour intervals

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours().toString().padStart(2, '0');
        const temp = Math.round(item.main.temp - 273.15);
        const icon = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

        forecastDiv.innerHTML += `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Icon">
                <span>${temp}°C</span>
            </div>
        `;
    });
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerText = message;
}

function clearUI() {
    document.getElementById('temp-div').innerHTML = '';
    document.getElementById('weather-info').innerHTML = '';
    document.getElementById('hourly-forecast').innerHTML = '';
    document.getElementById('error-message').innerText = '';
    document.getElementById('weather-icon').style.display = 'none';
}

