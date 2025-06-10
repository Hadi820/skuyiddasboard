# Hotel Management System - Frontend

Frontend aplikasi Hotel Management System yang dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Setup environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` dan sesuaikan dengan konfigurasi backend Anda.

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

   Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── dashboard/         # Dashboard pages
│   ├── clients/           # Client management
│   ├── keuangan/          # Financial management
│   ├── calendar/          # Calendar view
│   └── settings/          # Settings pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── data/                 # Static data and types
├── hooks/                # Custom React hooks
├── services/             # API services
├── types/                # TypeScript types
├── utils/                # Utility functions
└── public/               # Static assets
\`\`\`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript check

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks + Context
- **Forms**: React Hook Form
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | `http://localhost:3000` |

### Tailwind CSS

Konfigurasi Tailwind CSS dapat ditemukan di `tailwind.config.ts`. Tema dan warna dapat disesuaikan sesuai kebutuhan.

## 📱 Features

- **Dashboard**: Overview reservasi dan keuangan
- **Reservasi**: Manajemen booking hotel
- **Klien**: Database klien dan riwayat
- **Keuangan**: Invoice, expense, dan laporan
- **KPI**: Tracking performa admin staff
- **Calendar**: View kalender reservasi
- **Export**: PDF dan Excel export
- **Authentication**: Login dan role management

## 🔐 Authentication

Sistem menggunakan JWT token untuk authentication:
- Access token (15 menit)
- Refresh token (7 hari)
- Role-based access control

## 📊 Data Management

- **Local Storage**: Untuk data sementara
- **API Integration**: Komunikasi dengan backend
- **State Management**: React Context untuk global state
- **Caching**: Optimistic updates dan caching

## 🚀 Deployment

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm run start
\`\`\`

### Docker
\`\`\`bash
docker build -t hotel-frontend .
docker run -p 3000:3000 hotel-frontend
\`\`\`

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details
\`\`\`

Sekarang mari buat Dockerfile khusus untuk frontend:
