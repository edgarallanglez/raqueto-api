import { MedusaService } from "@medusajs/framework/utils"
import Brand from "./models/brand"

/**
 * Brand Module Service
 * 
 * Automatically provides CRUD operations:
 * - createBrands
 * - updateBrands
 * - retrieveBrand
 * - listBrands
 * - listAndCountBrands
 * - deleteBrands
 */
class BrandModuleService extends MedusaService({
  Brand,
}) {
  // Custom methods can be added here if needed
  
  /**
   * Find brand by slug
   */
  async retrieveBrandBySlug(slug: string) {
    const [brand] = await this.listBrands({
      slug,
    })
    
    return brand
  }
  
  /**
   * Get brands by sport
   */
  async listBrandsBySport(sport: string) {
    const brands = await this.listBrands()
    
    return brands.filter(brand => {
      if (!brand.sports) return false
      return Array.isArray(brand.sports) && brand.sports.includes(sport)
    })
  }
}

export default BrandModuleService

