import CollectionImage from "./models/collection-image"

export const linkable = {
    collectionImage: {
        id: {
            linkable: "collection_image_id",
            primaryKey: "id",
            serviceName: "collectionImageModuleService",
            field: "collectionImage",
        },
    },
}
