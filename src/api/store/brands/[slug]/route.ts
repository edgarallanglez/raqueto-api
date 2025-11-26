import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

// GET /store/brands/:slug - Get brand by slug (public endpoint)
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { slug } = req.params
  const brandModuleService = req.scope.resolve("brandModuleService")

  try {
    const brand = await brandModuleService.retrieveBrandBySlug(slug)

    if (!brand) {
      return res.status(404).json({
        error: "Not Found",
        message: `Brand with slug "${slug}" not found`,
      })
    }

    res.json({ brand })
  } catch (error) {
    console.error(`Error fetching brand ${slug}:`, error)
    res.status(500).json({
      error: "Failed to fetch brand",
      message: error.message,
    })
  }
}

