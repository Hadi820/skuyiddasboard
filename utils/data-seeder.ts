export class DataSeeder {
  static async seedReservations() {
    // Implementation untuk seed reservations
    console.log("Seeding reservations...")
    // Add logic to populate reservations
  }

  static async seedClients() {
    // Implementation untuk seed clients
    console.log("Seeding clients...")
    // Add logic to populate clients
  }

  static async seedInvoices() {
    // Implementation untuk seed invoices
    console.log("Seeding invoices...")
    // Add logic to populate invoices
  }

  static async seedExpenses() {
    // Implementation untuk seed expenses
    console.log("Seeding expenses...")
    // Add logic to populate expenses
  }

  static async seedAll() {
    console.log("🌱 Starting data seeding...")
    await this.seedClients()
    await this.seedReservations()
    await this.seedInvoices()
    await this.seedExpenses()
    console.log("✅ Data seeding completed!")
  }

  static async clearAll() {
    console.log("🧹 Clearing all data...")
    // Implementation untuk clear semua data
    console.log("✅ All data cleared!")
  }
}
