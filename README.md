# 🏨 Hotel Management System

A comprehensive hotel management system for managing reservations, clients, invoices, and more.

## 🚀 Features

- **🔐 Authentication & Authorization**: Secure login with role-based access control
- **🏠 Dashboard**: Overview of key metrics and upcoming reservations
- **📅 Reservation Management**: Create, view, edit, and delete reservations
- **👥 Client Management**: Track client information and history
- **💰 Financial Management**: Generate invoices and track payments
- **📊 Reporting**: Generate reports on revenue, occupancy, and more
- **👤 User Management**: Manage staff accounts and permissions
- **🔄 GRO Commission System**: Track and manage GRO commissions
- **💼 STOR Fund Management**: Manage STOR funds
- **📱 Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Next.js**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **Axios**: HTTP client
- **React Hook Form**: Form validation
- **date-fns**: Date utilities
- **Chart.js**: Data visualization

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type-safe JavaScript
- **Prisma**: ORM for database access
- **PostgreSQL**: Relational database
- **Redis**: Caching and session management
- **JWT**: Authentication
- **Zod**: Schema validation
- **Winston**: Logging

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy
- **GitHub Actions**: CI/CD

## 📋 Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+ (if running locally)
- Redis 7+ (if running locally)

## 🚀 Getting Started

### Development Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/hotel-management.git
   cd hotel-management
   \`\`\`

2. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Start development environment with Docker**
   \`\`\`bash
   docker-compose up
   \`\`\`

4. **Or start development environment without Docker**
   \`\`\`bash
   # Install dependencies
   cd backend && npm install
   cd ../frontend && npm install
   
   # Start backend
   cd backend && npm run dev
   
   # Start frontend (in another terminal)
   cd frontend && npm run dev
   \`\`\`

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - API Documentation: http://localhost:3001/api-docs

### Production Deployment

1. **Set up production environment variables**
   \`\`\`bash
   cp .env.example .env.prod
   # Edit .env.prod with your production configuration
   \`\`\`

2. **Run the deployment script**
   \`\`\`bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh latest .env.prod
   \`\`\`

3. **Or deploy manually**
   \`\`\`bash
   # Build images
   docker build -t hotel-backend:latest ./backend
   docker build -t hotel-frontend:latest ./frontend
   
   # Start services
   docker-compose -f docker-compose.prod.yml up -d
   
   # Run migrations
   docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
   \`\`\`

## 📁 Project Structure

\`\`\`
hotel-management/
├── backend/                # Backend API
│   ├── prisma/            # Database schema and migrations
│   ├── src/               # Source code
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # API controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── Dockerfile         # Backend Docker configuration
│   └── package.json       # Backend dependencies
├── frontend/              # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── public/            # Static assets
│   ├── styles/            # Global styles
│   ├── Dockerfile         # Frontend Docker configuration
│   └── package.json       # Frontend dependencies
├── database/              # Database scripts
│   └── migrations/        # SQL migration scripts
├── scripts/               # Utility scripts
├── docs/                  # Documentation
├── docker-compose.yml     # Development Docker Compose
└── docker-compose.prod.yml # Production Docker Compose
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run integration tests
npm run test:integration
\`\`\`

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 🔄 CI/CD

This project uses GitHub Actions for continuous integration and deployment. See [.github/workflows](./.github/workflows) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- [Your Name](https://github.com/yourusername)

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Next.js](https://nextjs.org/) for the frontend framework
- [Prisma](https://www.prisma.io/) for the ORM
- [Express](https://expressjs.com/) for the backend framework
\`\`\`

## 10. Integration Test Script

Mari buat script untuk menguji integrasi sistem:
