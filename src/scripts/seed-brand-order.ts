import { MedusaContainer } from "@medusajs/framework"

/**
 * Script to set default order values for existing brands
 * Run: npx medusa exec ./src/scripts/seed-brand-order.ts
 */
export default async ({ container }: { container: MedusaContainer }) => {
  const brandModuleService = container.resolve("brandModuleService")

  console.log("🔄 Fetching all brands...")

  const brands = await brandModuleService.listBrands({})

  if (!brands || brands.length === 0) {
    console.log("ℹ️  No brands found in the database.")
    return
  }

  console.log(`✅ Found ${brands.length} brands. Setting default order values...`)

  for (const brand of brands) {
    // Only update if order is null
    if (brand.order === null || brand.order === undefined) {
      await brandModuleService.updateBrands({
        id: brand.id,
        order: 999,
      })
      console.log(`  ✅ Set order=999 for brand: ${brand.name} (${brand.id})`)
    } else {
      console.log(`  ⏭️  Skipped ${brand.name} - already has order=${brand.order}`)
    }
  }

  console.log("\n✅ All brands have been updated with default order values!")
  console.log("💡 You can now customize the order in the Medusa Admin.")
}

