import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "zod"

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional(),
  preferences: z.record(z.any()).optional(),
})

/**
 * POST /store/newsletter/subscribe
 * Public endpoint - no authentication required
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const newsletterModuleService = req.scope.resolve("newsletterModuleService")

  try {
    // Validate input
    const validated = subscribeSchema.parse(req.body)

    // Subscribe email
    const subscription = await newsletterModuleService.subscribe(
      validated.email,
      {
        source: validated.source || "website",
        preferences: validated.preferences,
        metadata: {
          subscribed_at: new Date().toISOString(),
          ip_address: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          user_agent: req.headers["user-agent"],
        },
      }
    )

    res.status(200).json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      subscription: {
        id: subscription.id,
        email: subscription.email,
        status: subscription.status,
      },
    })
  } catch (error) {
    // Handle duplicate email gracefully
    if (error.code === "23505") {
      // PostgreSQL unique constraint violation
      return res.status(200).json({
        success: true,
        message: "You're already subscribed!",
      })
    }

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
        errors: error.errors,
      })
    }

    console.error("Newsletter subscription error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to subscribe. Please try again later.",
      error: error.message,
    })
  }
}

