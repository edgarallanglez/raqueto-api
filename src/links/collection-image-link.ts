import { defineLink } from "@medusajs/framework/utils"
import CollectionImageModule from "../modules/collection-image"
import ProductModule from "@medusajs/medusa/product"

/**
 * Link between Product Collection and Collection Images
 * 
 * Allows retrieving collection images when fetching collections
 * One collection can have multiple images (isList: true)
 */
export default defineLink(
    ProductModule.linkable.productCollection,
    {
        linkable: CollectionImageModule.linkable.collectionImage,
        isList: true,
    }
)

