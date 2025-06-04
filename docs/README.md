# Hotel Management System - Dashboard

Sistem manajemen hotel yang komprehensif dengan fokus pada pengelolaan reservasi dan analisis kinerja Admin Staff (GRO - Guest Relations Officer).

## 🏨 Fitur Utama

### 1. Dashboard Admin Staff
- **Tampilan Kartu**: Visualisasi kinerja setiap Admin Staff dalam bentuk kartu yang informatif
- **Tampilan Tabel**: Overview lengkap semua Admin Staff dengan statistik kinerja
- **Detail Reservasi**: Akses cepat ke detail setiap reservasi yang ditangani
- **Analisis Kinerja**: Perhitungan otomatis total pendapatan dan rata-rata per reservasi

### 2. Manajemen Reservasi
- **CRUD Operations**: Create, Read, Update, Delete reservasi
- **Filter & Search**: Pencarian berdasarkan status, kategori, tanggal, dan kata kunci
- **Persistensi Data**: Penyimpanan otomatis ke localStorage
- **Real-time Updates**: Update data secara real-time

### 3. Sistem Autentikasi
- **Role-based Access**: Kontrol akses berdasarkan peran pengguna
- **Middleware Protection**: Proteksi route dengan middleware
- **Session Management**: Manajemen sesi pengguna

## 🚀 Teknologi yang Digunakan

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Hooks
- **Data Storage**: localStorage (client-side)
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 📁 Struktur Proyek

\`\`\`
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard pages
│   ├── login/                   # Authentication pages
│   ├── calendar/                # Calendar management
│   ├── clients/                 # Client management
│   ├── keuangan/               # Financial management
│   └── settings/               # System settings
├── components/                  # React components
│   ├── ui/                     # Base UI components
│   ├── gro-dashboard.tsx       # GRO performance dashboard
│   ├── reservation-*.tsx       # Reservation components
│   └── financial-*.tsx         # Financial components
├── services/                   # Business logic services
│   ├── reservation-service.ts  # Reservation operations
│   ├── auth-service.ts         # Authentication logic
│   └── storage-service.ts      # Data persistence
├── data/                       # Static data files
├── types/                      # TypeScript type definitions
└── docs/                       # Documentation
\`\`\`

## 🔧 Instalasi dan Setup

1. **Clone repository**
   \`\`\`bash
   git clone [repository-url]
   cd hotel-management-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

## 📖 Panduan Penggunaan

### Dashboard Admin Staff

1. **Akses Dashboard**
   - Login dengan kredensial yang valid
   - Navigasi ke menu "Dashboard"

2. **Melihat Kinerja Admin Staff**
   - **Tampilan Kartu**: Lihat ringkasan kinerja setiap Admin Staff
   - **Tampilan Tabel**: Bandingkan kinerja semua Admin Staff

3. **Analisis Detail**
   - Klik "Lihat Reservasi" untuk melihat daftar reservasi per Admin Staff
   - Klik "Detail" untuk melihat informasi lengkap reservasi

### Manajemen Reservasi

1. **Menambah Reservasi Baru**
   \`\`\`typescript
   import { addReservation } from '@/services/reservation-service'
   
   const newReservation = {
     customerName: "John Doe",
     phoneNumber: "081234567890",
     checkIn: "2024-01-15",
     checkOut: "2024-01-17",
     // ... data lainnya
   }
   
   const result = addReservation(newReservation)
   \`\`\`

2. **Filter Reservasi**
   \`\`\`typescript
   import { getFilteredReservations } from '@/services/reservation-service'
   
   const filteredData = getFilteredReservations({
     status: "Selesai",
     gro: "Admin Staff 1",
     searchTerm: "john"
   })
   \`\`\`

3. **Update Reservasi**
   \`\`\`typescript
   import { updateReservation } from '@/services/reservation-service'
   
   const updated = updateReservation(reservationId, {
     status: "Selesai"
   })
   \`\`\`

## 🔐 Sistem Autentikasi

### Role-based Access Control

\`\`\`typescript
// Definisi roles
type UserRole = 'admin' | 'staff' | 'client'

// Contoh penggunaan
const user = {
  id: 1,
  username: "admin",
  role: "admin" as UserRole
}
\`\`\`

### Protected Routes

\`\`\`typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Logika proteksi route
  const isAuthenticated = checkAuth(request)
  
  if (!isAuthenticated) {
    return NextResponse.redirect('/login')
  }
}
\`\`\`

## 📊 API Reference

### Reservation Service

#### `getAllReservations()`
Mendapatkan semua data reservasi.

**Returns:** `Reservation[]`

#### `getReservationById(id: number)`
Mendapatkan reservasi berdasarkan ID.

**Parameters:**
- `id` (number): ID reservasi

**Returns:** `Reservation | undefined`

#### `addReservation(reservation: Omit<Reservation, "id">)`
Menambahkan reservasi baru.

**Parameters:**
- `reservation`: Data reservasi tanpa ID

**Returns:** `Reservation`

#### `updateReservation(id: number, reservation: Partial<Reservation>)`
Memperbarui data reservasi.

**Parameters:**
- `id` (number): ID reservasi
- `reservation`: Data yang akan diperbarui

**Returns:** `Reservation | null`

#### `deleteReservation(id: number)`
Menghapus reservasi.

**Parameters:**
- `id` (number): ID reservasi

**Returns:** `boolean`

#### `getFilteredReservations(filters: ReservationFilters)`
Mendapatkan reservasi berdasarkan filter.

**Parameters:**
- `filters`: Object berisi kriteria filter

**Returns:** `Reservation[]`

#### `getGroSummary()`
Mendapatkan ringkasan kinerja semua Admin Staff.

**Returns:** `GroSummaryData[]`

## 🎨 Komponen UI

### GroDashboard Component

Komponen utama untuk menampilkan dashboard Admin Staff.

**Props:** Tidak ada props yang diperlukan

**Features:**
- Tampilan kartu dan tabel
- Dialog untuk detail reservasi
- Real-time data updates
- Responsive design

**Usage:**
\`\`\`tsx
import { GroDashboard } from '@/components/gro-dashboard'

function DashboardPage() {
  return <GroDashboard />
}
\`\`\`

### ReservationDetail Component

Komponen untuk menampilkan detail reservasi.

**Props:**
- `reservation` (Reservation): Data reservasi yang akan ditampilkan

## 🔄 Data Flow

1. **Data Loading**: Data dimuat dari localStorage saat aplikasi start
2. **State Management**: React hooks mengelola state komponen
3. **User Interaction**: User berinteraksi dengan UI components
4. **Service Layer**: Business logic diproses di service layer
5. **Data Persistence**: Data disimpan ke localStorage
6. **UI Update**: UI diperbarui berdasarkan perubahan data

## 🧪 Testing

### Unit Testing
\`\`\`bash
npm run test
\`\`\`

### E2E Testing
\`\`\`bash
npm run test:e2e
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Manual Deployment
\`\`\`bash
npm run build
npm run start
\`\`\`

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Untuk bantuan dan pertanyaan:
- Email: support@hotelmanagement.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

**Hotel Management System v1.0.0**
Built with ❤️ using Next.js and TypeScript
