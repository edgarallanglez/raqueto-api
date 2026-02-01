import { MedusaService } from "@medusajs/framework/utils"
import CollectionImage from "./models/collection-image"

/**
 * Collection Image Module Service
 * 
 * Provides CRUD operations for collection images
 */
class CollectionImageModuleService extends MedusaService({
    CollectionImage,
}) { }

export default CollectionImageModuleService
