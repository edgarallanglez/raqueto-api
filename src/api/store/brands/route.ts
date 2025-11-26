import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

// GET /store/brands - List all brands (public endpoint)
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brandModuleService = req.scope.resolve("brandModuleService")
  
  try {
    const [brands, count] = await brandModuleService.listAndCountBrands(
      {
        is_active: true,  // Only return active brands for storefront
      },
      {
        select: [
          "id",
          "name",
          "slug",
          "description",
          "logo_url",
          "website_url",
          "order",
          "is_active",
          "sports",
          "country",
        ],
        order: {
          order: "ASC",  // Sort by order field (ascending)
        },
      }
    )

    res.json({
      brands,
      count,
    })
  } catch (error) {
    console.error("Error fetching brands:", error)
    res.status(500).json({
      error: "Failed to fetch brands",
      message: error.message,
    })
  }
}

