[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/mel-eco-nest/actions)

# Mel-Eco-Nest

Mel-Eco-Nest is a comprehensive web application designed to help Melbourne residents understand and mitigate urban heat island effects through sustainable urban greening practices. The platform provides interactive tools for visualizing heat patterns, recommending suitable plants, and offering practical guidance for urban vegetation management.

## 🌟 Features

- Interactive heat map visualization of Melbourne's urban heat island effect
- Plant recommendation system based on location and environmental conditions
- Water usage tracking and reminders for urban vegetation
- Planting guides and best practices for urban greening
- Mitigation strategies and resources for reducing urban heat

## 📸 Screenshots

![Heat Map View](docs/screenshots/heat-map.png)
_Interactive heat map visualization of Melbourne's urban heat island effect_

![Plant Recommendations](docs/screenshots/plant-recommendations.png)
_Plant recommendation system with detailed information_

![Water Reminder](docs/screenshots/water-reminder.png)
_Water usage tracking and reminder system_

## 🛠️ Tech Stack

- **Frontend**:

  - Vue 3.5
  - Vite 6.2
  - Pinia 3.0
  - Vue Router 4.5
  - Leaflet.js 1.9
  - Axios 1.8

- **Backend**:

  - Node.js
  - Express 4.18
  - MySQL 3.6
  - CORS 2.8

- **Development Tools**:
  - ESLint 9.21
  - Prettier 3.5
  - Vitest 3.0
  - Vue DevTools

## 📁 Project Structure

```
mel-eco-nest/
|-- src/                    # Frontend source code
|   |-- assets/            # Static assets
|   |-- components/        # Vue components
|   |-- views/             # Page components
|   |-- router/            # Vue Router configuration
|   |-- stores/            # Pinia stores
|   `-- services/          # API services
|-- server/                # Backend source code
|   |-- uploads/          # File upload directory
|   |-- temp/             # Temporary files
|   `-- server.js         # Main server file
`-- public/               # Public static files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- MySQL (v8 or higher)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/mel-eco-nest.git
   cd mel-eco-nest
   ```

2. Install frontend dependencies

   ```bash
   npm install
   ```

3. Install backend dependencies

   ```bash
   cd server
   npm install
   ```

4. Set up environment variables

   Frontend (.env):

   ```
   VITE_API_URL=http://localhost:3000
   ```

   Backend (server/.env):

   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   ```

5. Start the development servers

   ```bash
   # Start both frontend and backend
   npm run start:all

   # Or start them separately
   # Frontend
   npm run dev
   # Backend
   cd server && npm start
   ```

## 🧪 Testing

```bash
# Run unit tests
npm run test:unit

# Run linting
npm run lint
```

## 📦 Deployment

See [deployment_eng.md](deployment_eng.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Team Lead**: [Your Name](https://github.com/yourusername)
- **Frontend Developer**: [Team Member 1](https://github.com/username1)
- **Backend Developer**: [Team Member 2](https://github.com/username2)
- **UI/UX Designer**: [Team Member 3](https://github.com/username3)

## 🙏 Acknowledgments

- Monash University FIT5120 Team 26
- City of Melbourne for providing environmental data
- All contributors who have helped shape this project

## 📞 Contact

- Project Link: [https://github.com/yourusername/mel-eco-nest](https://github.com/yourusername/mel-eco-nest)
- Email: [your.email@example.com](mailto:your.email@example.com)

## 📚 Documentation

For more detailed documentation, please visit our [Wiki](https://github.com/yourusername/mel-eco-nest/wiki).
