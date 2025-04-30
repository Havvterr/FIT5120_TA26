# melb-eco-nest

This is a project based on Vue 3 and Vite. Below are the development environment setup and development guidelines.

## Development Environment Setup

### 1. Install Node.js
1. Visit [Node.js official website](https://nodejs.org/) to download and install the latest LTS version
2. After installation, open command line tool to verify the installation:
   ```sh
   node --version
   npm --version
   ```

### 2. IDE Setup
Recommended to use [VSCode](https://code.visualstudio.com/) as the development tool, and install the following plugins:
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (please disable Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Quick Start Guide

### 1. Start Backend Server
```sh
cd mel-eco-nest
cd server
npm install
node server.js
```

### 2. Start Frontend Development Server
Open a new terminal, then:
```sh
cd mel-eco-nest
npm install
npm run dev
```

## Detailed Project Setup

### 1. Environment Configuration
1. Frontend Configuration
   - Create a new `.env` file in the project root directory
   - Update the environment variables in `.env` according to your needs

2. Backend Configuration
   - Navigate to the `server` directory
   - Copy `.env.example` to create a new `.env` file
   - Configure the following environment variables in the server's `.env` file:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=your_database_name
     ```
   - Ask Ruifeng(rlia0025@student.monash.edu) for the database connection information

### 2. Production Build
Build for production:
```sh
npm run build
```

### 3. Unit Tests
Run unit tests:
```sh
npm run test:unit
```

### 4. Code Linting
Run ESLint check:
```sh
npm run lint
```

## Deployment Guide

### 1. Frontend Deployment
1. Build the frontend for production:
   ```sh
   npm run build
   ```
2. The built files will be in the `dist` directory.

### 2. Backend Deployment
1. Ensure Node.js is installed on your server.
2. Copy the `server` directory to your deployment server.
3. Install dependencies:
   ```sh
   cd server
   npm install
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### 3. Nginx Configuration
Here's a sample Nginx configuration for deploying the application:

```nginx
server {
    listen 443 ssl;
    server_name meleconest.me;

    ssl_certificate /etc/ssl/meleconest_me.crt;
    ssl_certificate_key /etc/ssl/meleconest_me.key;
    ssl_trusted_certificate /etc/ssl/meleconest_me.ca-bundle;

    # Proxy /api/ to internal HTTP API service
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve frontend
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

## Configuration Reference

For more configuration information, please refer to [Vite Configuration Reference](https://vitejs.dev/config/).


