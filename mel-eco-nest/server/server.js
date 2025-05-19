const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const { spawn } = require('child_process')
const fs = require('fs').promises
const fsSync = require('fs')
require('dotenv').config()
const axios = require('axios')

const app = express()

const createDirectories = async () => {
  const directories = [path.join(__dirname, 'uploads'), path.join(__dirname, 'temp')]

  for (const dir of directories) {
    if (!fsSync.existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true })
      console.log(`[${getTimestamp()}] Created directory: ${dir}`)
    }
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads')

    if (!fsSync.existsSync(uploadDir)) {
      fsSync.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

// Enable CORS
app.use(cors())
app.use(express.json())

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

const workflowPath = path.join(__dirname, '../comfyapi/flux.1_img2img.json')
let workflow = null

const loadWorkflow = async () => {
  try {
    const data = await fs.readFile(workflowPath, 'utf8')
    workflow = JSON.parse(data)
    console.log(`[${getTimestamp()}] Successfully loaded ComfyUI workflow`)
  } catch (error) {
    console.error(`[${getTimestamp()}] Error loading workflow:`, error)
  }
}

loadWorkflow()

app.post('/api/ai-design/start', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded')
    }

    const file = req.file
    const selectedPlants = JSON.parse(req.body.plants || '[]')

    const prompt = `Lightly decorate the existing balcony with ${selectedPlants.join(', ')}.
    Place them naturally and aesthetically, maintaining the original balcony structure.
    Keep it realistic and clean.`

    if (workflow) {
      if (workflow['27'] && workflow['27'].inputs) {
        workflow['27'].inputs.image = file.filename
      }

      let foundPrompt = false
      for (const nodeId in workflow) {
        const node = workflow[nodeId]
        if (node.class_type === 'CLIPTextEncode' && node.inputs && 'text' in node.inputs) {
          const enhancedPrompt = `Subtly add ${prompt.trim()} to the existing balcony, preserving 95% of the original image's composition, lighting, colors, and style. Do not change any existing furniture, railings, walls, floor, or background. Only add small plants in appropriate containers. Maintain exact perspective, shadows, and time of day. The final result should look like the original photo with minimal, realistic plant additions that respect the original aesthetic.`

          node.inputs.text = enhancedPrompt
          console.log(`[${getTimestamp()}] Enhanced prompt: ${enhancedPrompt}`)
          foundPrompt = true
          break
        }
      }

      const randomSeed = Math.floor(Math.random() * (2 ** 32 - 1))
      if (workflow['25'] && workflow['25'].inputs) {
        workflow['25'].inputs.noise_seed = randomSeed
      }
    }

    const comfyResponse = await axios.post('http://58.178.177.133:8188/prompt', {
      prompt: workflow,
    })

    res.json({
      success: true,
      message: 'AI design started',
      promptId: comfyResponse.data.prompt_id,
      originalImage: file.filename,
    })
  } catch (error) {
    console.error(`[${getTimestamp()}] AI design error:`, error)
    res.status(500).json({
      success: false,
      message: 'Failed to start AI design',
      error: error.message,
    })
  }
})

// API endpoint for getting basic plant info (id, name, image)
app.get('/api/plants/basic', (req, res) => {
  console.log(`[${getTimestamp()}] GET /api/plants/basic - Fetching basic plant info`)
  const query = 'SELECT id, name, image_url FROM plant'

  connection.query(query, (error, results) => {
    if (error) {
      console.error(
        `[${getTimestamp()}][Database] Error executing basic plants query:`,
        error.stack,
      )
      res.status(500).json({ error: 'Database query failed' })
      return
    }
    console.log(`[${getTimestamp()}] Successfully retrieved ${results.length} plants basic info`)
    res.json(results)
  })
})

// API endpoint for getting all appliances
app.get('/appliances', (req, res) => {
  console.log(`[${getTimestamp()}] GET /appliances - Fetching all appliances`)
  const query = 'SELECT * FROM appliance'

  connection.query(query, (error, results) => {
    if (error) {
      console.error(`[${getTimestamp()}][Database] Error executing appliances query:`, error.stack)
      res.status(500).json({ error: 'Database query failed' })
      return
    }
    console.log(
      `[${getTimestamp()}] Successfully retrieved ${results.length} appliances from database`,
    )
    res.json(results)
  })
})

