import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BRAND_MODULE } from "../modules/brand"
import BrandModuleService from "../modules/brand/service"

export type CreateBrandStepInput = {
  name: string
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

export const createBrandStep = createStep(
  "create-brand-step",
  async (input: CreateBrandStepInput, { container }) => {
    const brandModuleService: BrandModuleService = container.resolve(
      BRAND_MODULE
    )

    // Ensure slug is generated if not provided
    const brandData = {
      ...input,
      slug: input.slug || generateSlug(input.name),
    }

    const brand = await brandModuleService.createBrands(brandData as any)

    return new StepResponse(brand, brand.id)
  },
  async (id: string, { container }) => {
    const brandModuleService: BrandModuleService = container.resolve(
      BRAND_MODULE
    )

    await brandModuleService.deleteBrands(id)
  }
)

type CreateBrandWorkflowInput = {
  name: string
  slug?: string
  description?: string
  logo_url?: string
  website_url?: string
  sports?: string[]
  country?: string
  metadata?: Record<string, unknown>
}

export const createBrandWorkflow = createWorkflow(
  "create-brand",
  (input: CreateBrandWorkflowInput) => {
    const brand = createBrandStep(input)

    return new WorkflowResponse(brand)
  }
)

