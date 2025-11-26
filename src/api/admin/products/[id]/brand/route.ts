import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { BRAND_MODULE } from "../../../../../modules/brand"

// GET /admin/products/:id/brand - Get product's brand
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Query product with brand relationship
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "brand.*"],
      filters: { id },
    })

    if (!products || products.length === 0 || !products[0].brand) {
      return res.json({ brand: null })
    }

    res.json({ brand: products[0].brand })
  } catch (error) {
    console.error("Error fetching product brand:", error)
    res.status(500).json({ error: "Failed to fetch product brand" })
  }
}

// POST /admin/products/:id/brand - Link product to brand
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id: product_id } = req.params
  const { brand_id } = req.body as { brand_id: string }

  console.log("[Brand Link] Linking product:", product_id, "to brand:", brand_id)

  if (!brand_id) {
    return res.status(400).json({ error: "brand_id is required" })
  }

  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Check if product already has a brand linked
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "brand.id"],
      filters: { id: product_id },
    })

    const existingBrand = products?.[0]?.brand

    // If there's an existing brand, dismiss it first
    if (existingBrand) {
      console.log("[Brand Link] Dismissing existing brand:", existingBrand.id)
      await remoteLink.dismiss({
        [Modules.PRODUCT]: {
          product_id: product_id,
        },
        [BRAND_MODULE]: {
          brand_id: existingBrand.id,
        },
      })
    }

    // Create new link between product and brand
    console.log("[Brand Link] Creating link - product:", product_id, "brand:", brand_id)
    
    await remoteLink.create({
      [Modules.PRODUCT]: {
        product_id: product_id,
      },
      [BRAND_MODULE]: {
        brand_id: brand_id,
      },
    })
    
    console.log("[Brand Link] Link created successfully")

    // Fetch the brand to return
    const { data: brands } = await query.graph({
      entity: "brand",
      fields: ["id", "name", "slug", "description", "sports"],
      filters: { id: brand_id },
    })

    res.json({ 
      success: true,
      brand: brands[0] 
    })
  } catch (error: any) {
    console.error("[Brand Link] Error linking product to brand:", error)
    console.error("[Brand Link] Error details:", error.message, error.stack)
    res.status(500).json({ 
      error: "Failed to link product to brand",
      details: error.message 
    })
  }
}

// DELETE /admin/products/:id/brand - Remove brand from product
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id: product_id } = req.params
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // First, get the current brand linked to this product
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "brand.id"],
      filters: { id: product_id },
    })

    if (!products || products.length === 0 || !products[0].brand) {
      return res.json({ 
        success: true,
        message: "No brand linked to this product" 
      })
    }

    const brand_id = products[0].brand.id

    // Remove the link between product and brand
    await remoteLink.dismiss({
      [Modules.PRODUCT]: {
        product_id: product_id,
      },
      [BRAND_MODULE]: {
        brand_id: brand_id,
      },
    })

    res.json({ 
      success: true,
      message: "Brand removed from product" 
    })
  } catch (error) {
    console.error("Error removing brand from product:", error)
    res.status(500).json({ error: "Failed to remove brand from product" })
  }
}

