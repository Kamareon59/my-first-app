// DAY, DATE & TIME
let date = new Date();

// Day display
let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

// FORMATTING
function formatForecastDay(timestamp) {
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

function formatUnits() {
  let currentUnit = document.querySelector("#current-unit");

  if (currentUnit.innerHTML === "°C") {
    return "m/s";
  } else {
    return "m/h";
  }
}

function formatDetails(item) {
  if (item === "feelslike") {
    item = "feels like";
    return item;
  } else {
    return item;
  }
}

// SEARCH ENGINE
function handleInput(event) {
  event.preventDefault();

  let currentUnit = document.querySelector("#current-unit");
  let requestedCity = document.querySelector("#search-input");

  if (currentUnit.innerHTML === "°C") {
    search(requestedCity.value, "metric");
  } else {
    search(requestedCity.value, "imperial");
  }
}

// API Calls
function search(city, units) {
  let apiKey = "047115c33e71aaba35be74cb69e006be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios
    .get(apiUrl)
    .then(function success(response) {
      displayWeatherData(response, units);
    })
    .catch(function (error) {
      randomizer();
    });
}

function getForecast(coordinates, units) {
  let apiKey = "047115c33e71aaba35be74cb69e006be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=alerts&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayForecast);
}

// Data display (Weather, Forecast, Details)
function displayWeatherData(response, units) {
  displayDetails(response);
  getForecast(response.data.coord, units);

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
  let newWindSpeed = `${Math.round(response.data.wind.speed)} ${formatUnits()}`;

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
    <div class="col forecast-day">${formatForecastDay(forecast.dt)}</div>
    <div class="col forecast-temps"><span class="forecast-max">${Math.round(
      forecast.temp.max
    )}</span>° <span id="divider">/</span> <span class="forecast-min text-muted">${Math.round(
          forecast.temp.min
        )}</span>°</div>
    <div class="col">
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
  let detailsHTML = ``;
  let detailsElement = document.querySelector("#details");

  let details = ["feelslike", "humidity", "wind", "sunrise", "sunset"];

  details.forEach(function (item) {
    detailsHTML =
      detailsHTML +
      `<div class="row justify-content-center">
  <div class="col px-0">
    <img src="media/icons/${item}.png" alt="" height="25" weight="25" />
  </div>
  <div class="col px-1">
    <span id="${item}"></span>
  </div>
  <div class="col px-1 detail-items">${formatDetails(item)}</div>
</div>`;
  });

  detailsElement.innerHTML = detailsHTML;
}

let searchEngine = document.querySelector("form");
searchEngine.addEventListener("submit", handleInput);

// UNIT CONVERTER
function convertUnits() {
  let currentUnit = document.querySelector("#current-unit");
  let currentCity = document.querySelector("#current-city");
  let button = document.querySelector("#converter-button");

  if (currentUnit.innerHTML === "°C") {
    search(currentCity.innerHTML, "imperial");
    currentUnit.innerHTML = "°F";
    button.innerHTML = "Metric units";
  } else {
    search(currentCity.innerHTML, "metric");
    currentUnit.innerHTML = "°C";
    button.innerHTML = "Imperial units";
  }
}

let converterButton = document.querySelector("#converter-button");
converterButton.addEventListener("click", convertUnits);

// CURRENT LOCATION
function getGeoData(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let currentUnit = document.querySelector("#current-unit");
  let units = null;

  if (currentUnit.innerHTML === "°C") {
    units = "metric";
  } else {
    units = "imperial";
  }

  let apiKey = "047115c33e71aaba35be74cb69e006be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(function success(response) {
    displayWeatherData(response, units);
  });
}

function geolocator() {
  navigator.geolocation.getCurrentPosition(getGeoData);
}

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", geolocator);

// RANDOM LOCATION
// Latitude (-90 to +90)
function latitudeGenerator() {
  let lat = (Math.random() * 90).toFixed(3) * 1;
  let posorneg = Math.floor(Math.random());
  if (posorneg === 0) {
    lat = lat * -1;
  }
  return lat;
}

// Longitude (-180 to + 180)
function longitudeGenerator() {
  let lon = (Math.random() * 180).toFixed(3) * 1;
  let posorneg = Math.floor(Math.random());
  if (posorneg === 0) {
    lon = lon * -1;
  }
  return lon;
}

function randomizer() {
  let lat = latitudeGenerator();
  let lon = longitudeGenerator();

  let apiKey = "047115c33e71aaba35be74cb69e006be";
  let apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=10&appid=${apiKey}`;

  axios.get(apiUrl).then(displayRandomLocation);
}

function displayRandomLocation(response) {
  if (response.data[0] !== undefined) {
    search(response.data[0].name, "metric");
  } else {
    randomizer();
  }
}

let randomLocationButton = document.querySelector("#random-button");
randomLocationButton.addEventListener("click", randomizer);

// DEFAULT DATA
search("amsterdam", "metric");
let searchBar = document.querySelector("#search-input");
searchBar.value = null;
