require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
// Configure CORS to allow frontend application access
app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:8080"], // Allow these origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials
  })
);
app.use(express.json());

// Serve static files from the Vue app build directory
app.use(express.static(path.join(__dirname, "../dist")));

// API Keys
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Database connection
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Google Places API endpoint for place predictions
app.get("/api/places/autocomplete", async (req, res) => {
  try {
    const { input } = req.query;
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input,
          key: GOOGLE_API_KEY,
          components: "country:au",
          types: "(regions)",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching place predictions:", error);
    res.status(500).json({ error: "Failed to fetch place predictions" });
  }
});

// OpenUV API endpoint for UV index
app.get("/api/uv-index", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      console.error("Missing latitude or longitude parameters");
      return res
        .status(400)
        .json({ error: "Missing latitude or longitude parameters" });
    }

    console.log(`Fetching UV index for coordinates: lat=${lat}, lon=${lon}`);

    // Define mock data for testing or fallback
    const mockData = {
      uvIndex: 5.2,
      uvMaxToday: 6.8,
      safeExposureTimes: {
        st1: 20,
        st2: 30,
        st3: 40,
        st4: 50,
        st5: 60,
        st6: 80,
      },
      sunInfo: {
        sun_times: {
          sunrise: new Date().toISOString(),
          sunset: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
        },
      },
      isBackupData: true,
    };

    // Whether to use mock data for testing (set to true to enable mock data, set to false to use actual API)
    const useMockData = false;

    if (useMockData) {
      console.log("Using mock data for testing");
      return res.json(mockData);
    }

    // Call WeatherAPI
    try {
      console.log("Calling WeatherAPI...");
      console.log(`API endpoint: https://api.weatherapi.com/v1/forecast.json`);
      console.log(`Parameters: lat=${lat}, lon=${lon}`);
      console.log(`Using API key: ${WEATHER_API_KEY.substring(0, 5)}...`);

      const response = await axios.get(
        "https://api.weatherapi.com/v1/forecast.json",
        {
          params: {
            key: WEATHER_API_KEY,
            q: `${lat},${lon}`,
            days: 1,
            aqi: "no",
            alerts: "no",
          },
          timeout: 15000, // 15 second timeout
        }
      );

      console.log("WeatherAPI response received:", response.status);
      console.log(
        "Response data summary:",
        `Location: ${response.data.location.name}, Current temp: ${response.data.current.temp_c}°C`
      );

      // Extract UV index from WeatherAPI response
      const uvData = {
        uvIndex: response.data.current.uv,
        uvMaxToday: response.data.forecast.forecastday[0].day.uv,
        sunInfo: {
          sun_times: {
            sunrise: response.data.forecast.forecastday[0].astro.sunrise,
            sunset: response.data.forecast.forecastday[0].astro.sunset,
          },
        },
        isBackupData: false,
      };

      console.log("Processed UV data:", {
        uvIndex: uvData.uvIndex,
        uvMaxToday: uvData.uvMaxToday,
      });

      return res.json(uvData);
    } catch (weatherApiError) {
      console.error("Error fetching UV index from WeatherAPI:");
      console.error("Error message:", weatherApiError.message);
      console.error("Status code:", weatherApiError.response?.status);
      console.error("Status text:", weatherApiError.response?.statusText);
      console.error("Response data:", weatherApiError.response?.data);

      // Return mock data as fallback
      console.log("Using mock data as fallback due to API error");
      return res.json(mockData);
    }
  } catch (error) {
    console.error("Unexpected error in UV index endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Geocoding endpoint to get coordinates from postcode
app.get("/api/geocode/postcode", async (req, res) => {
  try {
    const { postcode } = req.query;

    console.log(`Geocoding request received for postcode: ${postcode}`);

    if (!postcode) {
      console.error("Missing postcode parameter");
      return res.status(400).json({ error: "Missing postcode parameter" });
    }

    // Format the address with Australia to ensure we get Australian results
    const address = postcode.includes("Australia")
      ? postcode
      : `${postcode}, Australia`;
    console.log(`Formatted address for geocoding: ${address}`);

    // Make request to Google Geocoding API
    try {
      console.log(
        `Sending request to Google Geocoding API with key: ${GOOGLE_API_KEY.substring(
          0,
          5
        )}...`
      );

      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: address,
            key: GOOGLE_API_KEY,
          },
        }
      );

      console.log(`Google Geocoding API response status: ${response.status}`);
      console.log(`Results found: ${response.data.results.length}`);

      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        console.log(
          `Coordinates found: lat=${location.lat}, lng=${location.lng}`
        );
        res.json(location);
      } else {
        console.error("No results found for the provided postcode");
        res.status(404).json({ error: "Location not found" });
      }
    } catch (googleApiError) {
      console.error("Google Geocoding API error:", googleApiError.message);
      console.error("Response data:", googleApiError.response?.data);
      res.status(500).json({ error: "Failed to geocode postcode" });
    }
  } catch (error) {
    console.error("Unexpected error in geocoding endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, 'localhost', () => {
  console.log(`Server is running on port ${PORT}`);
});
