#!/bin/bash

# Hotel Management System Setup Script with PostgreSQL
# This script sets up the development environment with PostgreSQL and Prisma

set -e

echo "🏨 Hotel Management System Setup (PostgreSQL + Prisma)"
echo "====================================================="

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Docker found: $(docker --version)"
    print_success "Node.js found: $(node --version)"
    print_success "System requirements check completed"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << 'EOF'
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# PostgreSQL Database Configuration
DATABASE_URL="postgresql://hotel_user:hotel_password@localhost:5432/hotel_management?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Logging Configuration
LOG_LEVEL=info
LOG_DIR=./logs

# Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Security
BCRYPT_ROUNDS=12

# API Documentation
API_DOCS_ENABLED=true
API_DOCS_PATH=/docs
EOF
        print_success "Created backend/.env"
    else
        print_warning "backend/.env already exists"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env.local" ]; then
        cat > frontend/.env.local << 'EOF'
# Frontend Environment
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Development
NEXT_PUBLIC_DEV_MODE=true
EOF
        print_success "Created frontend/.env.local"
    else
        print_warning "frontend/.env.local already exists"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p uploads
    mkdir -p backups
    mkdir -p temp
    mkdir -p backend/prisma/migrations
    mkdir -p nginx/conf.d
    mkdir -p ssl
    
    # Create log files
    touch logs/app.log
    touch logs/error.log
    touch logs/access.log
    
    print_success "Directories created"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install backend dependencies
    cd backend
    npm install
    cd ..
    
    print_success "Dependencies installation completed"
}

# Setup PostgreSQL with Docker
setup_postgresql() {
    print_status "Setting up PostgreSQL with Docker..."
    
    # Stop any existing containers
    docker-compose down 2>/dev/null || true
    
    # Start PostgreSQL
    print_status "Starting PostgreSQL container..."
    docker-compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 15
    
    # Check if PostgreSQL is running
    if docker-compose ps postgres | grep -q "Up"; then
        print_success "PostgreSQL is running"
    else
        print_error "PostgreSQL failed to start"
        docker-compose logs postgres
        exit 1
    fi
    
    print_success "PostgreSQL setup completed"
}

# Setup Prisma
setup_prisma() {
    print_status "Setting up Prisma..."
    
    cd backend
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Push database schema
    print_status "Pushing database schema..."
    npx prisma db push
    
    # Seed database
    print_status "Seeding database..."
    npx prisma db seed
    
    cd ..
    
    print_success "Prisma setup completed"
}

# Build and start application
start_application() {
    print_status "Building and starting application..."
    
    # Build and start backend and frontend
    docker-compose up -d backend frontend
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 20
    
    # Check backend health
    for i in {1..30}; do
        if curl -f http://localhost:3001/health >/dev/null 2>&1; then
            print_success "Backend is healthy"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Backend health check failed"
            docker-compose logs backend
            exit 1
        fi
        sleep 2
    done
    
    # Check frontend health
    for i in {1..30}; do
        if curl -f http://localhost:3000 >/dev/null 2>&1; then
            print_success "Frontend is healthy"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Frontend health check failed"
            docker-compose logs frontend
            exit 1
        fi
        sleep 2
    done
    
    print_success "Application is running successfully"
}

# Setup development tools
setup_dev_tools() {
    print_status "Setting up development tools..."
    
    # Create useful scripts
    cat > scripts/dev.sh << 'EOF'
#!/bin/bash
# Development helper script

case "$1" in
    "logs")
        docker-compose logs -f ${2:-}
        ;;
    "restart")
        docker-compose restart ${2:-}
        ;;
    "shell")
        if [ "$2" = "postgres" ]; then
            docker-compose exec postgres psql -U hotel_user -d hotel_management
        elif [ "$2" = "backend" ]; then
            docker-compose exec backend /bin/bash
        elif [ "$2" = "frontend" ]; then
            docker-compose exec frontend /bin/bash
        else
            echo "Usage: $0 shell [postgres|backend|frontend]"
        fi
        ;;
    "prisma")
        cd backend
        case "$2" in
            "studio")
                npx prisma studio
                ;;
            "migrate")
                npx prisma migrate dev
                ;;
            "generate")
                npx prisma generate
                ;;
            "seed")
                npx prisma db seed
                ;;
            "reset")
                npx prisma migrate reset
                ;;
            *)
                echo "Usage: $0 prisma [studio|migrate|generate|seed|reset]"
                ;;
        esac
        cd ..
        ;;
    "backup")
        mkdir -p backups
        docker-compose exec postgres pg_dump -U hotel_user hotel_management > backups/backup-$(date +%Y%m%d-%H%M%S).sql
        echo "Backup created in ./backups/"
        ;;
    "restore")
        if [ -z "$2" ]; then
            echo "Usage: $0 restore <backup-file>"
            exit 1
        fi
        docker-compose exec -T postgres psql -U hotel_user -d hotel_management < "$2"
        ;;
    *)
        echo "Hotel Management System - Development Tools (PostgreSQL)"
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  logs [service]     - View logs for all services or specific service"
        echo "  restart [service]  - Restart all services or specific service"
        echo "  shell [service]    - Open shell in service (postgres|backend|frontend)"
        echo "  prisma [action]    - Prisma commands (studio|migrate|generate|seed|reset)"
        echo "  backup            - Create database backup"
        echo "  restore <file>    - Restore database from backup"
        ;;
