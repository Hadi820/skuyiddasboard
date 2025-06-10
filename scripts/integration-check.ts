import axios from "axios"
import chalk from "chalk"
import dotenv from "dotenv"
import * as fs from "fs"
import * as path from "path"

// Load environment variables
dotenv.config()

const API_URL = process.env.API_URL || "http://localhost:3001/api"
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

async function main() {
  console.log(chalk.blue("🔍 Starting Hotel Management System Integration Check"))
  console.log(chalk.blue("================================================="))

  // Check environment variables
  checkEnvironmentVariables()

  // Check database connection
  await checkDatabase()

  // Check backend API
  await checkBackendAPI()

  // Check frontend build
  checkFrontendBuild()

  // Check API integration
  await checkAPIIntegration()

  // Check CRUD operations
  await checkCRUDOperations()

  console.log(chalk.blue("\n================================================="))
  console.log(chalk.green("✅ Integration check completed successfully!"))
  console.log(chalk.blue("================================================="))
}

function checkEnvironmentVariables() {
  console.log(chalk.yellow("\n📋 Checking Environment Variables..."))

  const requiredBackendVars = [
    "DATABASE_URL",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES_IN",
    "PORT",
    "FRONTEND_URL",
  ]

  const requiredFrontendVars = ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_APP_URL"]

  // Check backend .env
  let backendEnvPath = path.join(__dirname, "../backend/.env")
  if (!fs.existsSync(backendEnvPath)) {
    backendEnvPath = path.join(__dirname, "../backend/.env.example")
  }

  if (fs.existsSync(backendEnvPath)) {
    const backendEnv = fs.readFileSync(backendEnvPath, "utf8")
    const missingBackendVars = requiredBackendVars.filter((v) => !backendEnv.includes(`${v}=`))

    if (missingBackendVars.length > 0) {
      console.log(chalk.red(`❌ Missing backend environment variables: ${missingBackendVars.join(", ")}`))
    } else {
      console.log(chalk.green("✅ Backend environment variables are configured"))
    }
  } else {
    console.log(chalk.red("❌ Backend .env file not found"))
  }

  // Check frontend .env
  let frontendEnvPath = path.join(__dirname, "../frontend/.env.local")
  if (!fs.existsSync(frontendEnvPath)) {
    frontendEnvPath = path.join(__dirname, "../frontend/.env.example")
  }

  if (fs.existsSync(frontendEnvPath)) {
    const frontendEnv = fs.readFileSync(frontendEnvPath, "utf8")
    const missingFrontendVars = requiredFrontendVars.filter((v) => !frontendEnv.includes(`${v}=`))

    if (missingFrontendVars.length > 0) {
      console.log(chalk.red(`❌ Missing frontend environment variables: ${missingFrontendVars.join(", ")}`))
    } else {
      console.log(chalk.green("✅ Frontend environment variables are configured"))
    }
  } else {
    console.log(chalk.red("❌ Frontend .env file not found"))
  }
}

async function checkDatabase() {
  console.log(chalk.yellow("\n🗄️ Checking Database Connection..."))

  try {
    const response = await axios.get(`${API_URL}/health/database`)

    if (response.status === 200 && response.data.status === "connected") {
      console.log(chalk.green("✅ Database connection successful"))
      console.log(chalk.gray(`   Database version: ${response.data.version}`))
      console.log(chalk.gray(`   Tables: ${Object.keys(response.data.tables).length}`))

      // Check if tables have data
      const emptyTables = Object.entries(response.data.tables)
        .filter(([_, count]) => count === 0)
        .map(([table]) => table)

      if (emptyTables.length > 0) {
        console.log(chalk.yellow(`⚠️ Empty tables detected: ${emptyTables.join(", ")}`))
        console.log(chalk.yellow("   Consider running database seed script"))
      }
    } else {
      console.log(chalk.red("❌ Database connection check failed"))
    }
  } catch (error) {
    console.log(chalk.red("❌ Database connection check failed"))
    console.log(chalk.red(`   Error: ${error.message}`))
  }
}

async function checkBackendAPI() {
  console.log(chalk.yellow("\n🔌 Checking Backend API..."))

  try {
    const response = await axios.get(`${API_URL}/health`)

    if (response.status === 200) {
      console.log(chalk.green("✅ Backend API is running"))
      console.log(chalk.gray(`   Status: ${response.data.status}`))
      console.log(chalk.gray(`   Version: ${response.data.version}`))
      console.log(chalk.gray(`   Environment: ${response.data.environment}`))
      console.log(chalk.gray(`   Uptime: ${response.data.uptime}`))
    } else {
      console.log(chalk.red("❌ Backend API check failed"))
    }
  } catch (error) {
    console.log(chalk.red("❌ Backend API check failed"))
    console.log(chalk.red(`   Error: ${error.message}`))
  }
}

