import { model } from "@medusajs/framework/utils"

/**
 * Brand Data Model
 * 
 * Represents a brand/manufacturer (e.g., Yonex, Wilson, Head)
 * Links to products via module links
 */
const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().searchable(),
  description: model.text().nullable(),
  logo_url: model.text().nullable(),
  website_url: model.text().nullable(),
  
  // Display order (lower numbers appear first)
  order: model.number().nullable(),
  
  // Visibility flag (controls if brand appears in storefront)
  is_active: model.boolean(),
  
  // Sport associations (tennis, padel, golf)
  sports: model.json().nullable(),
  
  // Country of origin
  country: model.text().nullable(),
  
  // Metadata for additional info
  metadata: model.json().nullable(),
})

export default Brand

