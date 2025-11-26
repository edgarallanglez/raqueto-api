import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BRAND_MODULE } from "../modules/brand"
import BrandModuleService from "../modules/brand/service"

export type UpdateBrandStepInput = {
  id: string
  name?: string
  slug?: string
  description?: string
  logo_url?: string
  website_url?: string
  sports?: string[]
  country?: string
  metadata?: Record<string, unknown>
}

// Helper to generate slug from name
const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const updateBrandStep = createStep(
  "update-brand-step",
  async (input: UpdateBrandStepInput, { container }) => {
    const brandModuleService: BrandModuleService = container.resolve(
      BRAND_MODULE
    )

    // Get original brand for compensation
    const originalBrand = await brandModuleService.retrieveBrand(input.id)

    // If name is being updated, update slug too
    const updateData = { ...input }
    if (input.name && !input.slug) {
      updateData.slug = generateSlug(input.name)
    }

    const brand = await brandModuleService.updateBrands(updateData as any)

    return new StepResponse(brand, originalBrand)
  },
  async (originalBrand: any, { container }) => {
    const brandModuleService: BrandModuleService = container.resolve(
      BRAND_MODULE
    )

    // Restore original brand data
    await brandModuleService.updateBrands({
      id: originalBrand.id,
      name: originalBrand.name,
      slug: originalBrand.slug,
      description: originalBrand.description,
      logo_url: originalBrand.logo_url,
      website_url: originalBrand.website_url,
      sports: originalBrand.sports,
      country: originalBrand.country,
      metadata: originalBrand.metadata,
    })
  }
)

type UpdateBrandWorkflowInput = {
  id: string
  name?: string
  slug?: string
  description?: string
  logo_url?: string
  website_url?: string
  sports?: string[]
  country?: string
  metadata?: Record<string, unknown>
}

export const updateBrandWorkflow = createWorkflow(
  "update-brand",
  (input: UpdateBrandWorkflowInput) => {
    const brand = updateBrandStep(input)

    return new WorkflowResponse(brand)
  }
)