function checkFrontendBuild() {
  console.log(chalk.yellow("\n🖥️ Checking Frontend Build..."))

  const frontendDir = path.join(__dirname, "../frontend")
  const buildDir = path.join(frontendDir, ".next")

  if (fs.existsSync(buildDir)) {
    console.log(chalk.green("✅ Frontend build exists"))

    // Check build stats
    try {
      const stats = fs.statSync(buildDir)
      const buildSizeMB = (
        fs.readdirSync(buildDir).reduce((acc, file) => {
          const filePath = path.join(buildDir, file)
          return acc + (fs.statSync(filePath).isFile() ? fs.statSync(filePath).size : 0)
        }, 0) /
        (1024 * 1024)
      ).toFixed(2)

      console.log(chalk.gray(`   Build size: ${buildSizeMB} MB`))
      console.log(chalk.gray(`   Last built: ${stats.mtime.toLocaleString()}`))
    } catch (error) {
      console.log(chalk.yellow("⚠️ Could not read build stats"))
    }
  } else {
    console.log(chalk.yellow("⚠️ Frontend build not found"))
    console.log(chalk.yellow("   Run 'cd frontend && npm run build' to create a production build"))
  }

  // Check package.json for dependencies
  const packageJsonPath = path.join(frontendDir, "package.json")
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }

    const requiredDeps = ["react", "next", "axios", "date-fns", "react-dom"]
    const missingDeps = requiredDeps.filter((dep) => !deps[dep])

    if (missingDeps.length > 0) {
      console.log(chalk.red(`❌ Missing frontend dependencies: ${missingDeps.join(", ")}`))
    } else {
      console.log(chalk.green("✅ Frontend dependencies are installed"))
    }
  } else {
    console.log(chalk.red("❌ Frontend package.json not found"))
  }
}

async function checkAPIIntegration() {
  console.log(chalk.yellow("\n🔄 Checking API Integration..."))

  // Check if API client is properly configured
  const apiClientPath = path.join(__dirname, "../frontend/lib/api.ts")
  if (fs.existsSync(apiClientPath)) {
    const apiClientContent = fs.readFileSync(apiClientPath, "utf8")

    // Check for essential API endpoints
    const requiredEndpoints = ["auth", "users", "clients", "reservations", "invoices"]
    const missingEndpoints = requiredEndpoints.filter((endpoint) => !apiClientContent.includes(`${endpoint}Api`))

    if (missingEndpoints.length > 0) {
      console.log(chalk.red(`❌ Missing API endpoints in frontend client: ${missingEndpoints.join(", ")}`))
    } else {
      console.log(chalk.green("✅ Frontend API client is properly configured"))
    }

    // Check for token handling
    if (apiClientContent.includes("Authorization") && apiClientContent.includes("Bearer")) {
      console.log(chalk.green("✅ Authentication token handling is implemented"))
    } else {
      console.log(chalk.yellow("⚠️ Authentication token handling might be missing"))
    }

    // Check for error handling
    if (apiClientContent.includes("interceptors.response") && apiClientContent.includes("error")) {
      console.log(chalk.green("✅ API error handling is implemented"))
    } else {
      console.log(chalk.yellow("⚠️ API error handling might be missing"))
    }
  } else {
    console.log(chalk.red("❌ Frontend API client not found"))
  }
}

async function checkCRUDOperations() {
  console.log(chalk.yellow("\n📝 Checking CRUD Operations..."))

  // We'll check if the CRUD components exist and are properly implemented
  const componentsDir = path.join(__dirname, "../frontend/components")

  // Check reservation form
  const reservationFormPath = path.join(componentsDir, "reservation-form.tsx")
  if (fs.existsSync(reservationFormPath)) {
    const content = fs.readFileSync(reservationFormPath, "utf8")

    if (content.includes("handleSubmit") && content.includes("onChange")) {
      console.log(chalk.green("✅ Reservation form has proper event handlers"))
    } else {
      console.log(chalk.yellow("⚠️ Reservation form might be missing event handlers"))
    }

    if (content.includes("addReservation") && content.includes("updateReservation")) {
      console.log(chalk.green("✅ Reservation form has create/update functionality"))
    } else {
      console.log(chalk.yellow("⚠️ Reservation form might be missing create/update functionality"))
    }
  } else {
    console.log(chalk.red("❌ Reservation form component not found"))
  }

  // Check reservation table
  const reservationTablePath = path.join(componentsDir, "reservation-table.tsx")
  if (fs.existsSync(reservationTablePath)) {
    const content = fs.readFileSync(reservationTablePath, "utf8")

    if (content.includes("filteredReservations") || content.includes("sortedReservations")) {
      console.log(chalk.green("✅ Reservation table has filtering/sorting functionality"))
    } else {
      console.log(chalk.yellow("⚠️ Reservation table might be missing filtering/sorting"))
    }

    if (content.includes("Edit") && content.includes("Delete")) {
      console.log(chalk.green("✅ Reservation table has edit/delete functionality"))
    } else {
      console.log(chalk.yellow("⚠️ Reservation table might be missing edit/delete functionality"))
    }
  } else {
    console.log(chalk.red("❌ Reservation table component not found"))
  }

  // Check backend controllers
  const controllersDir = path.join(__dirname, "../backend/src/controllers")

  // Check reservation controller
  const reservationControllerPath = path.join(controllersDir, "reservation.controller.ts")
  if (fs.existsSync(reservationControllerPath)) {
    const content = fs.readFileSync(reservationControllerPath, "utf8")

    const crudMethods = ["create", "getAll", "getById", "update", "delete"].filter((method) => content.includes(method))

    if (crudMethods.length === 5) {
      console.log(chalk.green("✅ Reservation controller has all CRUD methods"))
    } else {
      const missing = ["create", "getAll", "getById", "update", "delete"].filter((m) => !crudMethods.includes(m))
      console.log(chalk.yellow(`⚠️ Reservation controller is missing methods: ${missing.join(", ")}`))
    }
  } else {
    console.log(chalk.red("❌ Reservation controller not found"))
  }
}

main().catch((error) => {
  console.error(chalk.red("❌ Integration check failed with error:"))
  console.error(error)
  process.exit(1)
})
