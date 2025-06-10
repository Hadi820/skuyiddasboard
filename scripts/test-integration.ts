import axios from "axios"
import chalk from "chalk"
import dotenv from "dotenv"
import { v4 as uuidv4 } from "uuid"

// Load environment variables
dotenv.config()

const API_URL = process.env.API_URL || "http://localhost:3001/api"
let authToken: string
let refreshToken: string
let testUserId: string
let testClientId: string
let testReservationId: string
let testInvoiceId: string

async function main() {
  console.log(chalk.blue("🧪 Starting Integration Tests"))
  console.log(chalk.blue("================================================="))

  try {
    // Test authentication
    await testAuthentication()

    // Test user management
    await testUserManagement()

    // Test client management
    await testClientManagement()

    // Test reservation management
    await testReservationManagement()

    // Test invoice management
    await testInvoiceManagement()

    // Test dashboard
    await testDashboard()

    // Test health endpoints
    await testHealthEndpoints()

    console.log(chalk.green("\n✅ All integration tests passed!"))
  } catch (error) {
    console.error(chalk.red("\n❌ Integration tests failed:"))
    console.error(error)
    process.exit(1)
  }
}

async function testAuthentication() {
  console.log(chalk.yellow("\n🔐 Testing Authentication..."))

  // Test login
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: "admin@hotel.com",
      password: "admin123",
    })

    authToken = loginResponse.data.token
    refreshToken = loginResponse.data.refreshToken

    console.log(chalk.green("✅ Login successful"))

    // Test profile
    const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    console.log(chalk.green("✅ Profile retrieval successful"))

    // Test refresh token
    const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    })

    authToken = refreshResponse.data.token

    console.log(chalk.green("✅ Token refresh successful"))
  } catch (error) {
    console.error(chalk.red("❌ Authentication test failed:"))
    console.error(error.response?.data || error.message)
    throw error
  }
}

