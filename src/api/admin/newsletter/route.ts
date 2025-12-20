import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

/**
 * GET /admin/newsletter
 * List all newsletter subscriptions (admin only)
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const newsletterModuleService = req.scope.resolve("newsletterModuleService")

  try {
    const { limit = 50, offset = 0, status } = req.query

    const filters: any = {}
    if (status) {
      filters.status = status
    }

    const [subscriptions, count] = await newsletterModuleService.listAndCountNewsletterSubscriptions(
      filters,
      {
        skip: Number(offset),
        take: Number(limit),
        order: {
          created_at: "DESC",
        },
      }
    )

    res.json({
      subscriptions,
      count,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error) {
    console.error("Error fetching newsletter subscriptions:", error)
    res.status(500).json({
      error: "Failed to fetch subscriptions",
      message: error.message,
    })
  }
}

/**
 * POST /admin/newsletter
 * Manually add a subscription (admin only)
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const newsletterModuleService = req.scope.resolve("newsletterModuleService")

  try {
    const { email, source, preferences } = req.body as {
      email?: string
      source?: string
      preferences?: Record<string, any>
    }

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      })
    }

    const subscription = await newsletterModuleService.subscribe(email, {
      source: source || "admin",
      preferences,
    })

    res.status(201).json({
      subscription,
    })
  } catch (error) {
    console.error("Error creating subscription:", error)
    res.status(500).json({
      error: "Failed to create subscription",
      message: error.message,
    })
  }
}

