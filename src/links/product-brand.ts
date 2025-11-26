import BrandModule from "../modules/brand"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

/**
 * Product <> Brand Link
 * 
 * Establishes a many-to-one relationship:
 * - Many products can belong to one brand
 * - One brand can have many products
 * 
 * Example:
 * - Product: "Ezone 98" -> Brand: "Yonex"
 * - Product: "Ezone 100" -> Brand: "Yonex"
 */
export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true, // One brand can have many products
  },
  BrandModule.linkable.brand
)

