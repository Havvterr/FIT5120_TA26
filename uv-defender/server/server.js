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
const OPENUV_API_KEY = process.env.OPENUV_API_KEY;

// Database connection
let dbPool;
async function initializeDbConnection() {
  try {
    dbPool = await mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "uv_defender",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Database connection initialized");
  } catch (error) {
    console.error("Failed to initialize database connection:", error);
  }
}

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

    // Call OpenUV API
    try {
      console.log("Calling OpenUV API...");
      console.log(`API endpoint: https://api.openuv.io/api/v1/uv`);
      console.log(`Parameters: lat=${lat}, lng=${lon}, alt=100`);
      console.log(`Using API key: ${OPENUV_API_KEY}`);

      const response = await axios.get("https://api.openuv.io/api/v1/uv", {
        params: {
          lat,
          lng: lon,
          alt: 100, // Default altitude
        },
        headers: {
          "x-access-token": OPENUV_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 15000, // 15 second timeout
      });

      console.log("OpenUV API response received:", response.status);
      console.log(
        "Response data:",
        JSON.stringify(response.data).substring(0, 200) + "..."
      );

      // Extract UV index and safe exposure times
      const uvData = {
        uvIndex: response.data.result.uv,
        uvMaxToday: response.data.result.uv_max,
        safeExposureTimes: response.data.result.safe_exposure_time,
        sunInfo: response.data.result.sun_info,
      };

      console.log("Processed UV data:", {
        uvIndex: uvData.uvIndex,
        uvMaxToday: uvData.uvMaxToday,
      });

      return res.json(uvData);
    } catch (openUvError) {
      console.error("Error fetching UV index from OpenUV:");
      console.error("Error message:", openUvError.message);
      console.error("Status code:", openUvError.response?.status);
      console.error("Status text:", openUvError.response?.statusText);
      console.error("Response data:", openUvError.response?.data);

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

// Endpoint for UV impact data
app.get("/api/uv-impact-data", async (req, res) => {
  try {
    // This would typically come from a database
    // For now, we'll return mock data
    const uvImpactData = {
      skinCancerByAgeGroup: [
        { ageGroup: "15-24", incidenceRate: 32.5 },
        { ageGroup: "25-34", incidenceRate: 48.7 },
        { ageGroup: "35-44", incidenceRate: 78.2 },
        { ageGroup: "45-54", incidenceRate: 124.6 },
        { ageGroup: "55-64", incidenceRate: 187.3 },
        { ageGroup: "65+", incidenceRate: 235.8 },
      ],
      heatTrendInAustralia: [
        { year: 2014, averageTemp: 22.8 },
        { year: 2015, averageTemp: 23.1 },
        { year: 2016, averageTemp: 23.4 },
        { year: 2017, averageTemp: 23.7 },
        { year: 2018, averageTemp: 24.1 },
        { year: 2019, averageTemp: 24.6 },
        { year: 2020, averageTemp: 24.3 },
        { year: 2021, averageTemp: 24.5 },
        { year: 2022, averageTemp: 24.8 },
        { year: 2023, averageTemp: 25.2 },
      ],
    };

    res.json(uvImpactData);
  } catch (error) {
    console.error("Error fetching UV impact data:", error);
    res.status(500).json({ error: "Failed to fetch UV impact data" });
  }
});

// Endpoint for sun-safe products
app.get("/api/sun-safe-products", async (req, res) => {
  try {
    const { category } = req.query;

    // This would typically come from a database
    // For now, we'll return mock data
    const products = {
      sunscreen: [
        {
          id: 1,
          name: "Ultra Protection SPF 50+",
          price: 24.99,
          description: "Water-resistant, broad-spectrum protection",
          imageUrl: "https://example.com/sunscreen1.jpg",
          purchaseLink: "https://example.com/buy/sunscreen1",
        },
        {
          id: 2,
          name: "Sensitive Skin SPF 30",
          price: 19.99,
          description: "Fragrance-free formula for sensitive skin",
          imageUrl: "https://example.com/sunscreen2.jpg",
          purchaseLink: "https://example.com/buy/sunscreen2",
        },
        {
          id: 3,
          name: "Sport Formula SPF 50+",
          price: 27.99,
          description: "Extra water-resistant for active lifestyles",
          imageUrl: "https://example.com/sunscreen3.jpg",
          purchaseLink: "https://example.com/buy/sunscreen3",
        },
      ],
      clothing: [
        {
          id: 4,
          name: "UV Protection Hat",
          price: 34.99,
          description: "Wide-brimmed hat with UPF 50+ protection",
          imageUrl: "https://example.com/hat1.jpg",
          purchaseLink: "https://example.com/buy/hat1",
        },
        {
          id: 5,
          name: "Long Sleeve Rash Guard",
          price: 45.99,
          description: "UPF 50+ protection for water activities",
          imageUrl: "https://example.com/rashguard1.jpg",
          purchaseLink: "https://example.com/buy/rashguard1",
        },
        {
          id: 6,
          name: "Sun Protection Shirt",
          price: 39.99,
          description: "Lightweight, breathable fabric with UPF 40+",
          imageUrl: "https://example.com/shirt1.jpg",
          purchaseLink: "https://example.com/buy/shirt1",
        },
      ],
      sunglasses: [
        {
          id: 7,
          name: "Polarized UV400 Sunglasses",
          price: 89.99,
          description: "Full UV protection with polarized lenses",
          imageUrl: "https://example.com/sunglasses1.jpg",
          purchaseLink: "https://example.com/buy/sunglasses1",
        },
        {
          id: 8,
          name: "Sport Wrap Sunglasses",
          price: 69.99,
          description: "Wrap-around design for maximum protection",
          imageUrl: "https://example.com/sunglasses2.jpg",
          purchaseLink: "https://example.com/buy/sunglasses2",
        },
        {
          id: 9,
          name: "Fashion UV Protection",
          price: 59.99,
          description: "Stylish frames with 100% UV protection",
          imageUrl: "https://example.com/sunglasses3.jpg",
          purchaseLink: "https://example.com/buy/sunglasses3",
        },
      ],
    };

    // If category is specified, return only that category
    if (category && products[category]) {
      return res.json(products[category]);
    }

    // Otherwise, return all products
    const allProducts = [
      ...products.sunscreen,
      ...products.clothing,
      ...products.sunglasses,
    ];
    res.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

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

// Catch-all handler for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeDbConnection();
});
