const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config()
const axios = require('axios')

const app = express()

// Enable CORS
app.use(cors())
app.use(express.json())

// Create database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

// Add timestamp formatting function
const getTimestamp = () => new Date().toISOString();

// Connect to database
connection.connect((error) => {
  if (error) {
    console.error(`[${getTimestamp()}][Database] Connection error:`, error.stack)
    return
  }
  console.log(`[${getTimestamp()}] Successfully connected to the database.`)
  console.log(`[${getTimestamp()}] Database connection info - Host: ${process.env.DB_HOST}, Database: ${process.env.DB_DATABASE}`)
})

// API endpoint for getting all plant data
app.get('/plants', (req, res) => {
  console.log(`[${getTimestamp()}] GET /plants - Fetching all plants`)
  const query = 'SELECT * FROM plant'

  connection.query(query, (error, results) => {
    if (error) {
      console.error(`[${getTimestamp()}][Database] Error executing plants query:`, error.stack)
      res.status(500).json({ error: 'Database query failed' })
      return
    }
    console.log(`[${getTimestamp()}] Successfully retrieved ${results.length} plants from database`)
    res.json(results)
  })
})

// API endpoint for plant recommendations
app.post('/plants/recommendations', (req, res) => {
  console.log(`[${getTimestamp()}] POST /plants/recommendations - Generating plant recommendations`)
  console.log(`[${getTimestamp()}] User preferences:`, req.body.userPreferences)

  const { userPreferences } = req.body

  if (!userPreferences) {
    console.log(`[${getTimestamp()}] Error: No user preferences provided`)
    return res.status(400).json({ error: 'User preferences are required' })
  }

  console.log(`[${getTimestamp()}][API] User preferences:`, userPreferences)

  const query = 'SELECT * FROM plant'

  connection.query(query, (error, plants) => {
    if (error) {
      console.error(`[${getTimestamp()}][Database] Error executing recommendations query:`, error.stack)
      res.status(500).json({ error: 'Database query failed' })
      return
    }
    console.log(`[${getTimestamp()}][Database] Retrieved ${plants.length} plants for recommendation calculation`)

    console.log(`[${getTimestamp()}] Processing ${plants.length} plants for recommendations`)

    // Calculate score for each plant
    const scoredPlants = plants.map((plant) => {
      let score = 0

      // Score based on light requirements
      if (plant.sunlight_needs === userPreferences.sunlight) {
        score += 3
      } else if (
        (plant.sunlight_needs === 'Partial Shade' && userPreferences.sunlight === 'Full Sun') ||
        (plant.sunlight_needs === 'Full Sun' && userPreferences.sunlight === 'Partial Shade')
      ) {
        score += 1
      }

      // Score based on watering requirements
      if (plant.water_needs === userPreferences.waterNeeds) {
        score += 3
      } else if (
        (plant.water_needs === 'Medium' &&
          (userPreferences.waterNeeds === 'Low' || userPreferences.waterNeeds === 'High')) ||
        (plant.water_needs === 'Low' && userPreferences.waterNeeds === 'Medium') ||
        (plant.water_needs === 'High' && userPreferences.waterNeeds === 'Medium')
      ) {
        score += 1
      }

      // Score based on maintenance difficulty
      if (plant.maintenance_level === userPreferences.maintenanceLevel) {
        score += 3
      } else if (
        (plant.maintenance_level === 'Medium' &&
          (userPreferences.maintenanceLevel === 'Low' ||
            userPreferences.maintenanceLevel === 'High')) ||
        (plant.maintenance_level === 'Low' && userPreferences.maintenanceLevel === 'Medium') ||
        (plant.maintenance_level === 'High' && userPreferences.maintenanceLevel === 'Medium')
      ) {
        score += 1
      }

      // Consider plant priority
      score += 4 - plant.priority

      console.log(`[${getTimestamp()}] Plant: ${plant.name}, Score: ${score} (Sunlight: ${plant.sunlight_needs}, Water: ${plant.water_needs}, Maintenance: ${plant.maintenance_level})`)

      return { ...plant, score }
    })

    // Sort by score in descending order and filter out low-scoring plants
    const recommendations = scoredPlants
      .filter((plant) => plant.score >= 5) // Only return plants with score >= 7
      .sort((a, b) => b.score - a.score) // Sort by score from high to low

    console.log(`[${getTimestamp()}] Returning ${recommendations.length} recommended plants`)
    res.json(recommendations)
  })
})

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  console.log(`[${getTimestamp()}] GET /api/weather - Fetching weather data`)
  console.log(`[${getTimestamp()}] Query parameters:`, req.query)

  try {
    const { lat, lon } = req.query
    console.log(`[${getTimestamp()}][API] GET /api/weather - Fetching weather data for coordinates:`, { lat, lon })
    const apiKey = process.env.OPENWEATHERMAP_API_KEY
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric',
      },
    })
    console.log(`[${getTimestamp()}] Weather data retrieved successfully`)
    res.json(response.data)
  } catch (error) {
    console.error(`[${getTimestamp()}][API] Error fetching weather data:`, error.message)
    res.status(500).json({ error: 'Failed to fetch weather data' })
  }
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`[${getTimestamp()}][Server] Started successfully on port`, PORT)
  console.log(`[${getTimestamp()}][Server] Environment:`, process.env.NODE_ENV || 'development')
})