async function testUserManagement() {
  console.log(chalk.yellow("\n👤 Testing User Management..."))

  try {
    // Create test user
    const createUserResponse = await axios.post(
      `${API_URL}/users`,
      {
        email: `test-${uuidv4().slice(0, 8)}@example.com`,
        password: "Test123!",
        name: "Test User",
        role: "STAFF",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    testUserId = createUserResponse.data.id
    console.log(chalk.green("✅ User creation successful"))

    // Get user
    await axios.get(`${API_URL}/users/${testUserId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    console.log(chalk.green("✅ User retrieval successful"))

    // Update user
    await axios.put(
      `${API_URL}/users/${testUserId}`,
      {
        name: "Updated Test User",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    console.log(chalk.green("✅ User update successful"))

    // Get all users
    const usersResponse = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (Array.isArray(usersResponse.data.data)) {
      console.log(chalk.green("✅ Users list retrieval successful"))
    } else {
      throw new Error("Invalid users response")
    }

    // Delete user
    await axios.delete(`${API_URL}/users/${testUserId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    console.log(chalk.green("✅ User deletion successful"))
  } catch (error) {
    console.error(chalk.red("❌ User management test failed:"))
    console.error(error.response?.data || error.message)
    throw error
  }
}

async function testClientManagement() {
  console.log(chalk.yellow("\n👥 Testing Client Management..."))

  try {
    // Create test client
    const createClientResponse = await axios.post(
      `${API_URL}/clients`,
      {
        name: "Test Client",
        email: `client-${uuidv4().slice(0, 8)}@example.com`,
        phone: "081234567890",
        company: "Test Company",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    testClientId = createClientResponse.data.id
    console.log(chalk.green("✅ Client creation successful"))

    // Get client
    await axios.get(`${API_URL}/clients/${testClientId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    console.log(chalk.green("✅ Client retrieval successful"))

    // Update client
    await axios.put(
      `${API_URL}/clients/${testClientId}`,
      {
        name: "Updated Test Client",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    console.log(chalk.green("✅ Client update successful"))

    // Get all clients
    const clientsResponse = await axios.get(`${API_URL}/clients`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (Array.isArray(clientsResponse.data.data)) {
      console.log(chalk.green("✅ Clients list retrieval successful"))
    } else {
      throw new Error("Invalid clients response")
    }
  } catch (error) {
    console.error(chalk.red("❌ Client management test failed:"))
    console.error(error.response?.data || error.message)
    throw error
  }
}

async function testReservationManagement() {
  console.log(chalk.yellow("\n📅 Testing Reservation Management..."))

  try {
    // Create test reservation
    const checkIn = new Date()
    const checkOut = new Date()
    checkOut.setDate(checkOut.getDate() + 2)

    const createReservationResponse = await axios.post(
      `${API_URL}/reservations`,
      {
        customerName: "Test Customer",
        phoneNumber: "081234567890",
        checkIn: checkIn.toISOString().split("T")[0],
        checkOut: checkOut.toISOString().split("T")[0],
        orderDetails: "Test Room - 1 Night",
        category: "AKOMODASI",
        finalPrice: 1000000,
        basePrice: 800000,
        status: "PENDING",
        clientId: testClientId,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    testReservationId = createReservationResponse.data.id
    console.log(chalk.green("✅ Reservation creation successful"))

    // Get reservation
    await axios.get(`${API_URL}/reservations/${testReservationId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    console.log(chalk.green("✅ Reservation retrieval successful"))

    // Update reservation
    await axios.put(
      `${API_URL}/reservations/${testReservationId}`,
      {
        status: "PROSES",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    console.log(chalk.green("✅ Reservation update successful"))

    // Get all reservations
    const reservationsResponse = await axios.get(`${API_URL}/reservations`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (Array.isArray(reservationsResponse.data.data)) {
      console.log(chalk.green("✅ Reservations list retrieval successful"))
    } else {
      throw new Error("Invalid reservations response")
    }
  } catch (error) {
    console.error(chalk.red("❌ Reservation management test failed:"))
    console.error(error.response?.data || error.message)
    throw error
  }
}

async function testInvoiceManagement() {
  console.log(chalk.yellow("\n💰 Testing Invoice Management..."))

  try {
    // Create test invoice
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 7)

    const createInvoiceResponse = await axios.post(
      `${API_URL}/invoices`,
      {
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: dueDate.toISOString().split("T")[0],
        amount: 1000000,
        status: "PENDING",
        description: "Test Invoice",
        clientId: testClientId,
        reservationId: testReservationId,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    testInvoiceId = createInvoiceResponse.data.id
    console.log(chalk.green("✅ Invoice creation successful"))

    // Get invoice
    await axios.get(`${API_URL}/invoices/${testInvoiceId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    console.log(chalk.green("✅ Invoice retrieval successful"))

    // Update invoice
    await axios.put(
      `${API_URL}/invoices/${testInvoiceId}`,
      {
        status: "PAID",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    console.log(chalk.green("✅ Invoice update successful"))

    // Get all invoices
    const invoicesResponse = await axios.get(`${API_URL}/invoices`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (Array.isArray(invoicesResponse.data.data)) {
      console.log(chalk.green("✅ Invoices list retrieval successful"))
    } else {
      throw new Error("Invalid invoices response")
    }
  } catch (error) {
    console.error(chalk.red("❌ Invoice management test failed:"))
    console.error(error.response?.data || error.message)
    throw error
  }
}

async function testDashboard() {
  console.log(chalk.yellow("\n📊 Testing Dashboard..."))

  try {
    // Get dashboard data
    const dashboardResponse = await axios.get(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    console.log(chalk.green("✅ Dashboard data retrieval successful"))
  } catch (error) {
    console.error(chalk.red("❌ Dashboard test failed:"))
    console.error(error.response?.data || error.message)
    throw error
  }
}

async function testHealthEndpoints() {
  console.log(chalk.yellow("\n🏥 Testing Health Endpoints..."))

  try {
    // Test health endpoint
    const healthResponse = await axios.get(`${API_URL}/health`)

    console.log(chalk.green("✅ Health endpoint test successful"))
  } catch (error) {
    console.error(chalk.red("❌ Health endpoint test failed:"))
    console.error(error.response?.data || error.message)
    throw error
  }
}
