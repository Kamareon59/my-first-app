// DAY, DATE & TIME
let date = new Date();

// Day display
let weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
let currentDay = weekdays[date.getDay()];

let weekday = document.querySelector("#weekday");
weekday.innerHTML = currentDay;

// Date display
let dayDate = (date.getDate() < 10 ? "0" : "") + date.getDate();

let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let currentMonth = months[date.getMonth()];

let fulldate = document.querySelector("#fulldate");
fulldate.innerHTML = `${dayDate}/${currentMonth}/${date.getFullYear()}`;

// Time display
let hours = date.getHours();
let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

let time = document.querySelector("#time");
time.innerHTML = `${hours}:${minutes}`;

// Forecast & Details display
function formatTimestamp(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  return weekdays[day];
}

function formatSuntimes(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

  return `${hours}:${minutes}`;
}

// SEARCH ENGINE
function handleInput(event) {
  event.preventDefault();

  // Resets converter
  let currentUnit = document.querySelector("#current-unit");
  let button = document.querySelector("#converter-button");

  if (currentUnit.innerHTML === "°F") {
    currentUnit.innerHTML = "°C";
    button.innerHTML = "°C to °F";
  }

  // Runs search
  let requestedCity = document.querySelector("#search-input");
  search(requestedCity.value);
}

// API Calls
function search(city) {
  let units = "metric";
  let apiKey = "047115c33e71aaba35be74cb69e006be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeatherData);
}

function getForecast(coordinates) {
  let units = "metric";
  let apiKey = "047115c33e71aaba35be74cb69e006be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=alerts&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayForecast);
}

// Data display (Weather, Forecast, Details)
function displayWeatherData(response) {
  displayDetails(response);

  let icon = document.querySelector("#main-icon");
  icon.setAttribute("src", `/media/icons/${response.data.weather[0].icon}.png`);

  let currentCity = document.querySelector("#current-city");
  let requestedCity = response.data.name;

  let currentTemp = document.querySelector("#current-temp");
  let newTemp = Math.round(response.data.main.temp);

  let currentDescription = document.querySelector("#description");
  let newDescription = response.data.weather[0].description;

  let currentFeels = document.querySelector("#feelslike");
  let newFeels = `${Math.round(response.data.main.feels_like)}°`;

  let currentHumidity = document.querySelector("#humidity");
  let newHumidity = `${response.data.main.humidity}% `;

  let currentWindSpeed = document.querySelector("#wind");
  let newWindSpeed = `${Math.round(response.data.wind.speed)} m/s`;

  let currentSunrise = document.querySelector("#sunrise");
  let newSunrise = formatSuntimes(response.data.sys.sunrise);

  let currentSunset = document.querySelector("#sunset");
  let newSunset = formatSuntimes(response.data.sys.sunset);

  currentCity.innerHTML = requestedCity;
  currentTemp.innerHTML = newTemp;
  currentDescription.innerHTML = newDescription;
  currentFeels.innerHTML = newFeels;
  currentHumidity.innerHTML = newHumidity;
  currentWindSpeed.innerHTML = newWindSpeed;
  currentSunrise.innerHTML = newSunrise;
  currentSunset.innerHTML = newSunset;

  getForecast(response.data.coord);
}

function displayForecast(response) {
  let forecastData = response.data.daily;
  let forecastHTML = ``;
  let forecastElement = document.querySelector("#forecast");

  forecastData.forEach(function (forecast, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="row justify-content-center">
    <div class="col forecast-day">${formatTimestamp(forecast.dt)}</div>
    <div class="col forecast-temps">${Math.round(
      forecast.temp.max
    )}° <span id="divider">/</span> <span class="text-muted">${Math.round(
          forecast.temp.min
        )}°</span></div>
    <div class="col forecast-icon">
    <img
    src="media/icons/${forecast.weather[0].icon}.png"
    alt=""
    height="25"
    weight="25"
    />
    </div>
    </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function displayDetails(response) {
  // let detailsData = response.data;
  let detailsHTML = ``;
  let detailsElement = document.querySelector("#details");

  let details = ["feelslike", "humidity", "wind", "sunrise", "sunset"];

  details.forEach(function (item) {
    detailsHTML =
      detailsHTML +
      `<div class="row justify-content-center">
  <div class="col">
    <img src="media/icons/${item}.png" alt="" height="25" weight="25" />
  </div>
  <div class="col">
    <span id="${item}"></span>
  </div>
  <div class="col detail-items">${item}</div>
</div>`;
  });

  detailsElement.innerHTML = detailsHTML;
}

let searchEngine = document.querySelector("form");
searchEngine.addEventListener("submit", handleInput);

// UNIT CONVERTER
function convertToF(tempC) {
  let tempF = Math.round((tempC * 9) / 5 + 32);
  return tempF;
}

function convertToC(tempF) {
  let tempC = Math.round(((tempF - 32) * 5) / 9);
  return tempC;
}

function convertTemp() {
  let currentUnit = document.querySelector("#current-unit");
  let currentTemp = document.querySelector("#current-temp");
  let button = document.querySelector("#converter-button");

  if (currentUnit.innerHTML === "°C") {
    currentTemp.innerHTML = convertToF(currentTemp.innerHTML);
    currentUnit.innerHTML = "°F";
    button.innerHTML = "°F to °C";
  } else {
    currentTemp.innerHTML = convertToC(currentTemp.innerHTML);
    currentUnit.innerHTML = "°C";
    button.innerHTML = "°C to °F";
  }
}

let converterButton = document.querySelector("#converter-button");
converterButton.addEventListener("click", convertTemp);

// CURRENT LOCATION
function getGeoData(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "047115c33e71aaba35be74cb69e006be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherData);
}

function geolocator() {
  navigator.geolocation.getCurrentPosition(getGeoData);
}

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", geolocator);

// DEFAULT DATA
search("amsterdam");
let searchBar = document.querySelector("#search-input");
searchBar.value = null;
