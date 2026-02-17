#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting Medusa Backend Deployment to Cloud Run..."
echo ""

# Step 0: Yarn build medusa server
echo "📦 Step 0/4: Building medusa server..."
yarn build
echo "✅ medusa server built successfully"
echo ""

# Step 1: Build Docker image
echo "📦 Step 1/4: Building Docker image..."
docker build --platform linux/amd64 -t medusa-raqueto-app:latest .
echo "✅ Docker image built successfully"
echo ""

# Step 2: Tag image for Google Container Registry
echo "🏷️  Step 2/4: Tagging image for GCR..."
docker tag medusa-raqueto-app:latest us-central1-docker.pkg.dev/medusa-world/medusajs/medusa-raqueto-app:latest
echo "✅ Image tagged successfully"
echo ""

# Step 3: Push to Google Container Registry
echo "⬆️  Step 3/4: Pushing image to GCR..."
docker push us-central1-docker.pkg.dev/medusa-world/medusajs/medusa-raqueto-app:latest
echo "✅ Image pushed successfully"
echo ""

# Step 4: Deploy to Cloud Run
echo "☁️  Step 4/4: Deploying to Cloud Run..."
gcloud run deploy medusa-raqueto-app \
    --image="us-central1-docker.pkg.dev/medusa-world/medusajs/medusa-raqueto-app:latest" \
    --region="us-central1" \
    --allow-unauthenticated \
    --min-instances=0 \
    --max-instances=3 \
    --cpu=1 \
    --memory=1.5Gi \
    --port=8080 \
    --concurrency=80 \
    --timeout=300 \
    --env-vars-file=env-server.yaml

echo ""
echo "🎉 Deployment completed successfully!"
echo "🌐 Your backend is live at: https://api.raqueto.shop"
echo "" 