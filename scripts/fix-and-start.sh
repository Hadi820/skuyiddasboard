#!/bin/bash

# Hotel Management System - Fix and Start Script
# This script fixes common issues and starts the application

set -e

echo "🔧 Hotel Management System - Fix and Start"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    print_status "Checking Docker..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if Docker Compose is available
check_docker_compose() {
    print_status "Checking Docker Compose..."
    if ! command -v docker-compose > /dev/null 2>&1; then
        if ! docker compose version > /dev/null 2>&1; then
            print_error "Docker Compose is not available"
            exit 1
        else
            DOCKER_COMPOSE_CMD="docker compose"
        fi
    else
        DOCKER_COMPOSE_CMD="docker-compose"
    fi
    print_success "Docker Compose is available"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p backend/uploads
    mkdir -p backend/logs
    mkdir -p database/init
    mkdir -p nginx/conf.d
    mkdir -p ssl
    
    print_success "Directories created"
}

# Setup environment files
setup_env_files() {
    print_status "Setting up environment files..."
    
    # Backend .env
    if [ ! -f backend/.env ]; then
        cp backend/.env.example backend/.env
        print_success "Backend .env file created"
    else
        print_warning "Backend .env file already exists"
    fi
    
    # Frontend .env.local
    if [ ! -f frontend/.env.local ]; then
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
        print_success "Frontend .env.local file created"
    else
        print_warning "Frontend .env.local file already exists"
    fi
}

# Fix file permissions
fix_permissions() {
    print_status "Fixing file permissions..."
    
    chmod +x scripts/*.sh 2>/dev/null || true
    chmod 755 backend/uploads 2>/dev/null || true
    chmod 755 backend/logs 2>/dev/null || true
    
    print_success "File permissions fixed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing backend dependencies..."
    
    cd backend
    if [ -f package.json ]; then
        npm install
        print_success "Backend dependencies installed"
    else
        print_error "Backend package.json not found"
        exit 1
    fi
    cd ..
    
    print_status "Installing frontend dependencies..."
    
    cd frontend
    if [ -f package.json ]; then
        npm install
        print_success "Frontend dependencies installed"
    else
        print_error "Frontend package.json not found"
        exit 1
    fi
    cd ..
}

# Start database services
start_database() {
    print_status "Starting database services..."
    
    $DOCKER_COMPOSE_CMD up -d postgres redis
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Check if database is healthy
    for i in {1..30}; do
        if $DOCKER_COMPOSE_CMD exec -T postgres pg_isready -U hotel_user -d hotel_management > /dev/null 2>&1; then
            print_success "Database is ready"
            break
        fi
        
        if [ $i -eq 30 ]; then
            print_error "Database failed to start"
            exit 1
        fi
        
        sleep 2
    done
}

# Setup database schema
setup_database() {
    print_status "Setting up database schema..."
    
    cd backend
    
    # Generate Prisma client
    npx prisma generate
    
    # Push schema to database
    npx prisma db push --force-reset
    
    # Seed database
    npx prisma db seed
    
    print_success "Database schema setup completed"
    cd ..
}

# Start all services
start_services() {
    print_status "Starting all services..."
    
    $DOCKER_COMPOSE_CMD up -d
    
    print_success "All services started"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for backend
    for i in {1..60}; do
        if curl -f http://localhost:3001/health > /dev/null 2>&1; then
            print_success "Backend is healthy"
            break
        fi
        
        if [ $i -eq 60 ]; then
            print_error "Backend failed to start"
            $DOCKER_COMPOSE_CMD logs backend
            exit 1
        fi
        
        sleep 2
    done
    
    # Wait for frontend
    for i in {1..60}; do
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            print_success "Frontend is healthy"
            break
        fi
        
        if [ $i -eq 60 ]; then
            print_error "Frontend failed to start"
            $DOCKER_COMPOSE_CMD logs frontend
            exit 1
        fi
        
        sleep 2
    done
}

# Show service status
show_status() {
    print_status "Service Status:"
    echo ""
    $DOCKER_COMPOSE_CMD ps
    echo ""
    
    print_success "🎉 Hotel Management System is ready!"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:3001"
    echo "🗄️  Database Admin: http://localhost:8080 (run with --profile tools)"
    echo ""
    echo "Default login credentials:"
    echo "Email: admin@hotel.com"
    echo "Password: admin123"
    echo ""
    echo "To stop all services: $DOCKER_COMPOSE_CMD down"
    echo "To view logs: $DOCKER_COMPOSE_CMD logs -f [service_name]"
}

# Main execution
main() {
    echo ""
    print_status "Starting Hotel Management System setup and deployment..."
    echo ""
    
    check_docker
    check_docker_compose
    create_directories
    setup_env_files
    fix_permissions
    install_dependencies
    start_database
    setup_database
    start_services
    wait_for_services
    show_status
}

# Run main function
main "$@"
