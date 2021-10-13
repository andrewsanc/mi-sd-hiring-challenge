import { convertDate } from "./utils";

const cloudy = require("../img/cloudy.png");
const rain = require("../img/rain.png");
const snow = require("../img/snow.png");
const sunny = require("../img/sunny.png");
const weatherIcons = {
  cloudy,
  rain,
  snow,
  sunny,
};

fetch("https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=20001")
  .then((res) => {
    return res.json();
  })
  .then(({ latitude, longitude, city, regionCode }) => {
    const app = document.getElementById("app");
    const date = new Date();
    const today = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    const header = document.createElement("h3");
    header.setAttribute("class", "header");
    header.innerHTML = `Weather Forecast for ${city}, ${regionCode}`;

    const forecast = document.createElement("div");
    forecast.setAttribute("class", "forecast flex-row");
    forecast.setAttribute("id", "forecast");

    app.append(header, forecast);

    fetch(
      `https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=${latitude}&longitude=-${longitude}&date=${today}`
    )
      .then((res) => {
        return res.json();
      })
      .then(({ daily }) => {
        daily.data.forEach((dailyWeather, index) => {
          if (index > 2) return;
          renderWeatherCard(dailyWeather, index);
        });
      });
  })
  .catch((err) => {
    console.log(err);
  });

function renderWeatherCard(weatherData, index) {
  const forecast = document.getElementById("forecast");
  const weatherCard = document.createElement("div");
  weatherCard.setAttribute("class", "card flex-col");

  // Forecast day
  const dayName =
    index == 0
      ? "Today"
      : getDayName(new Date(convertDate(weatherData.time)).getDay());
  const dayOfTheWeek = document.createElement("h4");
  dayOfTheWeek.setAttribute("class", "card-header");
  dayOfTheWeek.innerHTML = `${dayName}`;
  weatherCard.appendChild(dayOfTheWeek);

  const weatherCardContents = document.createElement("div");
  weatherCardContents.setAttribute("class", "card-contents flex-row");

  // Forecast Image
  const weatherIcon = document.createElement("img");
  weatherIcon.src = `${weatherIcons[weatherData.icon]}`;
  weatherCardContents.appendChild(weatherIcon);

  const weatherCardContentInfo = document.createElement("div");
  weatherCardContentInfo.setAttribute("class", "card-content-info");
  // Forecast Summary
  const weatherSum = document.createElement("p");
  weatherSum.innerHTML = `${weatherData.icon}`;

  // Forecast Temp
  const weatherTempHi = document.createElement("span");
  weatherTempHi.setAttribute("class", "temp-hi");
  weatherTempHi.innerHTML = `${Math.round(weatherData.temperatureHigh)}° / `;
  const weatherTempLo = document.createElement("span");
  weatherTempLo.innerHTML = `${Math.round(weatherData.temperatureLow)}° F`;

  weatherCardContentInfo.append(weatherSum, weatherTempHi, weatherTempLo);
  weatherCardContents.appendChild(weatherCardContentInfo);
  weatherCard.appendChild(weatherCardContents);

  forecast.appendChild(weatherCard);
}

function getDayName(day) {
  let dayName;
  switch (day) {
    case 0:
      dayName = "Sunday";
      break;
    case 1:
      dayName = "Monday";
      break;
    case 2:
      dayName = "Tuesday";
      break;
    case 3:
      dayName = "Wednesday";
      break;
    case 4:
      dayName = "Thursday";
      break;
    case 5:
      dayName = "Friday";
      break;
    case 6:
      dayName = "Saturday";
      break;
  }

  return dayName;
}
