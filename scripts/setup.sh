#!/bin/bash

# Hotel Management System Setup Script with MongoDB
# This script sets up the development environment

set -e

echo "🏨 Hotel Management System Setup (MongoDB + Docker)"
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
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    print_success "Docker found: $(docker --version)"
    print_success "Node.js found: $(node --version)"
    print_success "npm found: $(npm --version)"
    print_success "System requirements check completed"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Root environment
    if [ ! -f ".env" ]; then
        cat > .env << 'EOF'
# Hotel Management System Environment
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://hotel_admin:hotel_password@localhost:27017/hotel_management?authSource=admin
MONGO_INITDB_ROOT_USERNAME=hotel_admin
MONGO_INITDB_ROOT_PASSWORD=hotel_password
MONGO_INITDB_DATABASE=hotel_management

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
API_PORT=3001

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
EOF
        print_success "Created root .env file"
    else
        print_warning "Root .env already exists"
    fi
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << 'EOF'
# Backend Environment
NODE_ENV=development
PORT=3001

# MongoDB
MONGODB_URI=mongodb://hotel_admin:hotel_password@localhost:27017/hotel_management?authSource=admin

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
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
    mkdir -p database/mongo-init
    mkdir -p nginx/conf.d
    mkdir -p ssl
    mkdir -p monitoring/prometheus
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    
    # Create log files
    touch logs/app.log
    touch logs/error.log
    touch logs/access.log
    
    print_success "Directories created"
}

# Setup MongoDB initialization script
setup_mongodb_init() {
    print_status "Setting up MongoDB initialization..."
    
    cat > database/mongo-init/01-init.js << 'EOF'
// MongoDB Initialization Script
print('Starting MongoDB initialization...');

// Switch to hotel_management database
db = db.getSiblingDB('hotel_management');

// Create collections with validation
db.createCollection('reservations', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['bookingCode', 'customerName', 'checkIn', 'checkOut', 'orderDetails', 'finalPrice', 'status'],
      properties: {
        bookingCode: {
          bsonType: 'string',
          description: 'Booking code must be a string and is required'
        },
        customerName: {
          bsonType: 'string',
          description: 'Customer name must be a string and is required'
        },
        checkIn: {
          bsonType: 'date',
          description: 'Check-in date must be a date and is required'
        },
        checkOut: {
          bsonType: 'date',
          description: 'Check-out date must be a date and is required'
        },
        orderDetails: {
          bsonType: 'string',
          description: 'Order details must be a string and is required'
        },
        finalPrice: {
          bsonType: 'number',
          minimum: 0,
          description: 'Final price must be a positive number and is required'
        },
        status: {
          bsonType: 'string',
          enum: ['Pending', 'Proses', 'Selesai', 'Batal'],
          description: 'Status must be one of the enum values and is required'
        }
      }
    }
  }
});

db.createCollection('clients', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Name must be a string and is required'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'Email must be a valid email format'
        },
        status: {
          bsonType: 'string',
          enum: ['Active', 'Inactive'],
          description: 'Status must be Active or Inactive'
        }
      }
    }
  }
});

// Create indexes
db.reservations.createIndex({ bookingCode: 1 }, { unique: true });
db.reservations.createIndex({ customerName: 1 });
db.reservations.createIndex({ gro: 1 });
db.reservations.createIndex({ status: 1 });
db.reservations.createIndex({ category: 1 });
db.reservations.createIndex({ checkIn: 1, checkOut: 1 });
db.reservations.createIndex({ createdAt: -1 });
db.reservations.createIndex({ finalPrice: -1 });

db.clients.createIndex({ name: 1 });
db.clients.createIndex({ email: 1 }, { sparse: true });
db.clients.createIndex({ phone: 1 });
db.clients.createIndex({ company: 1 });
db.clients.createIndex({ status: 1 });
db.clients.createIndex({ createdAt: -1 });

