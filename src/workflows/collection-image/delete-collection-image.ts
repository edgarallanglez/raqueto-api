import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows"

type DeleteCollectionImageInput = {
    id: string
}

const deleteCollectionImageStep = createStep(
    "delete-collection-image",
    async (input: DeleteCollectionImageInput, { container }) => {
        const collectionImageModuleService = container.resolve(
            "collectionImageModuleService"
        )

        const image = await collectionImageModuleService.retrieveCollectionImage(
            input.id
        )

        await collectionImageModuleService.deleteCollectionImages(input.id)

        return new StepResponse({ file_id: image.file_id }, image)
    },
    async (image, { container }) => {
        if (!image) return

        const collectionImageModuleService = container.resolve(
            "collectionImageModuleService"
        )

        await collectionImageModuleService.createCollectionImages(image)
    }
)

export const deleteCollectionImageWorkflow = createWorkflow(
    "delete-collection-image",
    (input: DeleteCollectionImageInput) => {
        const { file_id } = deleteCollectionImageStep(input)

        deleteFilesWorkflow.runAsStep({
            input: {
                ids: [file_id],
            },
        })

        return new WorkflowResponse({ success: true })
    }
)
