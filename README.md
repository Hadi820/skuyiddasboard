# 🏨 Hotel Management System

Sistem manajemen hotel yang komprehensif untuk mengelola reservasi, klien, keuangan, dan kinerja staff.

## 🚀 Fitur Utama

- **Dashboard**: Overview kinerja dan statistik
- **Manajemen Reservasi**: CRUD reservasi hotel
- **Manajemen Klien**: Database klien dan riwayat
- **KPI Admin Staff**: Tracking performa GRO
- **Sistem Keuangan**: Invoice dan laporan keuangan
- **Authentication**: Login dengan role-based access

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

## 🚀 Quick Start

1. **Clone repository**
   \`\`\`bash
   git clone <repository-url>
   cd hotel-management-system
   \`\`\`

2. **Start dengan Docker**
   \`\`\`bash
   docker-compose up
   \`\`\`

3. **Akses aplikasi**
   - Frontend: http://localhost:3000
   - Database: PostgreSQL di port 5432

## 📁 Struktur Project

\`\`\`
hotel-management-system/
├── app/                    # Next.js pages
├── components/             # React components
├── lib/                    # Utilities
├── services/               # Business logic
├── docker-compose.yml      # Docker configuration
└── package.json           # Dependencies
\`\`\`

## 🔐 Default Login

- Email: admin@hotel.com
- Password: admin123

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

MIT License
\`\`\`

## 👥 Contributors

- [Your Name](https://github.com/yourusername)

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Next.js](https://nextjs.org/) for the frontend framework
- [Prisma](https://www.prisma.io/) for the ORM
- [Express](https://expressjs.com/) for the backend framework
