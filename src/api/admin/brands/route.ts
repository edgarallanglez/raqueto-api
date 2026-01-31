import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createBrandWorkflow } from "../../../workflows/create-brand"
import { z } from "@medusajs/framework/zod"
import { PostAdminCreateBrand } from "./validators"

type PostAdminCreateBrandType = z.infer<typeof PostAdminCreateBrand>

// GET /admin/brands - List all brands with pagination
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { 
    data: brands, 
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "brand",
    ...req.queryConfig,
  })

  res.json({ 
    brands,
    count,
    limit: take,
    offset: skip,
  })
}

// POST /admin/brands - Create a new brand
export async function POST(
  req: MedusaRequest<PostAdminCreateBrandType>,
  res: MedusaResponse
) {
  const { result } = await createBrandWorkflow(req.scope)
    .run({
      input: req.validatedBody,
    })

  res.json({ brand: result })
}

