#!/bin/bash
set -e

# 配置
PROJECT_DIR="/var/www/my-express-api"
NODE_VERSION="18"

echo "🚀 开始安装 Express API 服务环境..."

# 1. 更新系统
echo "🔧 更新 apt 源..."
sudo apt update -y
sudo apt upgrade -y

# 2. 安装必要工具
echo "🔧 安装 curl、git、build-essential..."
sudo apt install -y curl git build-essential

# 3. 安装 Node.js（使用 NodeSource，避免 nvm）
echo "📦 安装 Node.js v$NODE_VERSION..."
curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | sudo -E bash -
sudo apt install -y nodejs

echo "✅ Node.js 版本：$(node -v)"
echo "✅ npm 版本：$(npm -v)"

# 4. 创建项目目录
echo "📁 创建项目目录：$PROJECT_DIR"
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# 5. 克隆或更新代码
if [ ! -d "$PROJECT_DIR/.git" ]; then
  echo "📥 克隆仓库..."
  git clone https://github.com/supermanzero/express-api-demo.git $PROJECT_DIR
else
  echo "🔄 更新仓库代码..."
  cd $PROJECT_DIR
  git pull origin main
fi

cd $PROJECT_DIR

# 6. 安装依赖
echo "📦 安装依赖..."
npm install --production

# 7. 安装 pm2 并启动服务
echo "🚦 安装 pm2 并启动服务..."
sudo npm install -g pm2
pm2 start index.js --name my-express-api
pm2 save
pm2 startup systemd -u $USER --hp $HOME

echo "✅ API 服务已启动！"
echo "🎯 访问地址：http://<your-server-ip>:3000"
