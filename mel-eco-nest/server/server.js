const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config()

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
  database: process.env.DB_NAME,
})

// Connect to database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database: ' + error.stack)
    return
  }
  console.log('Successfully connected to the database.')
})

// API endpoint for getting all plant data
app.get('/plants', (req, res) => {
  const query = 'SELECT * FROM plant'

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error.stack)
      res.status(500).json({ error: 'Database query failed' })
      return
    }
    res.json(results)
  })
})

// API endpoint for plant recommendations
app.post('/plants/recommendations', (req, res) => {
  const { userPreferences } = req.body

  if (!userPreferences) {
    return res.status(400).json({ error: 'User preferences are required' })
  }

  const query = 'SELECT * FROM plant'

  connection.query(query, (error, plants) => {
    if (error) {
      console.error('Error executing query: ' + error.stack)
      res.status(500).json({ error: 'Database query failed' })
      return
    }

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

      return { ...plant, score }
    })

    // Sort by score in descending order and filter out low-scoring plants
    const recommendations = scoredPlants
      .filter((plant) => plant.score >= 10) // Only return plants with score >= 10
      .sort((a, b) => b.score - a.score) // Sort by score from high to low

    res.json(recommendations)
  })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
