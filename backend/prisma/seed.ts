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

  // Create staff users
  const staffUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "staff1@hotel.com" },
      update: {},
      create: {
        email: "staff1@hotel.com",
        password: await bcrypt.hash("staff123", 12),
        name: "Staff Reservasi",
        role: "STAFF",
        status: "ACTIVE",
      },
    }),
    prisma.user.upsert({
      where: { email: "manager@hotel.com" },
      update: {},
      create: {
        email: "manager@hotel.com",
        password: await bcrypt.hash("manager123", 12),
        name: "Manager Hotel",
        role: "MANAGER",
        status: "ACTIVE",
      },
    }),
  ])

  console.log("✅ Staff users created")

  // Create sample clients (empty for production)
  console.log("✅ Sample clients ready (empty for production)")

  // Create sample reservations (empty for production)
  console.log("✅ Sample reservations ready (empty for production)")

  // Create sample invoices (empty for production)
  console.log("✅ Sample invoices ready (empty for production)")

  // Create sample expenses (empty for production)
  console.log("✅ Sample expenses ready (empty for production)")

  // Initialize GRO commission structure
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const groNames = ["ILPAN", "JAMAL", "BANG NUNG"]
  
  for (const groName of groNames) {
    await prisma.groCommission.upsert({
      where: {
        groName_month_year: {
          groName,
          month: currentMonth,
          year: currentYear,
        },
      },
      update: {},
      create: {
        groName,
        month: currentMonth,
        year: currentYear,
        totalReservations: 0,
        totalRevenue: 0,
        commissionRate: 5.0,
        commissionAmount: 0,
        isPaid: false,
      },
    })
  }

  console.log("✅ GRO commission structure initialized")

  // Initialize STOR fund for current month
  await prisma.storFund.upsert({
    where: {
      month_year: {
        month: currentMonth,
        year: currentYear,
      },
    },
    update: {},
    create: {
      month: currentMonth,
      year: currentYear,
      totalAmount: 0,
      usedAmount: 0,
      description: `Dana STOR untuk ${currentMonth}/${currentYear}`,
    },
  })

  console.log("✅ STOR fund initialized")
  console.log("🎉 Database seeding completed successfully!")
  console.log("\n📋 Default Users Created:")
  console.log("👤 Admin: admin@hotel.com / admin123")
  console.log("👤 Manager: manager@hotel.com / manager123")
  console.log("👤 Staff: staff1@hotel.com / staff123")
  console.log("👤 GRO ILPAN: ilpan@hotel.com / ilpan123")
  console.log("👤 GRO JAMAL: jamal@hotel.com / jamal123")
  console.log("👤 GRO BANG NUNG: bangnung@hotel.com / bangnung123")
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
