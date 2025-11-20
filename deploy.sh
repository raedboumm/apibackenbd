#!/bin/bash

# API Platform - Backend Deployment Script
# Run this script on your server after uploading the backend folder

echo "🚀 Starting API Platform Backend Deployment..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create .env file from production template
echo "⚙️  Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.production .env
    echo "✅ Environment file created"
else
    echo "⚠️  .env file already exists, skipping..."
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    npm install -g pm2
fi

# Stop existing instance if running
pm2 stop api-platform-backend 2>/dev/null || true
pm2 delete api-platform-backend 2>/dev/null || true

# Start with PM2
echo "▶️  Starting backend with PM2..."
pm2 start server.js --name api-platform-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

echo ""
echo "✅ Backend deployment complete!"
echo ""
echo "📊 Status:"
pm2 status

echo ""
echo "📝 View logs:"
echo "pm2 logs api-platform-backend"
echo ""
echo "🔗 Test backend:"
echo "curl http://localhost:5000/health"
