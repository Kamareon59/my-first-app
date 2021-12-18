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
function handleInput(event) {
  event.preventDefault();

  // Resets converter
  let currentUnit = document.querySelector("#current-unit");
  let button = document.querySelector("#converter-button");

  if (currentUnit.innerHTML === " °F") {
    currentUnit.innerHTML = " °C";
    button.innerHTML = "°C to °F";
  }

  // Runs search
  let requestedCity = document.querySelector("#search-input");
  search(requestedCity.value);
}

function search(city) {
  let units = "metric";
  let apiKey = "047115c33e71aaba35be74cb69e006be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(changeWeatherData);
}

function changeWeatherData(response) {
  let currentCity = document.querySelector("#current-city");
  let requestedCity = response.data.name;

  let currentTemp = document.querySelector("#current-temp");
  let newTemp = Math.round(response.data.main.temp);

  let currentDescription = document.querySelector("#description");
  let newDescription = response.data.weather[0].description;

  let currentHumidity = document.querySelector("#humidity");
  let newHumidity = `${response.data.main.humidity}% `;

  let currentWindSpeed = document.querySelector("#wind-speed");
  let newWindSpeed = `${Math.round(response.data.wind.speed)} m/s`;

  currentCity.innerHTML = requestedCity;
  currentTemp.innerHTML = newTemp;
  currentDescription.innerHTML = newDescription;
  currentHumidity.innerHTML = newHumidity;
  currentWindSpeed.innerHTML = newWindSpeed;
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

  axios.get(apiUrl).then(changeWeatherData);
}

function geolocator() {
  navigator.geolocation.getCurrentPosition(getGeoData);
}

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", geolocator);

//DEFAULT DATA
search("amsterdam");
let searchBar = document.querySelector("#search-input");
searchBar.value = null;
