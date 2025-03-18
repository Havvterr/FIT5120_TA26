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

// Reverse geocoding endpoint to get address from coordinates
app.get("/api/geocode/reverse", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    console.log(
      `Reverse geocoding request received for coordinates: lat=${lat}, lng=${lng}`
    );

    if (!lat || !lng) {
      console.error("Missing latitude or longitude parameters");
      return res
        .status(400)
        .json({ error: "Missing latitude or longitude parameters" });
    }

    // Make request to Google Geocoding API
    try {
      console.log(
        `Sending reverse geocoding request to Google API with key: ${GOOGLE_API_KEY.substring(
          0,
          5
        )}...`
      );

      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            latlng: `${lat},${lng}`,
            key: GOOGLE_API_KEY,
          },
        }
      );

      console.log(
        `Google Reverse Geocoding API response status: ${response.status}`
      );
      console.log(`Results found: ${response.data.results.length}`);

      // Return the full response to the client
      res.json(response.data);
    } catch (googleApiError) {
      console.error(
        "Google Reverse Geocoding API error:",
        googleApiError.message
      );
      console.error("Response data:", googleApiError.response?.data);
      res.status(500).json({ error: "Failed to reverse geocode coordinates" });
    }
  } catch (error) {
    console.error("Unexpected error in reverse geocoding endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint for personalized skin advice based on skin type and UV index
app.get("/api/skin-advice/:skinType", async (req, res) => {
  try {
    const { skinType } = req.params;
    const { uvIndex } = req.query;

    // Calculate safe exposure time based on skin type and UV index
    let safeExposureMinutes = 0;
    let sunscreenAmount = 0;
    let reapplicationTime = 2; // Default reapplication time in hours

    // Calculate safe exposure time (in minutes) based on skin type and UV index
    // These are simplified calculations and should be validated by health professionals
    switch (parseInt(skinType)) {
      case 1: // Very fair skin
        safeExposureMinutes = Math.max(5, 60 / (parseInt(uvIndex) || 1));
        sunscreenAmount = 2.5;
        reapplicationTime = 1.5;
        break;
      case 2: // Fair skin
        safeExposureMinutes = Math.max(7, 90 / (parseInt(uvIndex) || 1));
        sunscreenAmount = 2.5;
        reapplicationTime = 2;
        break;
      case 3: // Light brown skin
        safeExposureMinutes = Math.max(10, 120 / (parseInt(uvIndex) || 1));
        sunscreenAmount = 2;
        reapplicationTime = 2;
        break;
      case 4: // Moderate brown skin
        safeExposureMinutes = Math.max(15, 150 / (parseInt(uvIndex) || 1));
        sunscreenAmount = 2;
        reapplicationTime = 2.5;
        break;
      case 5: // Dark brown skin
        safeExposureMinutes = Math.max(20, 180 / (parseInt(uvIndex) || 1));
        sunscreenAmount = 1.5;
        reapplicationTime = 3;
        break;
      case 6: // Darkest brown skin
        safeExposureMinutes = Math.max(30, 240 / (parseInt(uvIndex) || 1));
        sunscreenAmount = 1.5;
        reapplicationTime = 3;
        break;
      default:
        safeExposureMinutes = Math.max(10, 120 / (parseInt(uvIndex) || 1));
        sunscreenAmount = 2;
        reapplicationTime = 2;
    }

    // Prepare personalized advice
    const advice = {
      riskAssessment: getRiskAssessment(skinType, uvIndex),
      exposureGuidelines: `Based on your skin type and the current UV index (${uvIndex}), you should limit direct sun exposure to ${safeExposureMinutes} minutes without protection.`,
      vitaminDInfo: getVitaminDInfo(skinType),
      sunscreenAmount: `${sunscreenAmount} teaspoons`,
      reapplicationTime: reapplicationTime,
    };

    res.json(advice);
  } catch (error) {
    console.error("Error generating skin advice:", error);
    res.status(500).json({ error: "Failed to generate personalized advice" });
  }
});

// Helper function for risk assessment
function getRiskAssessment(skinType, uvIndex) {
  const skinTypeInt = parseInt(skinType);
  const uvIndexInt = parseInt(uvIndex);

  if (uvIndexInt >= 8) {
    return `With your skin type (${skinType}) and the current extreme UV index (${uvIndex}), you are at very high risk of sunburn. Seek shade and use maximum protection.`;
  } else if (uvIndexInt >= 6) {
    return `With your skin type (${skinType}) and the current high UV index (${uvIndex}), you are at high risk of sunburn. Use strong sun protection.`;
  } else if (uvIndexInt >= 3) {
    return `With your skin type (${skinType}) and the current moderate UV index (${uvIndex}), you should use sun protection during peak hours.`;
  } else {
    return `With your skin type (${skinType}) and the current low UV index (${uvIndex}), your risk of sunburn is relatively low, but basic protection is still recommended.`;
  }
}

// Helper function for vitamin D recommendations
function getVitaminDInfo(skinType) {
  const skinTypeInt = parseInt(skinType);

  if (skinTypeInt >= 5) {
    return "With your darker skin tone, you may need more sun exposure to produce adequate vitamin D. Consider 15-30 minutes of sun exposure 2-3 times per week, and discuss vitamin D supplements with your healthcare provider.";
  } else if (skinTypeInt >= 3) {
    return "With your medium skin tone, aim for 10-20 minutes of sun exposure 2-3 times per week for vitamin D production. Use sun protection after this period.";
  } else {
    return "With your fair skin tone, you need minimal sun exposure for vitamin D production. Just 5-10 minutes of midday sun exposure 2-3 times per week should be sufficient. Always use sun protection after this period.";
  }
}

// Endpoint for sun-safe products from database
app.get("/api/sun-safe-products/from-database", async (req, res) => {
  try {
    const { category } = req.query;

    let query = "SELECT * FROM PRODUCTS";
    let params = [];

    // If category is specified, filter by category
    if (category && category !== "all") {
      query += " WHERE category = ?";
      params.push(category);
    }

    // Execute query
    const [rows] = await dbPool.execute(query, params);

    // Format the response to match the expected format in the frontend
    const products = rows.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      category: product.category,
      imageUrl: product.imageUrl,
      purchaseLink: product.purchaseLink,
    }));

    res.json(products);
  } catch (error) {
    console.error("Error fetching products from database:", error);
    res.status(500).json({ error: "Failed to fetch products from database" });
  }
});

