# Database Configuration Guide

## Local Development Environment Setup

1. Install MySQL Database Server

2. Create database and table structure:
```bash
# Connect to MySQL server
mysql -u root

# Execute initialization script
source init.sql
```

3. Configure Environment Variables
Create a `.env` file in the project root directory (do not commit to git repository), add the following configuration:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=uv_defender
```

## Data Migration

1. Export existing data:
```bash
# Export australian_postcodes table data
mysqldump -u root uv_defender australian_postcodes > postcodes_backup.sql
```

2. Import data in new environment:
```bash
# First ensure database and table structure are created
mysql -u root uv_defender < init.sql

# Import data
mysql -u root uv_defender < postcodes_backup.sql
```

## Important Notes

1. Ensure MySQL server is running
2. Modify database connection information according to actual situation
3. Protect database passwords, do not commit them to code repository
4. If using non-root user, ensure the user has sufficient database privileges