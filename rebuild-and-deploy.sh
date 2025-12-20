#!/bin/bash

echo "🔨 Building Docker image with admin panel..."
docker build --platform linux/amd64 -t medusa-raqueto-app:latest .

echo "🏷️ Tagging image..."
docker tag medusa-raqueto-app:latest us-central1-docker.pkg.dev/medusa-world/medusajs/medusa-raqueto-app:latest

echo "📤 Pushing to Google Container Registry..."
docker push us-central1-docker.pkg.dev/medusa-world/medusajs/medusa-raqueto-app:latest

echo "🚀 Deploying to Cloud Run..."
bash deploy-cr-server.sh

echo ""
echo "✅ Deployment complete!"
echo "🌐 Admin URL: https://api.raqueto.shop/app"
echo "📝 Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5) to see new UI!"

