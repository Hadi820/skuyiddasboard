# Data Management Guide

## 📊 Overview

Hotel Management System sekarang menggunakan **clean slate approach** dengan data kosong secara default. Ini memberikan fleksibilitas untuk:

- ✅ **Fresh Installation** tanpa data dummy
- ✅ **Custom Data Entry** sesuai kebutuhan bisnis
- ✅ **Sample Data** untuk testing dan development
- ✅ **Data Import/Export** untuk migrasi

---

## 🗃️ Data Structure

### **Empty by Default:**
- **Reservations**: `[]` (kosong)
- **Clients**: `[]` (kosong)  
- **Invoices**: `[]` (kosong)
- **Expenses**: `[]` (kosong)
- **GRO Commissions**: `[]` (kosong)
- **Stor Transactions**: `[]` (kosong)

### **Sample Data Available:**
- File `data/sample-data.ts` berisi contoh data untuk testing
- Dapat di-populate melalui Admin Data Manager
- Mudah dihapus dan direset

---

## 🛠️ Data Management Options

### **1. Manual Data Entry**
\`\`\`typescript
// Tambah data melalui UI forms:
- Reservations → "Tambah Reservasi Baru"
- Clients → "Tambah Client Baru"  
- Invoices → "Buat Invoice Baru"
- Expenses → "Tambah Pengeluaran"
\`\`\`

### **2. Sample Data Population**
\`\`\`typescript
// Melalui Admin Data Manager:
Settings → Data Management → "Tambah Sample Data"

// Atau programmatically:
import { DataSeeder } from "@/utils/data-seeder"
await DataSeeder.seedAll()
\`\`\`

### **3. Data Import/Export**
\`\`\`typescript
// Export current data:
Settings → Data Management → Import/Export → "Export Data"

// Import from file:
Settings → Data Management → Import/Export → "Import Data"
\`\`\`

### **4. Clear All Data**
\`\`\`typescript
// Reset to clean state:
Settings → Data Management → "Hapus Semua Data"

// Programmatically:
await DataSeeder.clearAll()
\`\`\`

---

## 🔧 Development Workflow

### **For Development:**
1. **Start Clean**: Sistem dimulai dengan data kosong
2. **Add Sample Data**: Gunakan Admin Data Manager untuk populate
3. **Test Features**: Test semua fitur dengan sample data
4. **Clear & Repeat**: Reset dan test lagi

### **For Production:**
1. **Deploy Clean**: Deploy dengan data kosong
2. **Manual Setup**: Admin menambah data real secara manual
3. **Import Data**: Atau import dari sistem lama
4. **Backup Regular**: Setup backup otomatis

---

## 📋 Admin Data Manager Features

### **🎛️ Manage Data Tab:**
- **Populate Sample Data**: Tambah data contoh untuk testing
- **Clear All Data**: Hapus semua data (dengan konfirmasi)

### **📁 Import/Export Tab:**
- **Export Data**: Download semua data ke JSON/Excel
- **Import Data**: Upload data dari file

### **📊 System Status Tab:**
- **Data Counts**: Jumlah records per kategori
- **System Health**: Status sistem dan database
- **Storage Usage**: Penggunaan storage dan memory

---

## 🔒 Security & Permissions

### **Admin Only Access:**
\`\`\`typescript
// Data Management hanya untuk Admin
if (user.role !== 'admin') {
  return <AccessDenied />
}
\`\`\`

### **Confirmation Required:**
\`\`\`typescript
// Konfirmasi untuk operasi destructive
const confirmed = confirm("⚠️ Yakin hapus semua data?")
if (!confirmed) return
\`\`\`

### **Audit Trail:**
\`\`\`typescript
// Log semua operasi data management
logger.info('Data operation', {
  action: 'clear_all_data',
  user: user.id,
  timestamp: new Date()
})
\`\`\`

---

## 🚀 Quick Start

### **1. First Time Setup:**
\`\`\`bash
# 1. Deploy aplikasi (data kosong)
npm run build && npm start

# 2. Login sebagai admin
# 3. Buka Settings → Data Management
# 4. Klik "Tambah Sample Data" untuk testing
\`\`\`

### **2. Production Setup:**
\`\`\`bash
# 1. Deploy ke production
# 2. Admin login dan setup data manual
# 3. Atau import data dari sistem lama
# 4. Setup backup otomatis
\`\`\`

### **3. Development Setup:**
\`\`\`bash
# 1. Clone repository
# 2. npm install && npm run dev
# 3. Populate sample data untuk development
# 4. Start coding!
\`\`\`

---

## 📈 Benefits

### **✅ Clean Installation:**
- Tidak ada data dummy yang mengganggu
- Fresh start untuk setiap deployment
- Customizable sesuai kebutuhan bisnis

### **✅ Flexible Development:**
- Sample data tersedia untuk testing
- Easy reset untuk development
- Clear separation antara sample dan real data

### **✅ Production Ready:**
- No dummy data in production
- Proper data management tools
- Import/export capabilities

### **✅ Maintainable:**
- Clear data structure
- Easy backup and restore
- Audit trail untuk semua operasi

---

Sistem sekarang siap untuk production dengan data management yang proper! 🎉
