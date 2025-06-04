import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      email: "admin@hotel.com",
      password: hashedPassword,
      name: "Administrator",
      role: "ADMIN",
      status: "ACTIVE",
    },
  })

  console.log("✅ Admin user created:", adminUser.email)

  // Create GRO users
  const groUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "ilpan@hotel.com" },
      update: {},
      create: {
        email: "ilpan@hotel.com",
        password: await bcrypt.hash("ilpan123", 12),
        name: "ILPAN",
        role: "GRO",
        status: "ACTIVE",
      },
    }),
    prisma.user.upsert({
      where: { email: "jamal@hotel.com" },
      update: {},
      create: {
        email: "jamal@hotel.com",
        password: await bcrypt.hash("jamal123", 12),
        name: "JAMAL",
        role: "GRO",
        status: "ACTIVE",
      },
    }),
    prisma.user.upsert({
      where: { email: "bangnung@hotel.com" },
      update: {},
      create: {
        email: "bangnung@hotel.com",
        password: await bcrypt.hash("bangnung123", 12),
        name: "BANG NUNG",
        role: "GRO",
        status: "ACTIVE",
      },
    }),
  ])

  console.log("✅ GRO users created")

  // Create sample clients
  const sampleClients = await Promise.all([
    prisma.client.upsert({
      where: { email: "john.doe@email.com" },
      update: {},
      create: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "081234567890",
        company: "ABC Corp",
        address: "Jl. Sudirman No. 123, Jakarta",
        status: "ACTIVE",
        createdBy: adminUser.id,
      },
    }),
    prisma.client.upsert({
      where: { email: "jane.smith@email.com" },
      update: {},
      create: {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "081234567891",
        company: "XYZ Ltd",
        address: "Jl. Thamrin No. 456, Jakarta",
        status: "ACTIVE",
        createdBy: adminUser.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "Bob Johnson",
        email: "bob.johnson@email.com",
        phone: "081234567892",
        company: "Tech Solutions",
        address: "Jl. Gatot Subroto No. 789, Jakarta",
        status: "ACTIVE",
        createdBy: adminUser.id,
      },
    }),
  ])

  console.log("✅ Sample clients created")

  // Create sample reservations
  const sampleReservations = await Promise.all([
    prisma.reservation.create({
      data: {
        bookingCode: "BK-20250104-001",
        customerName: "John Doe",
        phoneNumber: "081234567890",
        checkIn: new Date("2025-01-15"),
        checkOut: new Date("2025-01-17"),
        orderDetails: "Villa Utama - 2 Kamar dengan pemandangan laut",
        gro: "ILPAN",
        category: "AKOMODASI",
        finalPrice: 5000000,
        customerDeposit: 2500000,
        basePrice: 4000000,
        status: "SELESAI",
        clientId: sampleClients[0].id,
        createdBy: adminUser.id,
      },
    }),
    prisma.reservation.create({
      data: {
        bookingCode: "BK-20250104-002",
        customerName: "Jane Smith",
        phoneNumber: "081234567891",
        checkIn: new Date("2025-01-20"),
        checkOut: new Date("2025-01-22"),
        orderDetails: "Paket Wisata Pantai 3D2N termasuk transportasi",
        gro: "JAMAL",
        category: "TRIP",
        finalPrice: 3000000,
        customerDeposit: 1500000,
        basePrice: 2500000,
        status: "PROSES",
        clientId: sampleClients[1].id,
        createdBy: adminUser.id,
      },
    }),
    prisma.reservation.create({
      data: {
        bookingCode: "BK-20250104-003",
        customerName: "Bob Johnson",
        phoneNumber: "081234567892",
        checkIn: new Date("2025-01-25"),
        checkOut: new Date("2025-01-27"),
        orderDetails: "Meeting Room Executive + Catering untuk 50 orang",
        gro: "BANG NUNG",
        category: "EVENT",
        finalPrice: 2000000,
        customerDeposit: 1000000,
        basePrice: 1500000,
        status: "PENDING",
        clientId: sampleClients[2].id,
        createdBy: adminUser.id,
      },
    }),
  ])

  console.log("✅ Sample reservations created")

  // Create sample invoices
  await Promise.all([
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-20250104-001",
        invoiceDate: new Date("2025-01-04"),
        dueDate: new Date("2025-01-14"),
        amount: 5000000,
        paidAmount: 5000000,
        status: "PAID",
        description: "Villa Utama - 2 Kamar",
        clientId: sampleClients[0].id,
        reservationId: sampleReservations[0].id,
        createdBy: adminUser.id,
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-20250104-002",
        invoiceDate: new Date("2025-01-04"),
        dueDate: new Date("2025-01-19"),
        amount: 3000000,
        paidAmount: 1500000,
        status: "PENDING",
        description: "Paket Wisata Pantai 3D2N",
        clientId: sampleClients[1].id,
        reservationId: sampleReservations[1].id,
        createdBy: adminUser.id,
      },
    }),
  ])

  console.log("✅ Sample invoices created")

  // Create sample expenses
  await Promise.all([
    prisma.expense.create({
      data: {
        title: "Maintenance AC Villa",
        description: "Perbaikan dan maintenance AC di Villa Utama",
        amount: 500000,
        category: "MAINTENANCE",
        expenseDate: new Date("2025-01-03"),
        createdBy: adminUser.id,
      },
    }),
    prisma.expense.create({
      data: {
        title: "Marketing Digital",
        description: "Biaya iklan Facebook dan Instagram bulan Januari",
        amount: 1000000,
        category: "MARKETING",
        expenseDate: new Date("2025-01-01"),
        createdBy: adminUser.id,
      },
    }),
    prisma.expense.create({
      data: {
        title: "Supplies Kantor",
        description: "Pembelian alat tulis dan supplies kantor",
        amount: 250000,
        category: "SUPPLIES",
        expenseDate: new Date("2025-01-02"),
        createdBy: adminUser.id,
      },
    }),
  ])

  console.log("✅ Sample expenses created")

  // Create GRO commission data
  await Promise.all([
    prisma.groCommission.create({
      data: {
        groName: "ILPAN",
        month: 1,
        year: 2025,
        totalReservations: 15,
        totalRevenue: 75000000,
        commissionRate: 5.0,
        commissionAmount: 3750000,
        isPaid: true,
        paidAt: new Date("2025-01-31"),
      },
    }),
    prisma.groCommission.create({
      data: {
        groName: "JAMAL",
        month: 1,
        year: 2025,
        totalReservations: 12,
        totalRevenue: 60000000,
        commissionRate: 5.0,
        commissionAmount: 3000000,
        isPaid: false,
      },
    }),
    prisma.groCommission.create({
      data: {
        groName: "BANG NUNG",
        month: 1,
        year: 2025,
        totalReservations: 8,
        totalRevenue: 40000000,
        commissionRate: 5.0,
        commissionAmount: 2000000,
        isPaid: false,
      },
    }),
  ])

  console.log("✅ GRO commission data created")

  // Create STOR fund data
  await prisma.storFund.create({
    data: {
      month: 1,
      year: 2025,
      totalAmount: 10000000,
      usedAmount: 2500000,
      description: "Dana STOR untuk bulan Januari 2025",
    },
  })

  console.log("✅ STOR fund data created")

  // Update client statistics
  for (const client of sampleClients) {
    const stats = await prisma.reservation.aggregate({
      where: { clientId: client.id },
      _count: { id: true },
      _sum: { finalPrice: true },
      _max: { createdAt: true },
    })

    await prisma.client.update({
      where: { id: client.id },
      data: {
        totalReservations: stats._count.id,
        totalRevenue: stats._sum.finalPrice || 0,
        lastReservation: stats._max.createdAt,
      },
    })
  }

  console.log("✅ Client statistics updated")
  console.log("🎉 Database seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
