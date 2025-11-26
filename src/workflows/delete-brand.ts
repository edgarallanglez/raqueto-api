import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BRAND_MODULE } from "../modules/brand"
import BrandModuleService from "../modules/brand/service"

export type DeleteBrandStepInput = {
  id: string
}

export const deleteBrandStep = createStep(
  "delete-brand-step",
  async (input: DeleteBrandStepInput, { container }) => {
    const brandModuleService: BrandModuleService = container.resolve(
      BRAND_MODULE
    )

    // Get brand data before deletion for compensation
    const brand = await brandModuleService.retrieveBrand(input.id)

    await brandModuleService.deleteBrands(input.id)

    return new StepResponse({ id: input.id }, brand)
  },
  async (brand: any, { container }) => {
    const brandModuleService: BrandModuleService = container.resolve(
      BRAND_MODULE
    )

    // Recreate the brand if deletion needs to be rolled back
    await brandModuleService.createBrands({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      logo_url: brand.logo_url,
      website_url: brand.website_url,
      sports: brand.sports,
      country: brand.country,
      metadata: brand.metadata,
    })
  }
)

type DeleteBrandWorkflowInput = {
  id: string
}

export const deleteBrandWorkflow = createWorkflow(
  "delete-brand",
  (input: DeleteBrandWorkflowInput) => {
    const result = deleteBrandStep(input)

    return new WorkflowResponse(result)
  }
)

