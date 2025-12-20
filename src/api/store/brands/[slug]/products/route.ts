import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params
  const brandModuleService = req.scope.resolve("brandModuleService")
  const pgConnection = req.scope.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  ) as any

  try {
    const brand = await brandModuleService.retrieveBrandBySlug(slug)

    if (!brand) {
      return res.status(404).json({
        error: "Not Found",
        message: `Brand with slug "${slug}" not found`,
      })
    }

    const rows = await pgConnection("product_product_brandmodule_brand")
      .select("product_id")
      .where({ brand_id: brand.id })
      .whereNull("deleted_at")

    const product_ids = (rows || []).map((r: any) => r.product_id).filter(Boolean)

    return res.json({
      brand,
      product_ids,
      count: product_ids.length,
    })
  } catch (error: any) {
    console.error(`Error fetching products for brand ${slug}:`, error)
    return res.status(500).json({
      error: "Failed to fetch brand products",
      message: error?.message,
    })
  }
}
