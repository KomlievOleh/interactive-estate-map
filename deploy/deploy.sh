# chmod +x deploy.sh
# ./deploy.sh
#!/bin/bash

set -e

PROJECT_DIR="/home/ubuntu/interactive-property-map"
BUILD_DIR="$PROJECT_DIR/dist"
WEB_DIR="/var/www/propertymap"
BACKUP_DIR="/var/www/propertymap_backup"
APP_NAME="propertymap-api"


cd "$PROJECT_DIR"

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
npm i

echo "Building project..."
npm run build

echo "Creating backup..."
sudo rm -rf "$BACKUP_DIR"
sudo cp -r "$WEB_DIR" "$BACKUP_DIR" || true

echo "Deploying new build..."
sudo rm -rf "$WEB_DIR"/*
sudo cp -r "$BUILD_DIR"/* "$WEB_DIR"/

echo "Setting permissions..."
sudo chown -R www-data:www-data "$WEB_DIR"

echo "Starting or reloading API with PM2..."
pm2 startOrReload ecosystem.config.cjs --env production

echo "Saving PM2 process list..."
pm2 save

echo "Testing Nginx..."
sudo nginx -t

sudo ln -s /etc/nginx/sites-available/storelocatormap /etc/nginx/sites-enabled/

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "Deploy completed successfully."

