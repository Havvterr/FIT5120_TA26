const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 启用CORS
app.use(cors());
app.use(express.json());

// 创建数据库连接
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// 连接到数据库
connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database: ' + error.stack);
    return;
  }
  console.log('Successfully connected to the database.');
});

// 获取所有植物数据的API端点
app.get('/plants', (req, res) => {
  const query = 'SELECT * FROM plant';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    res.json(results);
  });
});

// 获取植物推荐的API端点
app.post('/plants/recommendations', (req, res) => {
  const { userPreferences } = req.body;
  
  if (!userPreferences) {
    return res.status(400).json({ error: 'User preferences are required' });
  }

  const query = 'SELECT * FROM plant';
  
  connection.query(query, (error, plants) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }

    // 计算每个植物的得分
    const scoredPlants = plants.map(plant => {
      let score = 0;
      
      // 根据光照需求评分
      if (plant.sunlight_needs === userPreferences.sunlight) {
        score += 3;
      } else if (
        (plant.sunlight_needs === 'Partial Shade' && userPreferences.sunlight === 'Full Sun') ||
        (plant.sunlight_needs === 'Full Sun' && userPreferences.sunlight === 'Partial Shade')
      ) {
        score += 1;
      }

      // 根据浇水需求评分
      if (plant.water_needs === userPreferences.waterNeeds) {
        score += 3;
      } else if (
        (plant.water_needs === 'Medium' && (userPreferences.waterNeeds === 'Low' || userPreferences.waterNeeds === 'High')) ||
        (plant.water_needs === 'Low' && userPreferences.waterNeeds === 'Medium') ||
        (plant.water_needs === 'High' && userPreferences.waterNeeds === 'Medium')
      ) {
        score += 1;
      }

      // 根据维护难度评分
      if (plant.maintenance_level === userPreferences.maintenanceLevel) {
        score += 3;
      } else if (
        (plant.maintenance_level === 'Medium' && (userPreferences.maintenanceLevel === 'Low' || userPreferences.maintenanceLevel === 'High')) ||
        (plant.maintenance_level === 'Low' && userPreferences.maintenanceLevel === 'Medium') ||
        (plant.maintenance_level === 'High' && userPreferences.maintenanceLevel === 'Medium')
      ) {
        score += 1;
      }

      // 考虑植物优先级
      score += (4 - plant.priority);

      return { ...plant, score };
    });

    // 按分数降序排序并过滤掉得分过低的植物
    const recommendations = scoredPlants
      .filter(plant => plant.score >= 8) // 只返回得分大于等于3的植物
      .sort((a, b) => b.score - a.score); // 按得分从高到低排序

    res.json(recommendations);
  });
});


// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});