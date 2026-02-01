import { model } from "@medusajs/framework/utils"

/**
 * Collection Image Data Model
 * 
 * Represents an image associated with a product collection
 * Supports both thumbnail and banner image types
 */
const CollectionImage = model.define("collection_image", {
    id: model.id().primaryKey(),
    url: model.text(),
    file_id: model.text(),
    type: model.enum(["thumbnail", "banner"]),
    collection_id: model.text(),
})
    .indexes([
        {
            on: ["collection_id", "type"],
            where: "type = 'thumbnail'",
            unique: true,
        },
    ])

export default CollectionImage
