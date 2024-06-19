function getWeather() {
    // API key for accessing OpenWeatherMap API
    const apiKey = '92faeb65301b2a4bf2c269c76838a193';
    
    // Retrieve the city entered by the user from the input field
    const city = document.getElementById('city').value;

    // Check if the user has entered a city name
    if (!city) {
        alert('Please enter a city');
        return;
    }

    // URLs for fetching current weather and forecast data for the entered city
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather data from OpenWeatherMap API
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            // Call function to display current weather data
            displayWeather(data);
        })
        .catch(error => {
            // Log and alert if there's an error fetching current weather data
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch hourly forecast data from OpenWeatherMap API
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            // Call function to display hourly forecast data
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            // Log and alert if there's an error fetching hourly forecast data
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    // Get references to HTML elements where weather information will be displayed
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    // Check if the response indicates a city not found
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        // Extract necessary data from the API response
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // HTML content for temperature and weather description
        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;
        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        // Update HTML elements with weather information
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        // Show the weather icon image
        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    // Get reference to HTML element where hourly forecast will be displayed
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Extract data for the next 24 hours (3-hour intervals)
    const next24Hours = hourlyData.slice(0, 8);

    // Iterate through hourly data and generate HTML for each hour
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // HTML content for hourly forecast item
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        // Append hourly forecast HTML to the container
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    // Get reference to weather icon element
    const weatherIcon = document.getElementById('weather-icon');
    // Make the weather icon visible
    weatherIcon.style.display = 'block';
}