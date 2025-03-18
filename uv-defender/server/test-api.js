const axios = require("axios");

async function testWeatherAPI() {
  try {
    const response = await axios.get(
      "https://api.weatherapi.com/v1/forecast.json",
      {
        params: {
          key: "9e1e2c13b3624475a66153849251803",
          q: "-37.8136,144.9631",
          days: 1,
          aqi: "no",
          alerts: "no",
        },
      }
    );

    console.log("API Response Location:", response.data.location);
    console.log("Current UV Index:", response.data.current.uv);
    console.log("Max UV Today:", response.data.forecast.forecastday[0].day.uv);
    console.log(
      "Sunrise:",
      response.data.forecast.forecastday[0].astro.sunrise
    );
    console.log("Sunset:", response.data.forecast.forecastday[0].astro.sunset);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
}

testWeatherAPI();