// API endpoint for getting appliances by category
app.get('/appliances/category/:category', (req, res) => {
  const category = req.params.category
  console.log(
    `[${getTimestamp()}] GET /api/appliances/category/${category} - Fetching appliances by category`,
  )

  const query = 'SELECT * FROM appliance WHERE category = ?'

  connection.query(query, [category], (error, results) => {
    if (error) {
      console.error(
        `[${getTimestamp()}][Database] Error executing appliances by category query:`,
        error.stack,
      )
      res.status(500).json({ error: 'Database query failed' })
      return
    }
    console.log(
      `[${getTimestamp()}] Successfully retrieved ${results.length} appliances for category: ${category}`,
    )
    res.json(results)
  })
})

// Create appliance table if not exists
const createApplianceTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS appliance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      model VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      energy_rating VARCHAR(10) NOT NULL,
      price DECIMAL(10, 2),
      description TEXT,
      image_url VARCHAR(255),
      energy_savings VARCHAR(100),
      features TEXT
    )
  `

  connection.query(query, (error) => {
    if (error) {
      console.error(`[${getTimestamp()}][Database] Error creating appliance table:`, error.stack)
      return
    }
    console.log(`[${getTimestamp()}] Appliance table created successfully or already exists`)

    // Check if the table is empty and seed data if it is
    connection.query('SELECT COUNT(*) as count FROM appliance', (error, results) => {
      if (error) {
        console.error(`[${getTimestamp()}][Database] Error counting appliances:`, error.stack)
        return
      }

      if (results[0].count === 0) {
        seedApplianceData()
      }
    })
  })
}

// Seed initial appliance data
const seedApplianceData = () => {
  console.log(`[${getTimestamp()}] Seeding appliance data...`)

  const appliances = [
    {
      name: 'Energy-Efficient Refrigerator',
      model: 'EcoFridge X1',
      category: 'Refrigerator',
      energy_rating: '5 Star',
      price: 899.99,
      description:
        'Energy-efficient smart refrigerator with the latest inverter compressor technology, reducing energy consumption while improving cooling efficiency.',
      image_url: '/img/appliances/fridge1.jpg',
      energy_savings: 'Saves approximately 200 kWh per year',
      features: 'Smart temperature control,Inverter compressor,Ion odor removal,Frost-free design',
    },
    {
      name: 'Energy-Saving Washing Machine',
      model: 'EcoWash 3000',
      category: 'Washing Machine',
      energy_rating: '4 Star',
      price: 699.99,
      description:
        'Washing machine with heat pump drying technology, significantly reducing energy consumption during the drying process.',
      image_url: '/img/appliances/washer1.jpg',
      energy_savings: 'Saves 40% energy compared to conventional washing machines',
      features:
        'Heat pump drying,Smart weight detection,Auto water level adjustment,Smart detergent dispenser',
    },
    {
      name: 'Smart Air Conditioner',
      model: 'CoolSmart Pro',
      category: 'Air Conditioner',
      energy_rating: '5 Star',
      price: 1299.99,
      description:
        'Inverter air conditioner optimized with AI algorithms that automatically adjusts cooling effect based on room temperature and user habits.',
      image_url: '/img/appliances/ac1.jpg',
      energy_savings: 'Saves 30% electricity consumption annually',
      features: 'AI temperature control,Remote control,Inverter energy saving,Self-cleaning',
    },
    {
      name: 'Energy-Efficient Water Heater',
      model: 'HeatWise 500',
      category: 'Water Heater',
      energy_rating: '4 Star',
      price: 549.99,
      description:
        'Water heater using heat pump technology, over 3 times more efficient than traditional electric water heaters.',
      image_url: '/img/appliances/heater1.jpg',
      energy_savings: 'Saves 65% energy compared to traditional water heaters',
      features: 'Heat pump technology,Smart preheating,Timer settings,Touch screen control',
    },
    {
      name: 'Energy-Saving Oven',
      model: 'EcoBake Pro',
      category: 'Kitchen Appliance',
      energy_rating: '4 Star',
      price: 349.99,
      description:
        'Uses quick preheat and precise temperature control technology to reduce unnecessary energy waste.',
      image_url: '/img/appliances/oven1.jpg',
      energy_savings: 'Saves 25% energy compared to regular ovens',
      features: 'Quick preheat,Multi-function modes,Precise temperature control,Internal lighting',
    },
    {
      name: 'Smart Refrigerator',
      model: 'SmartChill 8000',
      category: 'Refrigerator',
      energy_rating: '5 Star',
      price: 1499.99,
      description:
        'Smart refrigerator with touch screen and food management system, optimizing freshness while reducing energy consumption.',
      image_url: '/img/appliances/fridge2.jpg',
      energy_savings: 'Annual electricity savings of about 350 kWh',
      features:
        'Touch screen control,Food management system,Inverter compressor,Multiple temperature zones',
    },
    {
      name: 'Economical Dishwasher',
      model: 'EcoDish 2000',
      category: 'Kitchen Appliance',
      energy_rating: '4 Star',
      price: 599.99,
      description:
        'Uses smart water control and heat recovery technology to significantly reduce water and electricity consumption.',
      image_url: '/img/appliances/dishwasher1.jpg',
      energy_savings: 'Saves 80% water compared to hand washing per use',
      features: 'Smart water control,Heat recovery,Quiet operation,Half-load washing',
    },
    {
      name: 'Energy-Efficient TV',
      model: 'EcoView 4K',
      category: 'Television',
      energy_rating: '5 Star',
      price: 899.99,
      description:
        'Uses the latest LED backlight technology to provide high image quality while significantly reducing energy consumption.',
      image_url: '/img/appliances/tv1.jpg',
      energy_savings: 'Saves 40% energy compared to traditional LCD TVs',
      features: '4K resolution,Smart dimming,Auto energy-saving mode,Eco-friendly materials',
    },
    {
      name: 'Inverter Rice Cooker',
      model: 'RiceMaster Eco',
      category: 'Kitchen Appliance',
      energy_rating: '4 Star',
      price: 199.99,
      description:
        'Uses precise inverter control technology to automatically adjust heat level based on rice quantity and type, saving energy.',
      image_url: '/img/appliances/cooker1.jpg',
      energy_savings: 'Saves 30% energy compared to traditional rice cookers',
      features: 'Inverter control,Multiple cooking modes,Energy-saving keep warm,Inner pot heating',
    },
    {
      name: 'Solar Water Heater',
      model: 'SolarHeat 300',
      category: 'Water Heater',
      energy_rating: '5 Star',
      price: 1299.99,
      description:
        'Uses solar energy to provide hot water, equipped with electric auxiliary heating system to ensure usability on cloudy days.',
      image_url: '/img/appliances/heater2.jpg',
      energy_savings: 'Reduces electricity consumption by 90% on sunny days',
      features: 'Solar heat collection,Electric auxiliary heating,Smart control,Anti-freeze design',
    },
    {
      name: 'Dual Inverter Air Conditioner',
      model: 'EcoCool Premium',
      category: 'Air Conditioner',
      energy_rating: '5 Star',
      price: 1599.99,
      description:
        'Uses dual inverter technology to intelligently adjust compressor and fan speed to achieve optimal energy efficiency ratio.',
      image_url: '/img/appliances/ac2.jpg',
      energy_savings: 'Annual electricity savings of about 500 kWh',
      features: 'Dual inverter,Indoor air purification,Smart WiFi control,Low noise design',
    },
    {
      name: 'Wall-Mounted Heat Pump',
      model: 'WallHeat Eco',
      category: 'Water Heater',
      energy_rating: '5 Star',
      price: 799.99,
      description:
        'Compact wall-mounted heat pump water heater suitable for small apartments with significant energy savings.',
      image_url: '/img/appliances/heater3.jpg',
      energy_savings: 'Saves 70% energy compared to electric water heaters',
      features:
        'Wall-mounted design,Heat pump technology,Compact size with high efficiency,Quiet operation',
    },
    {
      name: 'Smart Window Air Conditioner',
      model: 'WindowCool Smart',
      category: 'Air Conditioner',
      energy_rating: '4 Star',
      price: 499.99,
      description:
        'High-efficiency window air conditioner with WiFi control functionality, suitable for homes without central air conditioning.',
      image_url: '/img/appliances/ac3.jpg',
      energy_savings: 'Saves 35% energy compared to old window units',
      features: 'WiFi control,Timer function,Sleep mode,Quiet design',
    },
    {
      name: 'Photovoltaic Microwave',
      model: 'SolarWave Pro',
      category: 'Kitchen Appliance',
      energy_rating: '5 Star',
      price: 349.99,
      description:
        'Microwave that can connect to home photovoltaic systems, prioritizing solar power to reduce grid electricity consumption.',
      image_url: '/img/appliances/microwave1.jpg',
      energy_savings: 'Saves 100% grid electricity when using photovoltaic power',
      features: 'Solar priority,Smart heating,Multi-function cooking,Energy-saving mode',
    },
    {
      name: 'Energy-Efficient Fan',
      model: 'BreezeEco Tower',
      category: 'Television',
      energy_rating: '5 Star',
      price: 129.99,
      description:
        'Tower fan with high-efficiency DC motor providing strong airflow while maintaining low energy consumption.',
      image_url: '/img/appliances/fan1.jpg',
      energy_savings: 'Saves 60% energy compared to traditional fans',
      features: 'DC motor,9-speed settings,Natural breeze mode,Silent design',
    },
  ]

  // Insert data with prepared statement
  const insertQuery = `
    INSERT INTO appliance
    (name, model, category, energy_rating, price, description, image_url, energy_savings, features)
    VALUES ?
  `

  const values = appliances.map((appliance) => [
    appliance.name,
    appliance.model,
    appliance.category,
    appliance.energy_rating,
    appliance.price,
    appliance.description,
    appliance.image_url,
    appliance.energy_savings,
    appliance.features,
  ])

  connection.query(insertQuery, [values], (error, results) => {
    if (error) {
      console.error(`[${getTimestamp()}] Error seeding appliance data:`, error.stack)
      return
    }
    console.log(`[${getTimestamp()}] Successfully seeded ${results.affectedRows} appliance records`)
  })
}

app.get('/api/ai-design/result/:promptId', async (req, res) => {
  try {
    const { promptId } = req.params

    const historyResponse = await axios.get('http://58.178.177.133:8188/history')
    const history = historyResponse.data[promptId]

    if (!history) {
      return res.json({
        success: true,
        status: 'pending',
        message: 'Design is still processing',
      })
    }

    if (history.outputs && Object.keys(history.outputs).length > 0) {
      const outputNode = Object.values(history.outputs)[0]
      if (outputNode.images && outputNode.images.length > 0) {
        const imageName = outputNode.images[0].filename
        return res.json({
          success: true,
          status: 'completed',
          message: 'Design completed',
          result: {
            imageUrl: `http://58.178.177.133:8188/view?filename=${imageName}`,
            isAIGenerated: true,
            disclaimer:
              'This image is AI-generated and is for reference only. Results may vary in real implementation.',
            disclaimerCN:
              'This image is AI-generated and is for reference only. Results may vary in real implementation.',
          },
        })
      }
    }

    res.json({
      success: true,
      status: 'processing',
      message: 'Design is being processed',
    })
  } catch (error) {
    console.error(`[${getTimestamp()}] Error getting design result:`, error)
    res.status(500).json({
      success: false,
      message: 'Failed to get design result',
      error: error.message,
    })
  }
})

