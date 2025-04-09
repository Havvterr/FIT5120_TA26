# Mel-Eco-Nest 部署指南

本文档提供了将Mel-Eco-Nest Vue.js应用部署到DigitalOcean Droplet的详细步骤。

## 前提条件

- 已创建DigitalOcean账户
- 已创建Droplet（推荐Ubuntu 22.04 LTS）
- 已配置域名（可选）

## 1. 初始化服务器

### 1.1 连接到Droplet

```bash
ssh root@your_droplet_ip
```

### 1.2 更新系统包

```bash
apt update
apt upgrade -y
```

### 1.3 安装必要的工具

```bash
apt install -y curl git nginx
```

## 2. 安装Node.js

```bash
# 安装Node.js 18.x LTS版本
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 验证安装
node --version
npm --version
```

## 3. 安装PM2

```bash
npm install -g pm2
```

## 4. 部署应用

### 4.1 克隆项目

```bash
cd /var/www
git clone <your-repository-url> mel-eco-nest
cd mel-eco-nest
```

### 4.2 安装依赖并构建

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

### 4.3 配置环境变量

```bash
# 创建并编辑.env文件
cp .env.example .env
nano .env

# 设置必要的环境变量
VITE_API_URL=http://your_domain_or_ip
```

## 5. 配置Nginx

### 5.1 创建Nginx配置文件

```bash
nano /etc/nginx/sites-available/mel-eco-nest
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    root /var/www/mel-eco-nest/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API反向代理配置（如果需要）
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

### 5.2 启用站点配置

```bash
ln -s /etc/nginx/sites-available/mel-eco-nest /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # 删除默认配置
nginx -t  # 测试配置
systemctl restart nginx
```

## 6. 使用PM2启动应用（如果有后端服务）

```bash
cd /var/www/mel-eco-nest/server
pm2 start server.js --name "mel-eco-nest-api"
pm2 save  # 保存PM2配置
```

## 7. 配置SSL（推荐）

### 7.1 安装Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 7.2 获取SSL证书

```bash
certbot --nginx -d your_domain
```

## 8. 维护命令

### 更新应用

```bash
cd /var/www/mel-eco-nest
git pull
npm install
npm run build
```

### 重启服务

```bash
# 重启Nginx
systemctl restart nginx

# 重启API服务（如果有）
pm2 restart mel-eco-nest-api
```

## 9. 监控

```bash
# 查看PM2状态
pm2 status

# 查看日志
pm2 logs

# 查看Nginx访问日志
tail -f /var/log/nginx/access.log
```

## 故障排除

1. 如果网站无法访问：
   - 检查Nginx状态：`systemctl status nginx`
   - 检查防火墙配置：确保端口80和443开放
   - 查看Nginx错误日志：`tail -f /var/log/nginx/error.log`

2. 如果API服务无响应：
   - 检查PM2进程：`pm2 status`
   - 查看API日志：`pm2 logs mel-eco-nest-api`
   - 确认环境变量配置正确

## 安全建议

1. 设置防火墙规则
```bash
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw enable
```

2. 定期更新系统和依赖
```bash
apt update && apt upgrade -y
npm audit fix
```

3. 使用非root用户运行应用
4. 定期备份数据
5. 监控服务器资源使用情况

## 备注

- 请根据实际情况修改配置中的域名和IP地址
- 确保所有敏感信息都通过环境变量配置
- 建议在生产环境中启用HTTPS
- 定期检查和更新SSL证书