import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * DELETE /admin/collections/:id/images/:image_id
 * 
 * Delete a collection image and its link
 */
export async function DELETE(
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) {
    const { id: collectionId, image_id: imageId } = req.params

    const collectionImageModuleService = req.scope.resolve(
        "collectionImageModuleService"
    )
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    // Dismiss the link first
    await remoteLink.dismiss({
        [Modules.PRODUCT]: {
            product_collection_id: collectionId,
        },
        collectionImageModuleService: {
            collection_image_id: imageId,
        },
    })

    // Delete the image record
    await collectionImageModuleService.deleteCollectionImages(imageId)

    res.json({ success: true })
}
