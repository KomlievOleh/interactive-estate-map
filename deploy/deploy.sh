# chmod +x deploy.sh
# ./deploy.sh

#!/bin/bash

set -e

PROJECT_DIR="/home/ubuntu/interactive-estate-map"
BUILD_DIR="$PROJECT_DIR/dist"
WEB_DIR="/var/www/propertymap"
BACKUP_DIR="/var/www/propertymap_backup"
APP_NAME="propertymap-api"

cd "$PROJECT_DIR"

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
npm ci || npm i

echo "Building project..."
npm run build

echo "Creating backup..."
sudo rm -rf "$BACKUP_DIR"
if [ -d "$WEB_DIR" ]; then
  sudo cp -r "$WEB_DIR" "$BACKUP_DIR"
fi

echo "Preparing web directory..."
sudo mkdir -p "$WEB_DIR"
sudo rm -rf "$WEB_DIR"/*

echo "Deploying new build..."
sudo cp -r "$BUILD_DIR"/* "$WEB_DIR"/

echo "Setting permissions..."
sudo chown -R www-data:www-data "$WEB_DIR"

echo "Starting or reloading API with PM2..."
pm2 startOrReload ecosystem.config.cjs --env production

echo "Saving PM2 process list..."
pm2 save

echo "Testing Nginx..."
sudo nginx -t

echo "Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/propertymap /etc/nginx/sites-enabled/propertymap

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "Deploy completed successfully."