// Generate random string
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Simplified image dimension processing function, mainly used to get dimension information
const getImageDimensions = async (imagePath) => {
  try {
    const sharp = require('sharp')
    const metadata = await sharp(imagePath).metadata()
    return {
      width: metadata.width,
      height: metadata.height,
    }
  } catch (err) {
    console.error(`[${getTimestamp()}] Error getting image dimensions:`, err)
    // Return default dimensions
    return { width: 720, height: 720 }
  }
}

// API endpoint for generating balcony image
app.post('/api/generate-balcony', upload.single('image'), async (req, res) => {
  console.log(`[${getTimestamp()}] POST /api/generate-balcony - Starting image generation`)

  try {
    const { prompt } = req.body
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' })
    }

    if (!workflow) {
      return res.status(500).json({ error: 'Workflow configuration not loaded' })
    }

    // Create temporary directory for storing generated images
    const tempDir = path.join(__dirname, 'temp')
    if (!fsSync.existsSync(tempDir)) {
      await fs.mkdir(tempDir, { recursive: true })
    }

    // Get the path of the uploaded image
    const uploadedImagePath = path.join(__dirname, 'uploads', req.file.filename)

    // Get image dimensions - image already compressed in frontend, only getting info here
    const dimensions = await getImageDimensions(uploadedImagePath)
    const imageWidth = dimensions.width
    const imageHeight = dimensions.height
    console.log(`[${getTimestamp()}] Image dimensions: ${imageWidth}x${imageHeight}`)

    // Update workflow configuration
    const updatedWorkflow = JSON.parse(JSON.stringify(workflow)) // Deep copy workflow

    // Update image path
    if (updatedWorkflow['27'] && updatedWorkflow['27'].inputs) {
      updatedWorkflow['27'].inputs.image = req.file.filename
    }

    // Update image size settings
    if (updatedWorkflow['30'] && updatedWorkflow['30'].inputs) {
      updatedWorkflow['30'].inputs.width = imageWidth
      updatedWorkflow['30'].inputs.height = imageHeight
    }

    // Update prompt
    let foundPrompt = false
    for (const nodeId in updatedWorkflow) {
      const node = updatedWorkflow[nodeId]
      if (node.class_type === 'CLIPTextEncode' && node.inputs && 'text' in node.inputs) {
        // Prompt now uses single plant
        const plantName = prompt.trim()
        // Enhanced prompt, emphasizing preserving original image characteristics
        const enhancedPrompt = `Subtly integrate ${plantName} into the existing balcony, ensuring the plant is placed correctly, such as in a pot, and has a natural and harmonious effect in the photo while preserving 95% of the original image's composition, lighting, colors, and style. Do not alter any existing furniture, railings, walls, floor, or background. Only add ${plantName} in appropriate containers or positions. Maintain exact perspective, shadows, and time of day. The final result should resemble the original photo, with ${plantName} additions that are realistic and respect the original aesthetic.`
        node.inputs.text = enhancedPrompt
        console.log(
          `[${getTimestamp()}] Enhanced prompt with plant '${plantName}': ${enhancedPrompt}`,
        )
        foundPrompt = true
        break
      }
    }

    if (!foundPrompt) {
      return res.status(500).json({ error: 'Prompt node not found in workflow' })
    }

    // Generate random seed
    const randomSeed = Math.floor(Math.random() * (2 ** 32 - 1))
    console.log(`[${getTimestamp()}] Generated random seed: ${randomSeed}`)

    // Update random seed
    for (const nodeId in updatedWorkflow) {
      const node = updatedWorkflow[nodeId]
      if (node.inputs && 'noise_seed' in node.inputs) {
        node.inputs.noise_seed = randomSeed
      }
    }

    // Execute Python script
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../comfyapi/requset.py'),
      '--prompt',
      prompt,
      '--image',
      uploadedImagePath,
      '--workflow',
      JSON.stringify(updatedWorkflow),
    ])

    let output = ''
    let error = ''

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString()
    })

    pythonProcess.on('close', async (code) => {
      // Delete uploaded original image
      try {
        await fs.unlink(uploadedImagePath)
      } catch (err) {
        console.error(`[${getTimestamp()}] Error deleting uploaded image:`, err)
      }

      if (code !== 0) {
        console.error(`[${getTimestamp()}] Python script execution failed:`, error)
        return res.status(500).json({ error: 'Image generation failed' })
      }

      // Find the latest generated image
      const outputDir = path.join(__dirname) // Find images from current server directory
      const files = await fs.readdir(outputDir)
      // Find all matching images, sort by modification time in descending order, take the latest
      const imageFiles = files
        .filter((file) => file.startsWith('output_ComfyUI_') && file.endsWith('.png'))
        .map((file) => ({
          file,
          time: fsSync.statSync(path.join(outputDir, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time)
      const imageFile = imageFiles.length > 0 ? imageFiles[0].file : null

      if (!imageFile) {
        return res.status(500).json({ error: 'Generated image not found' })
      }

      console.log(`[${getTimestamp()}] Found generated image: ${imageFile}`)

      // Generate new file name
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const randomStr = generateRandomString(6)
      const newFileName = `balcony_design_${timestamp}_${randomStr}.png`

      // Move image to temp directory and rename
      const sourcePath = path.join(outputDir, imageFile)
      const targetPath = path.join(tempDir, newFileName)
      await fs.rename(sourcePath, targetPath)

      console.log(`[${getTimestamp()}] Generated image saved as: ${newFileName}`)

      // Read image file
      const imageBuffer = await fs.readFile(targetPath)

      // Set response headers
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline',
        'Cache-Control': 'no-cache',
        'X-AI-Generated': 'true',
      })

      // Return image
      res.send(imageBuffer)
    })
  } catch (error) {
    console.error(`[${getTimestamp()}] Error in image generation:`, error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// In server startup, create necessary directories
createDirectories()
  .then(() => {
    // Create appliance table
    createApplianceTable()

    // Start server
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`[${getTimestamp()}][Server] Started successfully on port`, PORT)
      console.log(`[${getTimestamp()}][Server] Environment:`, process.env.NODE_ENV || 'development')
    })
  })
  .catch((error) => {
    console.error(`[${getTimestamp()}] Failed to create directories:`, error)
    process.exit(1)
  })
