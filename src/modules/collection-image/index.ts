import { Module } from "@medusajs/framework/utils"
import CollectionImageModuleService from "./service"

export const COLLECTION_IMAGE_MODULE = "collectionImageModuleService"

/**
 * Collection Image Module
 * 
 * Manages collection images and their relationships
 */
export default Module(COLLECTION_IMAGE_MODULE, {
    service: CollectionImageModuleService,
})

// Export linkable for module links
export * as linkable from "./linkable"
