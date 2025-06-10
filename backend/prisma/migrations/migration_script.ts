import { PrismaClient } from "@prisma/client"
import * as fs from "fs"
import * as path from "path"

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Starting database migration...")

  try {
    // 1. Run Prisma migrations
    console.log("Running Prisma migrations...")
    // This is handled by the Prisma CLI, but we can check if it's needed

    // 2. Check if we need to run custom SQL scripts
    const sqlDir = path.join(__dirname, "../../database/migrations")
    if (fs.existsSync(sqlDir)) {
      const sqlFiles = fs
        .readdirSync(sqlDir)
        .filter((file) => file.endsWith(".sql"))
        .sort() // Ensure files are processed in order

      if (sqlFiles.length > 0) {
        console.log(`Found ${sqlFiles.length} SQL migration files`)

        // Track which migrations have been run
        const migrationTable = await ensureMigrationTable()

        for (const file of sqlFiles) {
          const migrationName = file.replace(".sql", "")

          // Check if migration has already been run
          const migrationExists = await prisma.$queryRaw`
            SELECT COUNT(*) as count FROM migrations WHERE name = ${migrationName}
          `

          if (migrationExists[0].count > 0) {
            console.log(`Migration ${migrationName} already applied, skipping`)
            continue
          }

          // Run the migration
          console.log(`Applying migration: ${migrationName}`)
          const sql = fs.readFileSync(path.join(sqlDir, file), "utf8")

          // Execute the SQL script
          await prisma.$executeRawUnsafe(sql)

          // Record that the migration has been run
          await prisma.$executeRaw`
            INSERT INTO migrations (name, applied_at) VALUES (${migrationName}, NOW())
          `

          console.log(`✅ Migration ${migrationName} applied successfully`)
        }
      }
    }

    console.log("✅ Database migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function ensureMigrationTable() {
  // Check if migrations table exists, if not create it
  try {
    await prisma.$queryRaw`SELECT 'migrations'::regclass`
  } catch (e) {
    console.log("Creating migrations table...")
    await prisma.$executeRaw`
      CREATE TABLE migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
  }
  return true
}

main()