// Endpoint for personalized advice from database
app.get("/api/personalized-advice", async (req, res) => {
  try {
    const { skinType, uvIndex } = req.query;

    if (!skinType || !uvIndex) {
      return res
        .status(400)
        .json({ error: "Missing required parameters: skinType or uvIndex" });
    }

    // Round UV index to nearest integer
    const roundedUvIndex = Math.round(parseFloat(uvIndex));

    // If UV index is 0, return special message
    if (roundedUvIndex === 0) {
      return res.json({
        adviceText:
          "Currently, the UV index is very low. You do not need sun protection at this time.",
        skinType: skinType,
        uvIndex: 0,
        additionalInfo:
          "Even though protection isn't required now, remember that UV levels can change throughout the day.",
      });
    }

    // Query advice from database based on skin tone and UV index
    const query = `
      SELECT a.advice, s.skin_tone, u.uv_index, a.recommendation_type
      FROM ADVICE a
      JOIN SKINTONE s ON a.skin_tone_id = s.id
      JOIN UV u ON a.uv_id = u.id
      WHERE s.id = ? AND u.id = ?
    `;

    const [results] = await dbPool.execute(query, [skinType, roundedUvIndex]);

    if (results.length === 0) {
      // Fallback if no specific advice is found
      return res.status(404).json({
        error: "No specific advice found for the given parameters",
        fallbackAdvice: getRiskAssessment(skinType, roundedUvIndex),
      });
    }

    // Format and send response
    const adviceData = {
      adviceText: results[0].advice,
      skinType: parseInt(skinType),
      uvIndex: roundedUvIndex,
      recommendationType: results[0].recommendation_type,
    };

    res.json(adviceData);
  } catch (error) {
    console.error("Error fetching personalized advice:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch personalized advice from database" });
  }
});

// Catch-all handler for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
