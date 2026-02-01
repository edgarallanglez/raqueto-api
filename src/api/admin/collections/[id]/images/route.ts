import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

type CollectionImageInput = {
    url: string
    file_id: string
    type: "thumbnail" | "banner"
}

/**
 * POST /admin/collections/:id/images
 * 
 * Create collection images and link them to the collection
 */
export async function POST(
    req: AuthenticatedMedusaRequest<{ images: CollectionImageInput[] }>,
    res: MedusaResponse
) {
    const collectionId = req.params.id
    const { images } = req.body

    if (!images || !Array.isArray(images) || images.length === 0) {
        throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Images array is required"
        )
    }

    const collectionImageModuleService = req.scope.resolve(
        "collectionImageModuleService"
    )
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    // Create images with collection_id
    const createdImages = await collectionImageModuleService.createCollectionImages(
        images.map((img) => ({
            ...img,
            collection_id: collectionId,
        }))
    )

    // Create links between collection and images
    const imageArray = Array.isArray(createdImages) ? createdImages : [createdImages]
    await remoteLink.create(
        imageArray.map((image: any) => ({
            [Modules.PRODUCT]: {
                product_collection_id: collectionId,
            },
            collectionImageModuleService: {
                collection_image_id: image.id,
            },
        }))
    )

    res.json({ images: imageArray })
}

/**
 * GET /admin/collections/:id/images
 * 
 * List collection images
 */
export async function GET(
    req: AuthenticatedMedusaRequest,
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


