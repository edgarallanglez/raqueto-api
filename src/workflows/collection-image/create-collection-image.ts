import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

type CreateCollectionImageInput = {
    collection_id: string
    url: string
    file_id: string
    type: "thumbnail" | "banner"
}

const createCollectionImageStep = createStep(
    "create-collection-image",
    async (input: CreateCollectionImageInput, { container }) => {
        const collectionImageModuleService = container.resolve(
            "collectionImageModuleService"
        )

        const image = await collectionImageModuleService.createCollectionImages(input)

        return new StepResponse(image, image.id)
    },
    async (imageId, { container }) => {
        if (!imageId) return

        const collectionImageModuleService = container.resolve(
            "collectionImageModuleService"
        )

        await collectionImageModuleService.deleteCollectionImages(imageId)
    }
)

export const createCollectionImageWorkflow = createWorkflow(
    "create-collection-image",
    (input: CreateCollectionImageInput) => {
        const image = createCollectionImageStep(input)
        return new WorkflowResponse(image)
    }
)
