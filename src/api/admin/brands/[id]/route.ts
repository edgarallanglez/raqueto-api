import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateBrandWorkflow } from "../../../../workflows/update-brand"
import { deleteBrandWorkflow } from "../../../../workflows/delete-brand"
import { z } from "@medusajs/framework/zod"
import { PostAdminUpdateBrand } from "../validators"

type PostAdminUpdateBrandType = z.infer<typeof PostAdminUpdateBrand>

// GET /admin/brands/:id - Get a single brand
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params

  const { data: brands } = await query.graph({
    entity: "brand",
    fields: ["id", "name", "slug", "description", "logo_url", "website_url", "sports", "country", "metadata"],
    filters: { id },
  })

  if (!brands || brands.length === 0) {
    return res.status(404).json({ message: "Brand not found" })
  }

  res.json({ brand: brands[0] })
}

// POST /admin/brands/:id - Update a brand
export async function POST(
  req: MedusaRequest<PostAdminUpdateBrandType>,
  res: MedusaResponse
) {
  const { id } = req.params

  const { result } = await updateBrandWorkflow(req.scope)
    .run({
      input: {
        id,
        ...req.validatedBody,
      },
    })

  res.json({ brand: result })
}

// DELETE /admin/brands/:id - Delete a brand
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params

  const { result } = await deleteBrandWorkflow(req.scope)
    .run({
      input: { id },
    })

  res.json({ 
    id: result.id,
    object: "brand",
    deleted: true 
  })
}

