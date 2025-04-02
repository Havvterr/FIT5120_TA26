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

### 1. Install Project Dependencies
Run in the project root directory:
```sh
npm install
```

### 2. Development Mode
Start the development server (with hot-reload support):
```sh
npm run dev
```
After starting, visit the prompted URL in your browser (usually http://localhost:5173)

### 3. Production Build
Build for production:
```sh
npm run build
```

### 4. Unit Tests
Run unit tests:
```sh
npm run test:unit
```

### 5. Code Linting
Run ESLint check:
```sh
npm run lint
```

## Configuration Reference

For more configuration information, please refer to [Vite Configuration Reference](https://vitejs.dev/config/).
