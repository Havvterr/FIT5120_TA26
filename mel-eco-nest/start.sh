#!/bin/bash

# 启动后端服务
cd server
npm start &

# 返回根目录
cd ..

# 启动前端开发服务器
npm run dev