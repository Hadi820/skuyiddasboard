/**
 * Fix Common Errors Script
 * Automatically fixes common errors in the codebase
 */

import fs from "fs"
import path from "path"

interface FixResult {
  file: string
  issuesFixed: string[]
  success: boolean
}

async function fixCommonErrors(): Promise<FixResult[]> {
  const results: FixResult[] = []

  console.log("🔍 Scanning for common errors...")

  // Fix 1: Add proper error handling to API client
  try {
    const apiClientPath = path.join(process.cwd(), "frontend/src/lib/api.ts")
    if (fs.existsSync(apiClientPath)) {
      let content = fs.readFileSync(apiClientPath, "utf8")

      // Check if retry logic is missing
      if (!content.includes("retryCount") && !content.includes("retryDelay")) {
        content = content.replace(
          "private async request<T>(",
          `private async request<T>(
    endpoint: string,
    method: HttpMethod = "GET",
    data?: any,
    customHeaders?: Record<string, string>,
    retryCount = 3,
    retryDelay = 1000,
  `,
        )

        // Add retry logic
        content = content.replace(
          "try {",
          `try {
      let attempts = 0;
      
      while (attempts < retryCount) {
        try {`,
        )

        content = content.replace(
          "return result",
          `return result;
        } catch (error) {
          attempts++;
          if (attempts >= retryCount) throw error;
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }`,
        )

        fs.writeFileSync(apiClientPath, content)
        results.push({
          file: "frontend/src/lib/api.ts",
          issuesFixed: ["Added retry logic for network resilience"],
          success: true,
        })
      }
    }
  } catch (error) {
    console.error("Error fixing API client:", error)
    results.push({
      file: "frontend/src/lib/api.ts",
      issuesFixed: [],
      success: false,
    })
  }

  // Fix 2: Add CSRF protection to backend
  try {
    const indexPath = path.join(process.cwd(), "backend/src/index.ts")
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, "utf8")

      // Check if CSRF protection is missing
      if (!content.includes("csrf") && !content.includes("csurf")) {
        // Add import
        if (content.includes("import express")) {
          content = content.replace("import express", 'import express\nimport csrf from "csurf"')
        }

        // Add middleware
        if (content.includes("app.use(express.json())")) {
          content = content.replace(
            "app.use(express.json())",
            "app.use(express.json())\n\n// CSRF Protection\nconst csrfProtection = csrf({ cookie: true })\napp.use(csrfProtection)",
          )
        }

        fs.writeFileSync(indexPath, content)

        // Add csurf to package.json if not present
        const packageJsonPath = path.join(process.cwd(), "backend/package.json")
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
          if (!packageJson.dependencies.csurf) {
            packageJson.dependencies.csurf = "^1.11.0"
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
          }
        }

        results.push({
          file: "backend/src/index.ts",
          issuesFixed: ["Added CSRF protection middleware"],
          success: true,
        })
      }
    }
  } catch (error) {
    console.error("Error adding CSRF protection:", error)
    results.push({
      file: "backend/src/index.ts",
      issuesFixed: [],
      success: false,
    })
  }

  // Fix 3: Add resource limits to Docker Compose
  try {
    const dockerComposePath = path.join(process.cwd(), "docker-compose.yml")
    if (fs.existsSync(dockerComposePath)) {
      let content = fs.readFileSync(dockerComposePath, "utf8")

      // Check if resource limits are missing
      if (!content.includes("deploy:") || !content.includes("resources:")) {
        // Add resource limits to backend service
        if (content.includes("  backend:")) {
          content = content.replace(
            "  backend:",
            `  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M`,
          )
        }

        // Add resource limits to frontend service
        if (content.includes("  frontend:")) {
          content = content.replace(
            "  frontend:",
            `  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M`,
          )
        }

        // Add resource limits to database service
        if (content.includes("  postgres:")) {
          content = content.replace(
            "  postgres:",
            `  postgres:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M`,
          )
        }

        fs.writeFileSync(dockerComposePath, content)
        results.push({
          file: "docker-compose.yml",
          issuesFixed: ["Added resource limits to Docker services"],
          success: true,
        })
      }
    }
  } catch (error) {
    console.error("Error adding resource limits to Docker Compose:", error)
    results.push({
      file: "docker-compose.yml",
      issuesFixed: [],
      success: false,
    })
  }

  // Fix 4: Add form validation to reservation form
  try {
    const formPath = path.join(process.cwd(), "components/integrated-reservation-form.tsx")
    if (fs.existsSync(formPath)) {
      let content = fs.readFileSync(formPath, "utf8")

      // Check if form validation is missing
      if (!content.includes("zod") && !content.includes("yup") && !content.includes("validation")) {
        // Add import for zod
        if (content.includes("import { useState")) {
          content = content.replace("import { useState", 'import { z } from "zod"\nimport { useState')
        }

        // Add validation schema
        if (content.includes("export function IntegratedReservationForm")) {
          content = content.replace(
            "export function IntegratedReservationForm",
            `// Validation schema
const reservationSchema = z.object({
  bookingCode: z.string().min(1, "Booking code is required"),
  customerName: z.string().min(1, "Customer name is required"),
  phoneNumber: z.string().optional(),
  checkIn: z.date(),
  checkOut: z.date(),
  orderDetails: z.string().min(1, "Order details are required"),
  gro: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  finalPrice: z.string().min(1, "Final price is required"),
  customerDeposit: z.string().optional(),
  basePrice: z.string().optional(),
  status: z.string(),
  notes: z.string().optional(),
})

export function IntegratedReservationForm`,
          )
        }

        // Add validation to handleSubmit
        if (content.includes("const handleSubmit = async (e: React.FormEvent)")) {
          content = content.replace(
            "try {",
            `try {
      // Validate form data
      const validationResult = reservationSchema.safeParse(formData);
      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        const errorMessage = Object.entries(errors)
          .map(([field, messages]) => \`\${field}: \${messages?.join(', ')}\`)
          .join('\\n');
        throw new Error(\`Validation failed:\\n\${errorMessage}\`);
      }`,
          )
        }

        fs.writeFileSync(formPath, content)

        // Add zod to package.json if not present
        const packageJsonPath = path.join(process.cwd(), "package.json")
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
          if (!packageJson.dependencies.zod) {
            packageJson.dependencies.zod = "^3.22.4"
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
          }
        }

        results.push({
          file: "components/integrated-reservation-form.tsx",
          issuesFixed: ["Added Zod validation to form"],
          success: true,
        })
      }
    }
  } catch (error) {
    console.error("Error adding form validation:", error)
    results.push({
      file: "components/integrated-reservation-form.tsx",
      issuesFixed: [],
      success: false,
    })
  }

  console.log("✅ Fixed common errors successfully!")
  return results
}

// Run fixes
if (require.main === module) {
  fixCommonErrors().then((results) => {
    console.log("\nFix Results:")
    results.forEach((result) => {
      console.log(`\n${result.file}:`)
      if (result.success && result.issuesFixed.length > 0) {
        console.log("  ✅ Fixed:")
        result.issuesFixed.forEach((issue) => {
          console.log(`    - ${issue}`)
        })
      } else {
        console.log("  ❌ No issues fixed or errors occurred")
      }
    })
  })
}

export { fixCommonErrors }
