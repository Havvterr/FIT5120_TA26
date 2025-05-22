# Mel-Eco-Nest

Mel-Eco-Nest is a comprehensive web application designed to help Melbourne residents understand and mitigate urban heat island effects. The project provides tools for heat mapping, energy-efficient appliance recommendations, and educational resources about heatwave safety.

## Features

- 🌡️ **Heat Map Visualization**: Interactive map showing temperature variations across Melbourne
- 🏠 **Energy Efficiency Tools**:
  - Energy-efficient appliance recommendations
  - Water usage tracking and reminders
  - Plant recommendations for urban cooling
- 📚 **Educational Resources**:
  - Heatwave survival guides
  - Interactive quizzes
  - Planting guides
- 🔍 **Data Analysis**:
  - Temperature trend analysis
  - Energy consumption tracking
  - Environmental impact assessment

## Tech Stack

- **Frontend**:
  - Vue 3
  - Vite
  - Vue Router
  - Axios
  - SCSS
  - Font Awesome
- **Backend**:
  - Node.js
  - Express
  - MySQL
  - JWT Authentication
- **DevOps**:
  - Nginx
  - PM2
  - SSL/TLS

## Project Structure

```
mel-eco-nest/
├── src/                    # Frontend source code
│   ├── assets/            # Static assets
│   ├── components/        # Vue components
│   ├── views/             # Page components
│   ├── router/            # Vue Router configuration
│   ├── store/             # Vuex store
│   └── utils/             # Utility functions
├── server/                # Backend source code
│   ├── config/           # Server configuration
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── public/               # Public static files
└── tests/               # Test files
```

## Development Environment Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Install Node.js

1. Visit [Node.js official website](https://nodejs.org/) to download and install the latest LTS version
2. Verify installation:
   ```sh
   node --version
   npm --version
   ```

### 2. IDE Setup

Recommended to use [VSCode](https://code.visualstudio.com/) with these plugins:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Quick Start Guide

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/mel-eco-nest.git
cd mel-eco-nest
```

### 2. Install Dependencies

```sh
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration

1. Frontend Configuration

   - Create `.env` in project root:
     ```
     VITE_API_BASE_URL=http://localhost:3000
     ```

2. Backend Configuration
   - Create `.env` in server directory:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=mel_eco_nest
     OPENWEATHERMAP_API_KEY=your_api_key
     ```

### 4. Database Setup

1. Create MySQL database:

   ```sql
   CREATE DATABASE mel_eco_nest;
   ```

2. Run database migrations:
   ```sh
   cd server
   npm run migrate
   ```

### 5. Start Development Servers

1. Start backend server:

   ```sh
   cd server
   npm run dev
   ```

2. Start frontend development server (in new terminal):
   ```sh
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Deployment

### 1. Frontend Deployment

1. Build the frontend:

   ```sh
   npm run build
   ```

2. The built files will be in the `dist` directory.

### 2. Backend Deployment

1. Install PM2 globally:

   ```sh
   npm install -g pm2
   ```

2. Start the server with PM2:
   ```sh
   cd server
   pm2 start server.js --name mel-eco-nest
   ```

### 3. Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name meleconest.me;

    ssl_certificate /etc/ssl/meleconest_me.crt;
    ssl_certificate_key /etc/ssl/meleconest_me.key;
    ssl_trusted_certificate /etc/ssl/meleconest_me.ca-bundle;

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /var/www/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name meleconest.me;
    return 301 https://$host$request_uri;
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Verify MySQL service is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **API Connection Issues**

   - Verify backend server is running
   - Check API base URL in frontend `.env`
   - Check network connectivity

3. **Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables

## Support

For support, please contact:

- Technical Support: [support@meleconest.me](mailto:support@meleconest.me)
- Database Support: [rlia0025@student.monash.edu](mailto:rlia0025@student.monash.edu)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Melbourne City Council for data support
- Monash University for research collaboration
- OpenWeatherMap for weather data API
