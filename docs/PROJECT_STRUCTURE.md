# Hotel Management System - Project Structure

## 📁 Struktur Folder Lengkap

\`\`\`
hotel-management-system/
├── 📁 backend/                     # Backend Services
│   ├── 📁 src/
│   │   ├── 📁 controllers/         # API Controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── reservation.controller.ts
│   │   │   ├── client.controller.ts
│   │   │   ├── gro.controller.ts
│   │   │   └── financial.controller.ts
│   │   ├── 📁 services/            # Business Logic
│   │   │   ├── auth.service.ts
│   │   │   ├── reservation.service.ts
│   │   │   ├── client.service.ts
│   │   │   ├── gro.service.ts
│   │   │   └── financial.service.ts
│   │   ├── 📁 models/              # Data Models
│   │   │   ├── user.model.ts
│   │   │   ├── reservation.model.ts
│   │   │   ├── client.model.ts
│   │   │   └── financial.model.ts
│   │   ├── 📁 middleware/          # Express Middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── 📁 routes/              # API Routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── reservation.routes.ts
│   │   │   ├── client.routes.ts
│   │   │   ├── gro.routes.ts
│   │   │   └── financial.routes.ts
│   │   ├── 📁 utils/               # Utilities
│   │   │   ├── database.ts
│   │   │   ├── jwt.ts
│   │   │   ├── validation.ts
│   │   │   └── logger.ts
│   │   ├── 📁 config/              # Configuration
│   │   │   ├── database.config.ts
│   │   │   ├── app.config.ts
│   │   │   └── env.config.ts
│   │   └── app.ts                  # Express App Entry
│   ├── 📁 tests/                   # Backend Tests
│   │   ├── 📁 unit/
│   │   ├── 📁 integration/
│   │   └── 📁 e2e/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── 📁 frontend/                    # Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 app/                 # Next.js App Router
│   │   │   ├── 📁 (auth)/
│   │   │   │   ├── 📁 login/
│   │   │   │   └── 📁 register/
│   │   │   ├── 📁 (dashboard)/
│   │   │   │   ├── 📁 dashboard/
│   │   │   │   ├── 📁 reservations/
│   │   │   │   ├── 📁 clients/
│   │   │   │   ├── 📁 gro/
│   │   │   │   ├── 📁 financial/
│   │   │   │   └── 📁 settings/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── 📁 components/          # React Components
│   │   │   ├── 📁 ui/              # Base UI Components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   └── ...
│   │   │   ├── 📁 layout/          # Layout Components
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── header.tsx
│   │   │   │   └── footer.tsx
│   │   │   ├── 📁 dashboard/       # Dashboard Components
│   │   │   │   ├── gro-dashboard.tsx
│   │   │   │   ├── revenue-chart.tsx
│   │   │   │   └── kpi-cards.tsx
│   │   │   ├── 📁 reservations/    # Reservation Components
│   │   │   │   ├── reservation-form.tsx
│   │   │   │   ├── reservation-table.tsx
│   │   │   │   └── reservation-detail.tsx
│   │   │   ├── 📁 clients/         # Client Components
│   │   │   │   ├── client-form.tsx
│   │   │   │   └── client-list.tsx
│   │   │   └── 📁 financial/       # Financial Components
│   │   │       ├── invoice-form.tsx
│   │   │       └── financial-dashboard.tsx
│   │   ├── 📁 lib/                 # Frontend Libraries
│   │   │   ├── api.ts              # API Client
│   │   │   ├── auth.ts             # Auth Utils
│   │   │   ├── utils.ts            # General Utils
│   │   │   └── validations.ts      # Form Validations
│   │   ├── 📁 hooks/               # Custom React Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useReservations.ts
│   │   │   └── useClients.ts
│   │   ├── 📁 types/               # TypeScript Types
│   │   │   ├── auth.types.ts
│   │   │   ├── reservation.types.ts
│   │   │   ├── client.types.ts
│   │   │   └── api.types.ts
│   │   └── 📁 store/               # State Management
│   │       ├── auth.store.ts
│   │       ├── reservation.store.ts
│   │       └── client.store.ts
│   ├── 📁 public/                  # Static Assets
│   │   ├── 📁 images/
│   │   ├── 📁 icons/
│   │   └── favicon.ico
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── 📁 database/                    # Database Layer
│   ├── 📁 migrations/              # Database Migrations
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_reservations_table.sql
│   │   ├── 003_create_clients_table.sql
│   │   └── 004_create_financial_table.sql
│   ├── 📁 seeds/                   # Database Seeds
│   │   ├── users.seed.sql
│   │   ├── reservations.seed.sql
│   │   └── clients.seed.sql
│   ├── 📁 schemas/                 # Database Schemas
│   │   ├── users.schema.sql
│   │   ├── reservations.schema.sql
│   │   ├── clients.schema.sql
│   │   └── financial.schema.sql
│   ├── 📁 procedures/              # Stored Procedures
│   │   ├── reservation_analytics.sql
│   │   └── gro_performance.sql
│   ├── 📁 views/                   # Database Views
│   │   ├── reservation_summary.sql
│   │   └── gro_dashboard.sql
│   └── database.config.json
├── 📁 api/                         # REST API Documentation
│   ├── 📁 docs/                    # API Documentation
│   │   ├── auth.api.md
│   │   ├── reservations.api.md
│   │   ├── clients.api.md
│   │   ├── gro.api.md
│   │   └── financial.api.md
│   ├── 📁 postman/                 # Postman Collections
│   │   ├── auth.postman.json
│   │   ├── reservations.postman.json
│   │   └── clients.postman.json
│   ├── 📁 swagger/                 # Swagger/OpenAPI
│   │   ├── swagger.yaml
│   │   └── swagger.json
│   └── api-reference.md
├── 📁 shared/                      # Shared Code
│   ├── 📁 types/                   # Shared TypeScript Types
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   └── database.types.ts
│   ├── 📁 constants/               # Shared Constants
│   │   ├── status.constants.ts
│   │   ├── roles.constants.ts
│   │   └── api.constants.ts
│   ├── 📁 utils/                   # Shared Utilities
│   │   ├── date.utils.ts
│   │   ├── format.utils.ts
│   │   └── validation.utils.ts
│   └── 📁 enums/                   # Shared Enums
│       ├── user-roles.enum.ts
│       ├── reservation-status.enum.ts
│       └── payment-status.enum.ts
├── 📁 docs/                        # Project Documentation
│   ├── README.md
│   ├── SETUP.md
│   ├── API_GUIDE.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   └── ARCHITECTURE.md
├── 📁 scripts/                     # Build & Deploy Scripts
│   ├── build.sh
│   ├── deploy.sh
│   ├── migrate.sh
│   └── seed.sh
├── 📁 docker/                      # Docker Configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
├── 📁 tests/                       # Integration Tests
│   ├── 📁 api/
│   ├── 📁 e2e/
│   └── 📁 performance/
├── .gitignore
├── .env.example
├── package.json                    # Root package.json
├── README.md
└── LICENSE
\`\`\`

## 🏗️ Arsitektur Sistem

### 1. **Backend Layer** (`/backend`)
- **Express.js** server dengan TypeScript
- **RESTful API** endpoints
- **Business logic** dalam services
- **Data validation** dan middleware
- **Authentication & Authorization**

### 2. **Frontend Layer** (`/frontend`)
- **Next.js 14** dengan App Router
- **React 18** dengan TypeScript
- **Tailwind CSS** untuk styling
- **shadcn/ui** untuk komponen
- **State management** dengan Zustand/Redux

### 3. **Database Layer** (`/database`)
- **PostgreSQL** sebagai primary database
- **Migrations** untuk schema management
- **Seeds** untuk data awal
- **Views & Procedures** untuk optimasi

### 4. **API Documentation** (`/api`)
- **OpenAPI/Swagger** specification
- **Postman** collections
- **API documentation** dalam Markdown

### 5. **Shared Code** (`/shared`)
- **TypeScript types** yang digunakan bersama
- **Constants** dan **enums**
- **Utility functions**

## 🔄 Data Flow

\`\`\`
Frontend (Next.js) 
    ↕️ HTTP/REST API
Backend (Express.js)
    ↕️ SQL Queries
Database (PostgreSQL)
\`\`\`

## 🚀 Development Workflow

1. **Database First**: Buat schema dan migrations
2. **Backend Development**: Implement API endpoints
3. **Frontend Development**: Consume API dan build UI
4. **Testing**: Unit, integration, dan E2E tests
5. **Documentation**: Update API docs dan README

## 📦 Package Management

### Root Level
\`\`\`json
{
  "name": "hotel-management-system",
  "workspaces": ["backend", "frontend"],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "test": "npm run test:backend && npm run test:frontend"
  }
}
\`\`\`

### Backend Package
\`\`\`json
{
  "name": "hotel-backend",
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "migrate": "node scripts/migrate.js"
  }
}
\`\`\`

### Frontend Package
\`\`\`json
{
  "name": "hotel-frontend",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "lint": "next lint"
  }
}
\`\`\`

## 🐳 Docker Configuration

### Development
\`\`\`yaml
# docker-compose.yml
version: '3.8'
services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: hotel_management
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
  
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    depends_on:
      - database
  
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend
\`\`\`

## 🔧 Environment Configuration

### Backend (.env)
\`\`\`env
# Database
DATABASE_URL=postgresql://admin:password@localhost:5432/hotel_management
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=hotel_management
DATABASE_USER=admin
DATABASE_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
\`\`\`

### Frontend (.env.local)
\`\`\`env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
\`\`\`

## 📋 Setup Instructions

1. **Clone Repository**
   \`\`\`bash
   git clone <repository-url>
   cd hotel-management-system
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   \`\`\`

3. **Setup Database**
   \`\`\`bash
   # Start PostgreSQL with Docker
   docker-compose up database -d
   
   # Run migrations
   cd backend && npm run migrate
   
   # Seed data
   npm run seed
   \`\`\`

4. **Start Development**
   \`\`\`bash
   # From root directory
   npm run dev
   \`\`\`

5. **Access Applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/docs

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Services dan utilities
- **Integration Tests**: API endpoints
- **Database Tests**: Models dan queries

### Frontend Testing
- **Component Tests**: React components
- **Integration Tests**: Page interactions
- **E2E Tests**: User workflows

### API Testing
- **Postman Collections**: Manual testing
- **Automated Tests**: CI/CD pipeline
- **Load Testing**: Performance validation

## 🚀 Deployment

### Production Environment
\`\`\`bash
# Build applications
npm run build

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d

# Or deploy separately
# Backend to Railway/Heroku
# Frontend to Vercel/Netlify
# Database to Supabase/PlanetScale
\`\`\`

Struktur folder ini memberikan:
- ✅ **Separation of Concerns** yang jelas
- ✅ **Scalability** untuk pertumbuhan proyek
- ✅ **Maintainability** yang mudah
- ✅ **Developer Experience** yang baik
- ✅ **Production Ready** architecture
