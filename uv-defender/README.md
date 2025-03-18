# UV Defender

UV Defender is an application that helps young Australians understand UV index and provides personalized sun protection advice. The application aims to balance skin cancer risk and vitamin D requirements, especially for young adults with darker skin tones.

## Features

- **View UV Index**: Check current UV index based on location or postal code
- **UV Impact Data**: Learn about UV effects on different age groups and heat trends in Australia
- **Personalized Sun Protection Advice**: Get personalized sun protection advice based on skin type and UV index
- **Sunscreen Reminders**: Set reminders to reapply sunscreen
- **Sun Protection Product Recommendations**: Browse and find sun protection products

## Tech Stack

- Frontend: Vue.js
- Backend: Node.js, Express
- Database: MySQL
- APIs: Google Places API, Weather API

## Installation Guide

### Prerequisites

- Node.js (v14+)
- MySQL
- Google Places API key
- Weather API key

### Installation Steps

1. Clone the repository

   ```
   git clone https://github.com/yourusername/uv-defender.git
   cd uv-defender
   ```

2. Install frontend dependencies

   ```
   npm install
   ```

3. Install backend dependencies

   ```
   cd server
   npm install
   ```

4. Configure environment variables

   - Create a `.env` file in the `server` directory
   - Add the following content, replacing with your API keys and database configuration

   ```
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
   WEATHER_API_KEY=your_weather_api_key
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=uv_defender
   PORT=3000
   ```

5. Initialize the database

   ```
   node db-init.js
   ```

6. Start the backend server

   ```
   node server.js
   ```

7. Start the frontend development server in another terminal

   ```
   cd ..
   npm run serve
   ```

8. Access the application
   - Open your browser and visit `http://localhost:8080`

## Deployment

### Build the frontend

```
npm run build
```

### Deploy to server

1. Upload the `dist` directory and `server` directory to your server
2. Install dependencies on the server
   ```
   cd server
   npm install --production
   ```
3. Configure environment variables
4. Start the server
   ```
   node server.js
   ```

## User Stories

1. **View UV Index**: As a young adult, I want to check the UV index for different locations so I can decide on suitable times to go outside and the necessary sun protection measures.
2. **UV Impact Data**: As a young adult, I want to learn about UV dangers in Australia to increase my understanding of age-appropriate tips and techniques.
3. **Personalized Sun Protection Advice**: As a young Australian adult, I want to understand the specific risks and benefits of sun exposure for my skin type in order to develop a personalized sun protection plan that meets my individual needs.
4. **Sunscreen Reminders**: As a young Australian, I want to be reminded when I need to reapply sunscreen so I can maintain protection from the sun throughout the day.
5. **Sun Protection Product Recommendations**: As a young Australian adult, I want to be able to easily find and access sun protection products and clothing so I can protect myself from the sun effectively and conveniently.

## Contribution

Contributions are welcome! Feel free to submit issues or pull requests.

## License

[MIT](LICENSE)
