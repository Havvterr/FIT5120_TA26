require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// API Keys
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Google Places API endpoint for place predictions
app.get('/api/places/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input,
          key: GOOGLE_API_KEY,
          components: 'country:au',
          types: '(regions)'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching place predictions:', error);
    res.status(500).json({ error: 'Failed to fetch place predictions' });
  }
});

// Weather API endpoint for UV index
app.get('/api/uv-index', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(
      'http://api.weatherapi.com/v1/current.json',
      {
        params: {
          key: WEATHER_API_KEY,
          q: `${lat},${lon}`,
          aqi: 'no'
        }
      }
    );
    const uvIndex = response.data.current.uv;
    res.json({ uvIndex });
  } catch (error) {
    console.error('Error fetching UV index:', error);
    res.status(500).json({ error: 'Failed to fetch UV index' });
  }
});

// Geocoding endpoint to get coordinates from postcode
app.get('/api/geocode/postcode', async (req, res) => {
  try {
    const { postcode } = req.query;
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: `${postcode}, Australia`,
          key: GOOGLE_API_KEY
        }
      }
    );
    
    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      res.json(location);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Error geocoding postcode:', error);
    res.status(500).json({ error: 'Failed to geocode postcode' });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, 'localhost', () => {
  console.log(`Server is running on port ${PORT}`);
});