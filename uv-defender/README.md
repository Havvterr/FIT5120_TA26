# UV Defender

UV Defender 是一个帮助年轻澳大利亚人了解紫外线指数并提供个性化防晒建议的应用程序。该应用程序旨在平衡皮肤癌风险和维生素 D 需求，特别是对于肤色较深的年轻成年人。

## 功能特点

- **查看紫外线指数**：根据位置或邮政编码查看当前紫外线指数
- **紫外线影响数据**：了解紫外线对不同年龄组的影响和澳大利亚热度趋势
- **个性化防晒建议**：根据皮肤类型和紫外线指数获取个性化的防晒建议
- **防晒霜提醒**：设置防晒霜重新涂抹的提醒
- **防晒产品推荐**：浏览和查找防晒产品

## 技术栈

- 前端：Vue.js
- 后端：Node.js, Express
- 数据库：MySQL
- API：Google Places API, Weather API

## 安装指南

### 前提条件

- Node.js (v14+)
- MySQL
- Google Places API 密钥
- Weather API 密钥

### 安装步骤

1. 克隆仓库

   ```
   git clone https://github.com/yourusername/uv-defender.git
   cd uv-defender
   ```

2. 安装前端依赖

   ```
   npm install
   ```

3. 安装后端依赖

   ```
   cd server
   npm install
   ```

4. 配置环境变量

   - 在 `server` 目录中创建 `.env` 文件
   - 添加以下内容，替换为您的 API 密钥和数据库配置

   ```
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
   WEATHER_API_KEY=your_weather_api_key
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=uv_defender
   PORT=3000
   ```

5. 初始化数据库

   ```
   node db-init.js
   ```

6. 启动后端服务器

   ```
   node server.js
   ```

7. 在另一个终端中启动前端开发服务器

   ```
   cd ..
   npm run serve
   ```

8. 访问应用程序
   - 打开浏览器，访问 `http://localhost:8080`

## 部署

### 构建前端

```
npm run build
```

### 部署到服务器

1. 将 `dist` 目录和 `server` 目录上传到您的服务器
2. 在服务器上安装依赖
   ```
   cd server
   npm install --production
   ```
3. 配置环境变量
4. 启动服务器
   ```
   node server.js
   ```

## 用户故事

1. **查看紫外线指数**：作为年轻成年人，我想查看不同地点的紫外线指数，以便决定外出的合适时间和所需的防晒措施。
2. **紫外线影响数据**：作为年轻成年人，我想了解紫外线在澳大利亚的危害，以增加我对适合年龄的提示和技巧的理解。
3. **个性化防晒建议**：作为年轻的澳大利亚成年人，我想了解阳光暴露对我的皮肤类型的特定风险和好处，以便制定满足我个人需求的个性化防晒计划。
4. **防晒霜提醒**：作为年轻的澳大利亚人，我希望在需要重新涂抹防晒霜时得到提醒，以便在一天中保持对阳光的防护。
5. **防晒产品推荐**：作为年轻的澳大利亚成年人，我希望能够轻松找到和获取防晒产品和服装，以便有效和方便地保护自己免受阳光伤害。

## 贡献

欢迎贡献！请随时提交问题或拉取请求。

## 许可证

[MIT](LICENSE)
