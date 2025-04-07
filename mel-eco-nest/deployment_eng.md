# Mel-Eco-Nest Deployment Guide

This document provides detailed steps for deploying the Mel-Eco-Nest Vue.js application to a DigitalOcean Droplet.

## Prerequisites

- DigitalOcean account created
- Droplet created (Ubuntu 22.04 LTS recommended)
- Domain name configured (optional)

## 1. Server Initialization

### 1.1 Connect to Droplet

```bash
ssh root@your_droplet_ip
```

### 1.2 Update System Packages

```bash
apt update
apt upgrade -y
```

### 1.3 Install Required Tools

```bash
apt install -y curl git nginx
```

## 2. Install Node.js

```bash
# Install Node.js 18.x LTS version
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Verify installation
node --version
npm --version
```

## 3. Install PM2

```bash
npm install -g pm2
```

## 4. Deploy Application

### 4.1 Clone Project

```bash
cd /var/www
git clone <your-repository-url> mel-eco-nest
cd mel-eco-nest
```

### 4.2 Install Dependencies and Build

```bash
# Install dependencies
npm install

# Build production version
npm run build
```

### 4.3 Configure Environment Variables

```bash
# Create and edit .env file
cp .env.example .env
nano .env

# Set necessary environment variables
VITE_API_URL=http://your_domain_or_ip
```

## 5. Configure Nginx

### 5.1 Create Nginx Configuration File

```bash
nano /etc/nginx/sites-available/mel-eco-nest
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    root /var/www/mel-eco-nest/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API reverse proxy configuration (if needed)
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.2 Enable Site Configuration

```bash
ln -s /etc/nginx/sites-available/mel-eco-nest /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default configuration
nginx -t  # Test configuration
systemctl restart nginx
```

## 6. Start Application with PM2 (if backend service exists)

```bash
cd /var/www/mel-eco-nest/server
pm2 start server.js --name "mel-eco-nest-api"
pm2 save  # Save PM2 configuration
```

## 7. Configure SSL (Recommended)

### 7.1 Install Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificate

```bash
certbot --nginx -d your_domain
```

## 8. Maintenance Commands

### Update Application

```bash
cd /var/www/mel-eco-nest
git pull
npm install
npm run build
```

### Restart Services

```bash
# Restart Nginx
systemctl restart nginx

# Restart API service (if exists)
pm2 restart mel-eco-nest-api
```

## 9. Monitoring

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs

# View Nginx access logs
tail -f /var/log/nginx/access.log
```

## Troubleshooting

1. If website is inaccessible:
   - Check Nginx status: `systemctl status nginx`
   - Check firewall configuration: ensure ports 80 and 443 are open
   - View Nginx error logs: `tail -f /var/log/nginx/error.log`

2. If API service is unresponsive:
   - Check PM2 processes: `pm2 status`
   - View API logs: `pm2 logs mel-eco-nest-api`
   - Verify environment variables are correctly configured

## Security Recommendations

1. Set firewall rules
```bash
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw enable
```

2. Regularly update system and dependencies
```bash
apt update && apt upgrade -y
npm audit fix
```

3. Run application with non-root user
4. Regularly backup data
5. Monitor server resource usage

## Notes

- Modify domain name and IP address according to your actual setup
- Ensure all sensitive information is configured through environment variables
- HTTPS is recommended for production environment
- Regularly check and update SSL certificates