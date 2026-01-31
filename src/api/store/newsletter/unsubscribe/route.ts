import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "@medusajs/framework/zod"

// Validation schema
const unsubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
})

/**
 * POST /store/newsletter/unsubscribe
 * Public endpoint - no authentication required
 * GDPR compliant unsubscribe
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const newsletterModuleService = req.scope.resolve("newsletterModuleService")

  try {
    // Validate input
    const validated = unsubscribeSchema.parse(req.body)

    // Unsubscribe email
    await newsletterModuleService.unsubscribe(validated.email)

    res.status(200).json({
      success: true,
      message: "You have been unsubscribed from our newsletter.",
    })
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
        errors: error.errors,
      })
    }

    // Email not found
    if (error.message?.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: "Email not found in our newsletter list.",
      })
    }

    console.error("Newsletter unsubscribe error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to unsubscribe. Please try again later.",
      error: error.message,
    })
  }
}

