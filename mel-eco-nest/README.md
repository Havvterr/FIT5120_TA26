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

## Project Setup

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
   
### 2. Install Dependencies
1. Install Frontend Dependencies
   ```sh
   # In the project root directory
   npm install
   ```

2. Install Backend Dependencies
   ```sh
   # Navigate to server directory
   cd server
   npm install
   ```

### 3. Start the Application
1. Start Backend Server
   ```sh
   # In the server directory
   npm start
   ```
   The backend server will start on http://localhost:3000

2. Start Frontend Development Server
   ```sh
   # In the project root directory
   npm run dev
   ```
   After starting, visit the prompted URL in your browser (usually http://localhost:5173)

### 4. Production Build
Build for production:
```sh
npm run build
```

### 5. Unit Tests
Run unit tests:
```sh
npm run test:unit
```

### 6. Code Linting
Run ESLint check:
```sh
npm run lint
```

## Configuration Reference

For more configuration information, please refer to [Vite Configuration Reference](https://vitejs.dev/config/).