esac
EOF
    chmod +x scripts/dev.sh
    
    print_success "Development tools setup completed"
}

# Main setup function
main() {
    echo
    print_status "Starting Hotel Management System setup with PostgreSQL..."
    echo
    
    check_requirements
    echo
    
    setup_environment
    echo
    
    create_directories
    echo
    
    install_dependencies
    echo
    
    setup_postgresql
    echo
    
    setup_prisma
    echo
    
    start_application
    echo
    
    setup_dev_tools
    echo
    
    print_success "🎉 Setup completed successfully!"
    echo
    echo "🏨 Hotel Management System is now running!"
    echo "========================================"
    echo
    echo "📱 Application URLs:"
    echo "   • Frontend:        http://localhost:3000"
    echo "   • Backend API:     http://localhost:3001"
    echo "   • API Health:      http://localhost:3001/health"
    echo "   • Prisma Studio:   npx prisma studio (from backend folder)"
    echo "   • pgAdmin:         http://localhost:8080 (admin@hotel.com/admin123)"
    echo
    echo "🗄️  Database Information:"
    echo "   • PostgreSQL:      postgresql://localhost:5432"
    echo "   • Database:        hotel_management"
    echo "   • Username:        hotel_user"
    echo "   • Password:        hotel_password"
    echo
    echo "🛠️  Development Commands:"
    echo "   • View logs:       ./scripts/dev.sh logs"
    echo "   • Restart:         ./scripts/dev.sh restart"
    echo "   • PostgreSQL shell: ./scripts/dev.sh shell postgres"
    echo "   • Prisma Studio:   ./scripts/dev.sh prisma studio"
    echo "   • Database migrate: ./scripts/dev.sh prisma migrate"
    echo "   • Backup DB:       ./scripts/dev.sh backup"
    echo "   • Stop all:        docker-compose down"
    echo
    echo "🔧 Management Tools:"
    echo "   • Start pgAdmin:   docker-compose --profile tools up -d"
    echo "   • Prisma commands: cd backend && npx prisma [command]"
    echo
    echo "👥 Default Users:"
    echo "   • Admin:           admin@hotel.com / admin123"
    echo "   • GRO ILPAN:       ilpan@hotel.com / ilpan123"
    echo "   • GRO JAMAL:       jamal@hotel.com / jamal123"
    echo "   • GRO BANG NUNG:   bangnung@hotel.com / bangnung123"
    echo
    print_success "Happy coding! 🚀"
}

# Handle script arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "postgres")
        setup_postgresql
        ;;
    "prisma")
        setup_prisma
        ;;
    "deps")
        install_dependencies
        ;;
    "env")
        setup_environment
        ;;
    "start")
        start_application
        ;;
    "clean")
        print_status "Cleaning up..."
        docker-compose down -v
        docker system prune -f
        rm -rf backend/node_modules
        rm -rf logs/*
        print_success "Cleanup completed"
        ;;
    "help")
        echo "Hotel Management System Setup Script (PostgreSQL + Prisma)"
        echo
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "  setup     - Full setup (default)"
        echo "  postgres  - Setup PostgreSQL only"
        echo "  prisma    - Setup Prisma only"
        echo "  deps      - Install dependencies only"
        echo "  env       - Setup environment files only"
        echo "  start     - Start application containers"
        echo "  clean     - Clean up containers and files"
        echo "  help      - Show this help message"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for available commands"
        exit 1
        ;;
esac
