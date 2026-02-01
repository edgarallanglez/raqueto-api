import type {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"

/**
 * GET /store/collections/:id/images
 * 
 * Get images for a collection (public endpoint)
 */
export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const collectionId = req.params.id

    const collectionImageModuleService = req.scope.resolve(
        "collectionImageModuleService"
    )

    const images = await collectionImageModuleService.listCollectionImages({
        collection_id: collectionId,
    })

    res.json({ images })
}
