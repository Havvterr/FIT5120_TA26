const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json());

// 数据库连接配置
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'uv_defender'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to database');
});

// 搜索邮编和suburb的API
app.get('/api/search-location', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ results: [] });
    }

    // 使用LIKE进行模糊搜索
    const [results] = await db.promise().query(
      'SELECT postcode, suburb, state FROM australian_postcodes WHERE postcode LIKE ? OR suburb LIKE ? LIMIT 10',
      [`${query}%`, `${query}%`]
    );

    res.json({ results });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UV指数查询API
app.get('/api/uv-index/:postcode', async (req, res) => {
  try {
    const { postcode } = req.params;
    
    // 验证邮编格式
    if (!/^\d{4}$/.test(postcode)) {
      return res.status(400).json({ error: 'Invalid postcode format' });
    }

    // 从数据库查询该邮编的位置信息
    const [location] = await db.promise().query(
      'SELECT latitude, longitude FROM australian_postcodes WHERE postcode = ?',
      [postcode]
    );

    if (!location.length) {
      return res.status(404).json({ error: 'Postcode not found' });
    }

    // 模拟UV指数计算（实际应用中应调用天气API获取真实数据）
    const uvIndex = Math.floor(Math.random() * 12);
    const uvLevel = getUVLevel(uvIndex);

    res.json({
      postcode,
      uvIndex,
      level: uvLevel.level,
      message: uvLevel.message
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UV等级判断函数
function getUVLevel(index) {
  if (index < 3) {
    return { level: 'Low', message: 'Minimal sun protection needed.' };
  } else if (index < 6) {
    return { level: 'Moderate', message: 'Consider wearing sunglasses and sunscreen.' };
  } else if (index < 8) {
    return { level: 'High', message: 'Wear a hat, sunglasses, and sunscreen.' };
  } else if (index < 11) {
    return { level: 'Very High', message: 'Seek shade and use strong sunscreen.' };
  } else {
    return { level: 'Extreme', message: 'Stay indoors or use maximum protection!' };
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});