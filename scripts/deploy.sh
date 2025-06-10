#!/bin/bash
# Hotel Management System Deployment Script

set -e

# Configuration
VERSION=${1:-latest}
ENV_FILE=${2:-.env.prod}
DOCKER_REGISTRY=${3:-""}

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Hotel Management System Deployment${NC}"
echo -e "${GREEN}==================================================${NC}"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ Environment file $ENV_FILE not found${NC}"
  exit 1
fi

# Load environment variables
echo -e "${YELLOW}📋 Loading environment variables from $ENV_FILE${NC}"
export $(grep -v '^#' $ENV_FILE | xargs)

# Check required environment variables
REQUIRED_VARS=("POSTGRES_PASSWORD" "REDIS_PASSWORD" "JWT_SECRET" "JWT_REFRESH_SECRET" "FRONTEND_URL" "NEXT_PUBLIC_API_URL")
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${RED}❌ Required environment variable $var is not set${NC}"
    exit 1
  fi
done

# Export variables for docker-compose
export VERSION=$VERSION
export DOCKER_REGISTRY=$DOCKER_REGISTRY

# Build images
echo -e "${YELLOW}🏗️ Building Docker images${NC}"

# Backend
echo -e "${YELLOW}Building backend image...${NC}"
docker build -t ${DOCKER_REGISTRY}hotel-backend:$VERSION ./backend

# Frontend
echo -e "${YELLOW}Building frontend image...${NC}"
docker build -t ${DOCKER_REGISTRY}hotel-frontend:$VERSION ./frontend

# Push images if registry is provided
if [ ! -z "$DOCKER_REGISTRY" ]; then
  echo -e "${YELLOW}📤 Pushing images to registry${NC}"
  docker push ${DOCKER_REGISTRY}hotel-backend:$VERSION
  docker push ${DOCKER_REGISTRY}hotel-frontend:$VERSION
fi

# Create necessary directories
echo -e "${YELLOW}📁 Creating necessary directories${NC}"
mkdir -p ./nginx/conf.d
mkdir -p ./nginx/ssl
mkdir -p ./nginx/logs

# Create nginx configuration if it doesn't exist
if [ ! -f "./nginx/conf.d/default.conf" ]; then
  echo -e "${YELLOW}📝 Creating nginx configuration${NC}"
  cat > ./nginx/conf.d/default.conf << EOF
server {
    listen 80;
    server_name localhost;
    
    # Redirect to HTTPS if SSL is configured
    # return 301 https://\$host\$request_uri;
    
    # API routes
    location /api/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # File uploads
    location /uploads/ {
        alias /var/www/uploads/;
        expires 1d;
        add_header Cache-Control "public, max-age=86400";
    }
    
    # Frontend routes
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
fi

# Deploy with docker-compose
echo -e "${YELLOW}🚀 Deploying with docker-compose${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Run database migrations
echo -e "${YELLOW}🗄️ Running database migrations${NC}"
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Health check
echo -e "${YELLOW}🏥 Performing health check...${NC}"
for i in {1..12}; do
  if curl -s http://localhost/api/health | grep -q "ok"; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
    break
  fi
  
  if [ $i -eq 12 ]; then
    echo -e "${RED}❌ Health check failed after multiple attempts${NC}"
    echo -e "${YELLOW}📋 Checking container logs:${NC}"
    docker-compose -f docker-compose.prod.yml logs --tail=50 backend
    exit 1
  fi
  
  echo -e "${YELLOW}⏳ Waiting for services to be ready (attempt $i/12)...${NC}"
  sleep 5
done

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Application is available at: http://localhost${NC}"
echo -e "${GREEN}==================================================${NC}"
