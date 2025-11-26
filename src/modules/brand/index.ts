import { Module } from "@medusajs/framework/utils"
import BrandModuleService from "./service"

export const BRAND_MODULE = "brandModuleService"

/**
 * Brand Module
 * 
 * Manages brand information and relationships
 */
export default Module(BRAND_MODULE, {
  service: BrandModuleService,
})

// Export linkable for module links
export * as linkable from "./linkable"

