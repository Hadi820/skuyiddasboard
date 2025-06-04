#!/bin/bash

# Hotel Management System - Integrated Startup Script
# This script starts both backend and frontend with proper integration

set -e

echo "🏨 Starting Hotel Management System - Integrated Mode"
echo "=================================================="

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
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

print_status "Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
print_status "Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is ready
until docker-compose exec -T postgres pg_isready -U hotel_user -d hotel_management; do
    print_status "Waiting for PostgreSQL..."
    sleep 2
done

print_success "PostgreSQL is ready!"

# Setup backend
print_status "Setting up backend..."
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Push database schema
print_status "Pushing database schema..."
npx prisma db push

# Seed database
print_status "Seeding database with sample data..."
npx prisma db seed

print_success "Backend setup completed!"

# Start backend in background
print_status "Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
print_status "Waiting for backend to start..."
sleep 15

# Check if backend is running
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_success "Backend is running on http://localhost:3001"
else
    print_error "Backend failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Setup frontend
print_status "Setting up frontend..."
cd ../

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

# Start frontend
print_status "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
print_status "Waiting for frontend to start..."
sleep 10

# Check if frontend is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is running on http://localhost:3000"
else
    print_error "Frontend failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

print_success "🎉 Hotel Management System is now running!"
echo ""
echo "📊 Services Status:"
echo "  - Database (PostgreSQL): http://localhost:5432"
echo "  - Backend API: http://localhost:3001"
echo "  - Frontend: http://localhost:3000"
echo "  - Prisma Studio: Run 'npx prisma studio' in backend folder"
echo ""
echo "🔐 Default Login Credentials:"
echo "  - Admin: admin@hotel.com / admin123"
echo "  - Staff: staff@hotel.com / staff123"
echo ""
echo "📚 API Documentation:"
echo "  - Health Check: http://localhost:3001/health"
echo "  - API Base URL: http://localhost:3001/api"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    docker-compose down
    print_success "All services stopped."
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Wait for user to stop
wait
