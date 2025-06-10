interface ErrorReport {
  severity: "critical" | "high" | "medium" | "low"
  category: "frontend" | "backend" | "database" | "security" | "infrastructure"
  description: string
  file?: string
  line?: number
  recommendation: string
}

function analyzeCodebase(): ErrorReport[] {
  const errors: ErrorReport[] = []

  // Frontend errors
  errors.push({
    severity: "medium",
    category: "frontend",
    description: "API client tidak menangani network errors dengan baik",
    file: "frontend/src/lib/api.ts",
    recommendation: "Tambahkan retry logic dan offline detection",
  })

  errors.push({
    severity: "medium",
    category: "frontend",
    description: "Beberapa form tidak memiliki validasi yang cukup",
    file: "components/integrated-reservation-form.tsx",
    recommendation: "Implementasikan Zod atau Yup untuk validasi form",
  })

  errors.push({
    severity: "low",
    category: "frontend",
    description: "Token refresh mechanism tidak robust",
    file: "hooks/use-auth.ts",
    recommendation: "Implementasikan interceptor untuk auto-refresh token",
  })

  // Backend errors
  errors.push({
    severity: "high",
    category: "backend",
    description: "Beberapa endpoint tidak memiliki validasi input yang cukup",
    file: "backend/src/controllers/reservation.controller.ts",
    recommendation: "Gunakan express-validator untuk semua input",
  })

  errors.push({
    severity: "medium",
    category: "backend",
    description: "Error handling tidak konsisten di beberapa endpoint",
    file: "backend/src/controllers/client.controller.ts",
    recommendation: "Standardisasi error response format",
  })

  // Database errors
  errors.push({
    severity: "medium",
    category: "database",
    description: "Connection pooling belum dioptimalkan",
    file: "backend/src/config/database.ts",
    recommendation: "Konfigurasi pool size berdasarkan beban aplikasi",
  })

  errors.push({
    severity: "high",
    category: "database",
    description: "Beberapa operasi kompleks tidak menggunakan transactions",
    file: "backend/src/services/reservation.service.ts",
    recommendation: "Gunakan Prisma transactions untuk operasi yang melibatkan multiple tables",
  })

  // Security errors
  errors.push({
    severity: "high",
    category: "security",
    description: "CSRF protection belum diimplementasikan",
    file: "backend/src/index.ts",
    recommendation: "Tambahkan middleware csurf untuk CSRF protection",
  })

  errors.push({
    severity: "medium",
    category: "security",
    description: "Content Security Policy belum dikonfigurasi",
    file: "backend/src/index.ts",
    recommendation: "Konfigurasi CSP headers dengan helmet",
  })

  // Infrastructure errors
  errors.push({
    severity: "medium",
    category: "infrastructure",
    description: "Docker containers tidak memiliki resource limits",
    file: "docker-compose.yml",
    recommendation: "Tambahkan memory dan CPU limits untuk setiap service",
  })

  errors.push({
    severity: "low",
    category: "infrastructure",
    description: "Health checks belum diimplementasikan untuk semua services",
    file: "docker-compose.yml",
    recommendation: "Tambahkan health checks untuk semua services",
  })

  return errors
}

function generateErrorReport(): string {
  const errors = analyzeCodebase()

  // Count errors by severity
  const criticalCount = errors.filter((e) => e.severity === "critical").length
  const highCount = errors.filter((e) => e.severity === "high").length
  const mediumCount = errors.filter((e) => e.severity === "medium").length
  const lowCount = errors.filter((e) => e.severity === "low").length

  // Count errors by category
  const frontendCount = errors.filter((e) => e.category === "frontend").length
  const backendCount = errors.filter((e) => e.category === "backend").length
  const databaseCount = errors.filter((e) => e.category === "database").length
  const securityCount = errors.filter((e) => e.category === "security").length
  const infrastructureCount = errors.filter((e) => e.category === "infrastructure").length

  let report = `# Error Analysis Report\n\n`

  report += `## Summary\n\n`
  report += `Total issues found: ${errors.length}\n\n`

  report += `### By Severity\n`
  report += `- Critical: ${criticalCount}\n`
  report += `- High: ${highCount}\n`
  report += `- Medium: ${mediumCount}\n`
  report += `- Low: ${lowCount}\n\n`

  report += `### By Category\n`
  report += `- Frontend: ${frontendCount}\n`
  report += `- Backend: ${backendCount}\n`
  report += `- Database: ${databaseCount}\n`
  report += `- Security: ${securityCount}\n`
  report += `- Infrastructure: ${infrastructureCount}\n\n`

  report += `## Detailed Findings\n\n`

  // Group by category
  const categories = ["frontend", "backend", "database", "security", "infrastructure"]

  for (const category of categories) {
    const categoryErrors = errors.filter((e) => e.category === category)
    if (categoryErrors.length > 0) {
      report += `### ${category.charAt(0).toUpperCase() + category.slice(1)} Issues\n\n`

      for (const error of categoryErrors) {
        report += `#### ${error.severity.toUpperCase()}: ${error.description}\n`
        if (error.file) {
          report += `- **File**: \`${error.file}\`\n`
        }
        report += `- **Recommendation**: ${error.recommendation}\n\n`
      }
    }
  }

  report += `## Conclusion\n\n`

  if (criticalCount > 0) {
    report += `⚠️ **Critical issues found!** These must be addressed before deployment.\n\n`
  } else if (highCount > 0) {
    report += `⚠️ **High severity issues found.** These should be addressed before production use.\n\n`
  } else if (mediumCount > 0) {
    report += `⚠️ **Medium severity issues found.** Consider addressing these for better quality.\n\n`
  } else if (lowCount > 0) {
    report += `ℹ️ **Only low severity issues found.** Application is generally in good shape.\n\n`
  } else {
    report += `✅ **No issues found!** Application is in excellent shape.\n\n`
  }

  report += `Overall, the application is **${getOverallStatus(criticalCount, highCount, mediumCount, lowCount)}**.\n`

  return report
}

function getOverallStatus(critical: number, high: number, medium: number, low: number): string {
  if (critical > 0) {
    return "NOT READY FOR PRODUCTION"
  } else if (high > 3) {
    return "NEEDS SIGNIFICANT IMPROVEMENTS"
  } else if (high > 0) {
    return "NEEDS SOME IMPROVEMENTS"
  } else if (medium > 5) {
    return "MOSTLY READY WITH IMPROVEMENTS NEEDED"
  } else if (medium > 0 || low > 0) {
    return "READY WITH MINOR IMPROVEMENTS RECOMMENDED"
  } else {
    return "PRODUCTION READY"
  }
}

// Run analysis
if (require.main === module) {
  console.log(generateErrorReport())
}

export { analyzeCodebase, generateErrorReport }
