#!/bin/bash

# Cloud Run Sidecar Deployment Script
# Usage: ./scripts/deploy-sidecar.sh [environment] [region] [project-id]

set -e

# Default values
ENVIRONMENT=${1:-production}
REGION=${2:-us-central1}
PROJECT_ID=${3:-$(gcloud config get-value project)}
SERVICE_NAME="mattel-routing-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Cloud Run Sidecar deployment...${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"
echo -e "${YELLOW}Project: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Service: ${SERVICE_NAME}${NC}"

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated with gcloud. Please run 'gcloud auth login'${NC}"
    exit 1
fi

# Enable required APIs
echo -e "${BLUE}📋 Enabling required APIs...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    --project=${PROJECT_ID}

# Create Artifact Registry repository if it doesn't exist
echo -e "${BLUE}📦 Setting up Artifact Registry...${NC}"
REPO_NAME="mattel-routing"
if ! gcloud artifacts repositories describe ${REPO_NAME} --location=${REGION} --project=${PROJECT_ID} >/dev/null 2>&1; then
    gcloud artifacts repositories create ${REPO_NAME} \
        --repository-format=docker \
        --location=${REGION} \
        --description="Mattel routing optimization containers" \
        --project=${PROJECT_ID}
fi

# Configure Docker authentication
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Build and push Nginx sidecar image
echo -e "${BLUE}🔨 Building Nginx sidecar image...${NC}"
NGINX_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/nginx-proxy:${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
docker build -f docker/nginx-sidecar/Dockerfile -t ${NGINX_IMAGE} .
docker push ${NGINX_IMAGE}

# Build and push FastAPI image
echo -e "${BLUE}🔨 Building FastAPI image...${NC}"
FASTAPI_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/fastapi-app:${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
docker build -f docker/fastapi-sidecar/Dockerfile -t ${FASTAPI_IMAGE} .
docker push ${FASTAPI_IMAGE}

# Create nginx configuration secret
echo -e "${BLUE}🔐 Creating nginx configuration secret...${NC}"
SECRET_NAME="nginx-sidecar-config"
if ! gcloud secrets describe ${SECRET_NAME} --project=${PROJECT_ID} >/dev/null 2>&1; then
    gcloud secrets create ${SECRET_NAME} --project=${PROJECT_ID}
fi

# Upload nginx configuration
gcloud secrets versions add ${SECRET_NAME} \
    --data-file=docker/nginx-sidecar/nginx.conf.template \
    --project=${PROJECT_ID}

# Update the service YAML with actual image URLs
sed -e "s|PROJECT_ID|${PROJECT_ID}|g" \
    -e "s|us-central1-docker.pkg.dev/PROJECT_ID/mattel-routing/nginx-proxy:latest|${NGINX_IMAGE}|g" \
    -e "s|us-central1-docker.pkg.dev/PROJECT_ID/mattel-routing/fastapi-app:latest|${FASTAPI_IMAGE}|g" \
    cloud-run-sidecar.yaml > /tmp/cloud-run-sidecar-${ENVIRONMENT}.yaml

# Deploy to Cloud Run
echo -e "${BLUE}🚀 Deploying to Cloud Run...${NC}"
gcloud run services replace /tmp/cloud-run-sidecar-${ENVIRONMENT}.yaml \
    --region=${REGION} \
    --project=${PROJECT_ID}

# Allow unauthenticated access (adjust as needed)
echo -e "${BLUE}🔓 Configuring access...${NC}"
gcloud run services add-iam-policy-binding ${SERVICE_NAME} \
    --member="allUsers" \
    --role="roles/run.invoker" \
    --region=${REGION} \
    --project=${PROJECT_ID}

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
    --region=${REGION} \
    --project=${PROJECT_ID} \
    --format="value(status.url)")

# Clean up temporary file
rm -f /tmp/cloud-run-sidecar-${ENVIRONMENT}.yaml

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Service URL: ${SERVICE_URL}${NC}"
echo -e "${GREEN}📊 Dashboard: https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}/metrics?project=${PROJECT_ID}${NC}"

# Test the deployment
echo -e "${BLUE}🧪 Testing deployment...${NC}"
if curl -f -s "${SERVICE_URL}/health" > /dev/null; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
else
    echo -e "${YELLOW}⚠️  Health check failed. Check the logs:${NC}"
    echo -e "${YELLOW}gcloud logs read --service=${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID}${NC}"
fi

echo -e "${GREEN}🎉 Sidecar deployment complete!${NC}" 