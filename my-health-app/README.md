# UV Defender Health Application

This is a Vue.js and Node.js based web application designed to display UV-related health information.

## Environment Requirements

- Node.js >= 14.x
- npm >= 6.x
- MySQL >= 8.0

## Project Structure

```
my-health-app/
├── backend/         # Backend server code
├── src/            # Frontend source code
├── public/         # Static resources
└── functions/      # Cloud functions code
```

## Installation and Running

### 1. Database Configuration

1. Ensure MySQL service is running
2. Navigate to the backend directory and execute the init.sql script to initialize the database

### 2. Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
node server.js
```

The server will start at http://localhost:3000

### 3. Frontend Development Server

```bash
# Install dependencies in project root directory
npm install

# Start development server
npm run serve
```

The application will be available at http://localhost:8080

## Production Deployment

```bash
# Build for production
npm run build
```

The built files will be generated in the `dist` directory

## Common Issues

1. If you encounter port conflicts, you can modify the port numbers in the corresponding configuration files:
   - Frontend: vue.config.js
   - Backend: backend/server.js

2. For database connection issues, please check if the configuration in backend/database.js is correct

## Development Documentation

For more configuration information, please refer to:
- [Vue CLI Configuration Reference](https://cli.vuejs.org/config/)
- [Express Documentation](https://expressjs.com/)
