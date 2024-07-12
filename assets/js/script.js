const apiKey = 'dc96194b445cc46fab554c9ac4b2d318';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const cityName = document.getElementById('city-name');
const date = document.getElementById('date');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const forecastCards = document.getElementById('forecast-cards');
const cityList = document.getElementById('city-list');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
        addToHistory(city);
    }
});

cityInput.addEventListener('input', () => {
    const query = cityInput.value;
    if (query.length > 2) { // Fetch suggestions when the input length is greater than 2
        fetchCitySuggestions(query);
    }
});

function fetchCitySuggestions(query) {
    fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            cityList.innerHTML = '';
            data.list.forEach(city => {
                const option = document.createElement('option');
                option.value = `${city.name}, ${city.sys.country}`;
                cityList.appendChild(option);
            });
        });
}

function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            const { name, main, wind, weather } = data;
            cityName.textContent = `${name} (${new Date().toLocaleDateString()})`;
            weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}" class="weather-icon"> ${weather[0].description}`;
            temperature.textContent = `Temp: ${main.temp}°F`;
            windSpeed.textContent = `Wind: ${wind.speed} MPH`;
            humidity.textContent = `Humidity: ${main.humidity}%`;
        });

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            forecastCards.innerHTML = '';
            for (let i = 0; i < data.list.length; i += 8) {
                const forecast = data.list[i];
                const forecastDate = new Date(forecast.dt_txt).toLocaleDateString();
                const forecastCard = document.createElement('div');
                forecastCard.classList.add('forecast-card');
                forecastCard.innerHTML = `
                    <p>${forecastDate}</p>
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}" class="weather-icon">
                    <p>${forecast.weather[0].description}</p>
                    <p>Temp: ${forecast.main.temp}°F</p>
                    <p>Wind: ${forecast.wind.speed} MPH</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                `;
                forecastCards.appendChild(forecastCard);
            }
        });
}

function addToHistory(city) {
    const historyItem = document.createElement('button');
    historyItem.textContent = city;
    historyItem.addEventListener('click', () => {
        getWeatherData(city);
    });
    searchHistory.appendChild(historyItem);
}