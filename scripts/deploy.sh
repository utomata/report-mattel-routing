#!/bin/bash

# Cloud Run Multi-Container Deployment Script
# Usage: ./scripts/deploy.sh [environment] [region]

set -e

# Default values
ENVIRONMENT=${1:-production}
REGION=${2:-us-central1}
PROJECT_ID=$(gcloud config get-value project)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment to Cloud Run...${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"
echo -e "${YELLOW}Project: ${PROJECT_ID}${NC}"

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated with gcloud. Please run 'gcloud auth login'${NC}"
    exit 1
fi

# Enable required APIs
echo -e "${GREEN}📡 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Create Artifact Registry repository if it doesn't exist
REPO_NAME="mattel-routing"
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION &>/dev/null; then
    echo -e "${GREEN}📦 Creating Artifact Registry repository...${NC}"
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Mattel routing optimization containers"
fi

# Configure Docker to use Artifact Registry
echo -e "${GREEN}🔧 Configuring Docker authentication...${NC}"
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Build and push backend image
echo -e "${GREEN}🏗️ Building backend image...${NC}"
BACKEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/backend:${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"

docker build -f apps/backend/Dockerfile -t $BACKEND_IMAGE .
docker push $BACKEND_IMAGE

# Build and push frontend image
echo -e "${GREEN}🏗️ Building frontend image...${NC}"
FRONTEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/frontend:${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"

docker build -f apps/web/Dockerfile -t $FRONTEND_IMAGE .
docker push $FRONTEND_IMAGE

# Deploy backend service
echo -e "${GREEN}🚀 Deploying backend service...${NC}"
gcloud run deploy mattel-routing-backend \
    --image=$BACKEND_IMAGE \
    --platform=managed \
    --region=$REGION \
    --allow-unauthenticated \
    --memory=1Gi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --port=8080 \
    --set-env-vars="NODE_ENV=${ENVIRONMENT}" \
    --timeout=300

# Get backend URL
BACKEND_URL=$(gcloud run services describe mattel-routing-backend --region=$REGION --format="value(status.url)")
echo -e "${GREEN}✅ Backend deployed at: ${BACKEND_URL}${NC}"

# Deploy frontend service
echo -e "${GREEN}🚀 Deploying frontend service...${NC}"
gcloud run deploy mattel-routing-frontend \
    --image=$FRONTEND_IMAGE \
    --platform=managed \
    --region=$REGION \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=5 \
    --port=8080 \
    --set-env-vars="VITE_API_URL=${BACKEND_URL}/api,NODE_ENV=${ENVIRONMENT}" \
    --timeout=300

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe mattel-routing-frontend --region=$REGION --format="value(status.url)")
echo -e "${GREEN}✅ Frontend deployed at: ${FRONTEND_URL}${NC}"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}Backend API: ${BACKEND_URL}${NC}"
echo -e "${YELLOW}Frontend App: ${FRONTEND_URL}${NC}"

# Optional: Set up custom domain mapping
read -p "Do you want to set up a custom domain? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your domain (e.g., app.yourdomain.com): " DOMAIN
    if [[ ! -z "$DOMAIN" ]]; then
        echo -e "${GREEN}🌐 Setting up domain mapping for ${DOMAIN}...${NC}"
        gcloud run domain-mappings create \
            --service=mattel-routing-frontend \
            --domain=$DOMAIN \
            --region=$REGION
        echo -e "${GREEN}✅ Domain mapping created. Please configure your DNS.${NC}"
    fi
fi

echo -e "${GREEN}🔗 Useful commands:${NC}"
echo -e "${YELLOW}View logs: gcloud run logs tail mattel-routing-backend --region=${REGION}${NC}"
echo -e "${YELLOW}Update service: gcloud run services update mattel-routing-backend --region=${REGION}${NC}"
echo -e "${YELLOW}Delete service: gcloud run services delete mattel-routing-backend --region=${REGION}${NC}" 