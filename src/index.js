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

// SEARCH ENGINE
function changeCity(event) {
  event.preventDefault();
  let requestedCity = document.querySelector("#search-input");

  let unit = "metric";
  let apiKey = "047115c33e71aaba35be74cb69e006be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${requestedCity.value}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayCity);
}

function displayCity(response) {
  let currentCity = document.querySelector("#current-city");
  let requestedCity = response.data.name;

  currentCity.innerHTML = requestedCity;
}

function changeWeatherData(event) {
  event.preventDefault();
  let requestedCity = document.querySelector("#search-input");

  let unit = "metric";
  let apiKey = "047115c33e71aaba35be74cb69e006be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${requestedCity.value}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(getWeatherData);
}

function getWeatherData(response) {
  let currentTemp = document.querySelector("#current-temp");
  let newTemp = Math.round(response.data.main.temp);

  let currentDescription = document.querySelector("#description");
  let newDescription = response.data.weather[0].description;

  let currentHumidity = document.querySelector("#humidity");
  let newHumidity = `${response.data.main.humidity}% `;

  let currentWindSpeed = document.querySelector("#wind-speed");
  let newWindSpeed = `${Math.round(response.data.wind.speed)} m/s`;

  currentTemp.innerHTML = newTemp;
  currentDescription.innerHTML = newDescription;
  currentHumidity.innerHTML = newHumidity;
  currentWindSpeed.innerHTML = newWindSpeed;
}

let searchEngine = document.querySelector("form");
searchEngine.addEventListener("submit", changeCity);
searchEngine.addEventListener("submit", changeWeatherData);

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

  if (currentUnit.innerHTML === " °C") {
    currentTemp.innerHTML = convertToF(currentTemp.innerHTML);
    currentUnit.innerHTML = " °F";
    button.innerHTML = "°F to °C";
  } else {
    currentTemp.innerHTML = convertToC(currentTemp.innerHTML);
    currentUnit.innerHTML = " °C";
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

  axios.get(apiUrl).then(changeData);
}

function changeData(response) {
  let currentCity = document.querySelector("#current-city");
  let newCity = response.data.name;

  let currentTemp = document.querySelector("#current-temp");
  let newTemp = Math.round(response.data.main.temp);

  currentTemp.innerHTML = newTemp;
  currentCity.innerHTML = newCity;
}

function geolocator() {
  navigator.geolocation.getCurrentPosition(getGeoData);
}

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", geolocator);