// Insert sample data
db.clients.insertMany([
  {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '081234567890',
    company: 'ABC Corp',
    status: 'Active',
    totalReservations: 0,
    totalRevenue: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '081234567891',
    company: 'XYZ Ltd',
    status: 'Active',
    totalReservations: 0,
    totalRevenue: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.reservations.insertMany([
  {
    bookingCode: 'BK-20250104-001',
    bookingDate: new Date(),
    customerName: 'John Doe',
    phoneNumber: '081234567890',
    checkIn: new Date('2025-01-15'),
    checkOut: new Date('2025-01-17'),
    orderDetails: 'Villa Utama - 2 Kamar',
    gro: 'ILPAN',
    category: 'Akomodasi',
    finalPrice: 5000000,
    customerDeposit: 2500000,
    basePrice: 4000000,
    status: 'Selesai',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    bookingCode: 'BK-20250104-002',
    bookingDate: new Date(),
    customerName: 'Jane Smith',
    phoneNumber: '081234567891',
    checkIn: new Date('2025-01-20'),
    checkOut: new Date('2025-01-22'),
    orderDetails: 'Paket Wisata Pantai',
    gro: 'JAMAL',
    category: 'Trip',
    finalPrice: 3000000,
    customerDeposit: 1500000,
    basePrice: 2500000,
    status: 'Proses',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    bookingCode: 'BK-20250104-003',
    bookingDate: new Date(),
    customerName: 'Bob Johnson',
    phoneNumber: '081234567892',
    checkIn: new Date('2025-01-25'),
    checkOut: new Date('2025-01-27'),
    orderDetails: 'Meeting Room + Catering',
    gro: 'BANG NUNG',
    category: 'Event',
    finalPrice: 2000000,
    customerDeposit: 1000000,
    basePrice: 1500000,
    status: 'Pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('MongoDB initialization completed successfully!');
EOF

    print_success "MongoDB initialization script created"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    print_success "Dependencies installation completed"
}

# Setup Docker containers
setup_docker() {
    print_status "Setting up Docker containers..."
    
    # Stop any existing containers
    docker-compose down 2>/dev/null || true
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose up -d mongodb redis
    
    # Wait for MongoDB to be ready
    print_status "Waiting for MongoDB to be ready..."
    sleep 15
    
    # Check if MongoDB is running
    if docker-compose ps mongodb | grep -q "Up"; then
        print_success "MongoDB is running"
    else
        print_error "MongoDB failed to start"
        docker-compose logs mongodb
        exit 1
    fi
    
    # Check if Redis is running
    if docker-compose ps redis | grep -q "Up"; then
        print_success "Redis is running"
    else
        print_error "Redis failed to start"
        docker-compose logs redis
        exit 1
    fi
    
    print_success "Database containers are running"
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
        if [ "$2" = "mongo" ]; then
            docker-compose exec mongodb mongosh -u hotel_admin -p hotel_password --authenticationDatabase admin hotel_management
        elif [ "$2" = "backend" ]; then
            docker-compose exec backend /bin/bash
        elif [ "$2" = "frontend" ]; then
            docker-compose exec frontend /bin/bash
        else
            echo "Usage: $0 shell [mongo|backend|frontend]"
        fi
        ;;
    "backup")
        mkdir -p backups
        docker-compose exec mongodb mongodump --uri="mongodb://hotel_admin:hotel_password@localhost:27017/hotel_management?authSource=admin" --out=/tmp/backup
        docker cp $(docker-compose ps -q mongodb):/tmp/backup ./backups/backup-$(date +%Y%m%d-%H%M%S)
        echo "Backup created in ./backups/"
        ;;
    "restore")
        if [ -z "$2" ]; then
            echo "Usage: $0 restore <backup-directory>"
            exit 1
        fi
        docker cp "$2" $(docker-compose ps -q mongodb):/tmp/restore
        docker-compose exec mongodb mongorestore --uri="mongodb://hotel_admin:hotel_password@localhost:27017/hotel_management?authSource=admin" /tmp/restore
        ;;
    *)
        echo "Hotel Management System - Development Tools"
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  logs [service]     - View logs for all services or specific service"
        echo "  restart [service]  - Restart all services or specific service"
        echo "  shell [service]    - Open shell in service (mongo|backend|frontend)"
        echo "  backup            - Create database backup"
        echo "  restore <dir>     - Restore database from backup"
        ;;
esac
EOF
    chmod +x scripts/dev.sh
    
    print_success "Development tools setup completed"
}

# Main setup function
main() {
    echo
    print_status "Starting Hotel Management System setup with MongoDB and Docker..."
    echo
    
    check_requirements
    echo
    
    setup_environment
    echo
    
    create_directories
    echo
    
    setup_mongodb_init
    echo
    
    install_dependencies
    echo
    
    setup_docker
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
    echo "   • Mongo Express:   http://localhost:8081 (admin/admin123)"
    echo
    echo "🗄️  Database Information:"
    echo "   • MongoDB:         mongodb://localhost:27017"
    echo "   • Database:        hotel_management"
    echo "   • Username:        hotel_admin"
    echo "   • Password:        hotel_password"
    echo
    echo "🛠️  Development Commands:"
    echo "   • View logs:       ./scripts/dev.sh logs"
    echo "   • Restart:         ./scripts/dev.sh restart"
    echo "   • MongoDB shell:   ./scripts/dev.sh shell mongo"
    echo "   • Backup DB:       ./scripts/dev.sh backup"
    echo "   • Stop all:        docker-compose down"
    echo
    echo "🔧 Management Tools:"
    echo "   • Start tools:     docker-compose --profile tools up -d"
    echo "   • Monitoring:      docker-compose --profile monitoring up -d"
    echo
    print_success "Happy coding! 🚀"
}

# Handle script arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "docker")
        setup_docker
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
        rm -rf node_modules
        rm -rf logs/*
        print_success "Cleanup completed"
        ;;
    "help")
        echo "Hotel Management System Setup Script (MongoDB + Docker)"
        echo
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "  setup     - Full setup (default)"
        echo "  docker    - Setup Docker containers only"
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
