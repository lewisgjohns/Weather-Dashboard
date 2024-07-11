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

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
        addToHistory(city);
    }
});
// get weather function
function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            const { name, main, wind, weather } = data;
            cityName.textContent = `${name} (${new Date().toLocaleDateString()})`;
            weatherIcon.textContent = weather[0].description;
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