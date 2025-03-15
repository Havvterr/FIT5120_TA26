# UV Defender Health Application

A comprehensive web application built with Vue.js and Node.js, designed to provide UV-related health information and protection guidance. This application helps users understand UV risks and take appropriate protective measures.

## Environment Requirements

- Node.js >= 14.x
- npm >= 6.x
- MySQL >= 8.0

## Project Structure

```
my-health-app/
├── backend/         # Backend server code and API endpoints
├── src/            # Frontend Vue.js source code
├── public/         # Static resources and assets
└── functions/      # Cloud functions for additional features
```

## Getting Started

### 1. Database Setup

1. Ensure your MySQL service is running on your machine
2. Navigate to the `backend` directory
3. Execute the `init.sql` script to initialize the database schema and data:
   ```bash
   mysql -u your_username -p < init.sql
   ```
4. Configure your database connection:
   - Copy `database.js.example` to `database.js`
   - Update the database configuration with your MySQL credentials:
     ```javascript
     module.exports = {
       host: 'localhost',
       user: 'your_username',
       password: 'your_password',
       database: 'uv_defender'
     }
     ```

### 2. Import CSV Data

1. Navigate to the `database-import` directory:
   ```bash
   cd ../database-import
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Run the data import script:
   ```bash
   node import-data.js
   ```
   This will import the Australian postcodes data from `australian_postcodes.csv` into your MySQL database.

   Note: Make sure your database connection settings in `database-import/database.js` match your main database configuration.

### 2. Backend Server Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Start the server
npm start
# or
node server.js
```

The backend server will start at http://localhost:3000

### 3. Frontend Development Server

```bash
# Return to project root directory
cd ..

# Install frontend dependencies
npm install

# Start development server
npm run serve
```

The application will be available at http://localhost:8080

## Production Deployment

```bash
# Build for production with minification
npm run build
```

The production-ready files will be generated in the `dist` directory.

## Troubleshooting

### Port Conflicts
If you encounter port conflicts, you can modify the port numbers in:
- Frontend: `vue.config.js`
- Backend: `backend/server.js`

### Database Connection Issues
1. Verify MySQL service is running
2. Check database configuration in `backend/database.js`
3. Ensure database credentials are correct

### Common Errors
1. `npm install` fails:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and try again

2. Backend server won't start:
   - Check if MySQL is running
   - Verify database connection settings
   - Ensure required ports are available

## Development Resources

- [Vue.js Documentation](https://vuejs.org/)
- [Vue CLI Configuration Reference](https://cli.vuejs.org/config/)
- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## License

This project is licensed under the MIT License.
