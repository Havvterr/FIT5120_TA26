# UV Defender - Your Personal UV Protection Assistant

UV Defender is a web application designed to help users protect themselves from harmful UV radiation by providing personalized UV protection advice and real-time UV index information.

## Technology Stack

- Frontend: Vue.js 3
- Backend: Node.js with Express
- Database: MySQL
- Additional Libraries: Chart.js, FullCalendar

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A modern web browser

## Project Setup

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Create necessary environment variables:
   - Create a `.env` file in the root directory
   - Add required API keys (Mapbox, Firebase, etc.)

## Development

### Start Frontend Development Server
```bash
npm run serve
```
This will launch the development server at `http://localhost:3001` or the specified port.

### Start Backend Server
```bash
cd server
npm install
node server.js
```
The backend server will run on `http://localhost:3000` or the specified port.

### Additional Commands

```bash
# Compile and minify for production
npm run build

# Lint and fix files
npm run lint
```

## Project Structure

- `/src` - Frontend source code
- `/server` - Backend server code
- `/public` - Static assets
- `/functions` - Firebase Cloud Functions

## Features

- Real-time UV index monitoring
- Personalized UV protection advice
- Interactive UV map
- User profile management
- Calendar integration for UV tracking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is private and confidential.
