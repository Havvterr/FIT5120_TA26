# Google Cloud Platform Deployment Guide

## Database Migration

### 1. Create Cloud SQL Instance

1. Log in to Google Cloud Console
2. Navigate to SQL page
3. Click "Create Instance"
4. Select MySQL
5. Configure instance:
   - Set instance ID
   - Set root password
   - Choose region (recommended: asia-southeast1)
   - Select appropriate machine configuration

### 2. Configure Database Connection

1. Get the following information from Cloud SQL instance details page:
   - Instance connection name
   - Database IP address

2. Set environment variables:
```bash
export DB_HOST='your-cloud-sql-ip'
export DB_USER='your-database-user'
export DB_PASSWORD='your-database-password'
export DB_NAME='uv_defender'
```

3. Modify application configuration:
   - Rename `backend/database.js` to `database.local.js`
   - Use `database.cloud.js` as the new database configuration file

### 3. Database Migration

1. Create database in Cloud SQL instance:
```sql
CREATE DATABASE uv_defender;
```

2. Execute initialization script:
```bash
# Connect to Cloud SQL instance
mysql -h [CLOUD_SQL_IP] -u [USERNAME] -p uv_defender < backend/init.sql
```

3. Import data:
```bash
# Export data from local database
mysqldump -u root uv_defender australian_postcodes > postcodes_backup.sql

# Import to Cloud SQL
mysql -h [CLOUD_SQL_IP] -u [USERNAME] -p uv_defender < postcodes_backup.sql
```

## Application Deployment

### 1. Prerequisites

1. Install Google Cloud SDK
2. Initialize project:
```bash
gcloud init
```

### 2. Deploy Application

1. Build frontend application:
```bash
npm run build
```

2. Deploy to App Engine:
```bash
gcloud app deploy
```

### 3. Verify Deployment

1. Access the deployed application URL
2. Verify database connection
3. Test core functionalities

## Important Notes

1. Ensure necessary APIs are enabled in Google Cloud Console
2. Configure appropriate firewall rules
3. Set up database backup strategy
4. Monitor application performance and database metrics