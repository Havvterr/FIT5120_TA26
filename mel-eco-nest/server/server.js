const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
require('dotenv').config()
const axios = require('axios')

const app = express()

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

// Enable CORS
app.use(cors())
app.use(express.json())
// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Create database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

// Add timestamp formatting function
const getTimestamp = () => new Date().toISOString()

// Connect to database
connection.connect((error) => {
  if (error) {
    console.error(`[${getTimestamp()}][Database] Connection error:`, error.stack)
    return
  }
  console.log(`[${getTimestamp()}] Successfully connected to the database.`)
  console.log(
    `[${getTimestamp()}] Database connection info - Host: ${process.env.DB_HOST}, Database: ${process.env.DB_DATABASE}`,
  )
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

// API endpoint for getting plant details by name
app.get('/plants/:name', (req, res) => {
  const plantName = req.params.name
  console.log(`[${getTimestamp()}] GET /plants/${plantName} - Fetching plant details`)

  const query = 'SELECT * FROM plant WHERE name = ?'

  connection.query(query, [plantName], (error, results) => {
    if (error) {
      console.error(
        `[${getTimestamp()}][Database] Error executing plant details query:`,
        error.stack,
      )
      res.status(500).json({ error: 'Database query failed' })
      return
    }

    if (results.length === 0) {
      console.log(`[${getTimestamp()}] No plant found with name: ${plantName}`)
      res.status(404).json({ error: 'Plant not found' })
      return
    }

    console.log(`[${getTimestamp()}] Successfully retrieved plant details for: ${plantName}`)
    res.json(results[0])
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
      console.error(
        `[${getTimestamp()}][Database] Error executing recommendations query:`,
        error.stack,
      )
      res.status(500).json({ error: 'Database query failed' })
      return
    }
    console.log(
      `[${getTimestamp()}][Database] Retrieved ${plants.length} plants for recommendation calculation`,
    )

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

      console.log(
        `[${getTimestamp()}] Plant: ${plant.name}, Score: ${score} (Sunlight: ${plant.sunlight_needs}, Water: ${plant.water_needs}, Maintenance: ${plant.maintenance_level})`,
      )

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
    console.log(
      `[${getTimestamp()}][API] GET /api/weather - Fetching weather data for coordinates:`,
      { lat, lon },
    )
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

// AI设计API端点
app.post('/api/ai-design', upload.single('file'), async (req, res) => {
  console.log(`[${getTimestamp()}] POST /api/ai-design - 开始AI设计`)

  try {
    if (!req.file) {
      throw new Error('没有上传文件')
    }

    // 获取上传的文件和选择的植物
    const file = req.file
    const plants = JSON.parse(req.body.plants || '[]')

    console.log(`[${getTimestamp()}] 文件上传成功:`, {
      filename: file.filename,
      path: file.path,
      size: file.size
    })

    // 获取选中的植物详细信息
    const plantQuery = 'SELECT * FROM plant WHERE id IN (?)'
    const [plantResults] = await connection.promise().query(plantQuery, [plants])

    console.log(`[${getTimestamp()}] 获取到植物信息:`, plantResults)

    // 调用ComfyUI API进行AI设计
    const comfyResponse = await axios.post('http://58.178.177.133:8188/prompt', {
      // TODO: 根据ComfyUI的API要求构建请求体
    })

    // 返回设计结果
    res.json({
      success: true,
      message: 'AI设计开始',
      designId: comfyResponse.data.prompt_id,
      uploadedFile: {
        filename: file.filename,
        path: `/uploads/${file.filename}` // 客户端可访问的URL
      }
    })

  } catch (error) {
    console.error(`[${getTimestamp()}] AI设计失败:`, error)
    res.status(500).json({
      success: false,
      message: 'AI设计失败',
      error: error.message
    })
  }
})

// API endpoint for getting basic plant info (id, name, image)
app.get('/api/plants/basic', (req, res) => {
  console.log(`[${getTimestamp()}] GET /api/plants/basic - Fetching basic plant info`)
  const query = 'SELECT id, name, image_url FROM plant'

  connection.query(query, (error, results) => {
    if (error) {
      console.error(`[${getTimestamp()}][Database] Error executing basic plants query:`, error.stack)
      res.status(500).json({ error: 'Database query failed' })
      return
    }
    console.log(`[${getTimestamp()}] Successfully retrieved ${results.length} plants basic info`)
    res.json(results)
  })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`[${getTimestamp()}][Server] Started successfully on port`, PORT)
  console.log(`[${getTimestamp()}][Server] Environment:`, process.env.NODE_ENV || 'development')
})
