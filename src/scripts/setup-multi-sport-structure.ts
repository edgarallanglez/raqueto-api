import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Setup Multi-Sport Category Structure
 * 
 * Strategy:
 * - Equipment (racquets) → Use gender TAGS (no category subdivision)
 * - Apparel/Shoes → Use gender CATEGORIES (physical sizing matters)
 * - Accessories → Mixed (case by case)
 */
export default async function setupMultiSportStructure({ container }: { container: MedusaContainer }) {
  const productCategoryModule = container.resolve(Modules.PRODUCT)
  
  console.log("🏗️  Setting up multi-sport category structure...\n")

  // ==========================================
  // TENNIS STRUCTURE
  // ==========================================
  console.log("🎾 Creating Tennis categories...")
  
  const tennisRoot = await productCategoryModule.createProductCategories({
    name: "Tennis",
    handle: "tennis",
    is_active: true,
    is_internal: false,
    metadata: {
      sport: "tennis",
      icon: "🎾",
      description: "Complete tennis equipment and apparel"
    }
  })
  console.log("✅ Created: Tennis (root)")

  // Tennis Racquets - NO gender subcategories (use tags)
  const tennisRacquets = await productCategoryModule.createProductCategories({
    name: "Tennis Racquets",
    handle: "tennis-racquets",
    parent_category_id: tennisRoot.id,
    is_active: true,
    metadata: {
      use_gender_tags: true,
      product_type: "equipment",
      description: "Filter by gender using tags"
    }
  })
  console.log("✅ Created: Tennis Racquets (gender via tags)")

  // Tennis Shoes - WITH gender subcategories (sizing matters)
  const tennisShoes = await productCategoryModule.createProductCategories({
    name: "Tennis Shoes",
    handle: "tennis-shoes",
    parent_category_id: tennisRoot.id,
    is_active: true,
    metadata: {
      use_gender_categories: true,
      product_type: "footwear"
    }
  })
  console.log("✅ Created: Tennis Shoes")

  const tennisShoesMens = await productCategoryModule.createProductCategories({
    name: "Men's Tennis Shoes",
    handle: "tennis-shoes-mens",
    parent_category_id: tennisShoes.id,
    is_active: true,
    metadata: { gender: "men" }
  })
  console.log("  ✅ Created: Men's Tennis Shoes")

  const tennisShoesWomens = await productCategoryModule.createProductCategories({
    name: "Women's Tennis Shoes",
    handle: "tennis-shoes-womens",
    parent_category_id: tennisShoes.id,
    is_active: true,
    metadata: { gender: "women" }
  })
  console.log("  ✅ Created: Women's Tennis Shoes")

  const tennisShoesKids = await productCategoryModule.createProductCategories({
    name: "Kids Tennis Shoes",
    handle: "tennis-shoes-kids",
    parent_category_id: tennisShoes.id,
    is_active: true,
    metadata: { gender: "junior" }
  })
  console.log("  ✅ Created: Kids Tennis Shoes")

  // Tennis Apparel - WITH gender subcategories (fit/cut matters)
  const tennisApparel = await productCategoryModule.createProductCategories({
    name: "Tennis Apparel",
    handle: "tennis-apparel",
    parent_category_id: tennisRoot.id,
    is_active: true,
    metadata: {
      use_gender_categories: true,
      product_type: "apparel"
    }
  })
  console.log("✅ Created: Tennis Apparel")

  const tennisApparelMens = await productCategoryModule.createProductCategories({
    name: "Men's Tennis Apparel",
    handle: "tennis-apparel-mens",
    parent_category_id: tennisApparel.id,
    is_active: true,
    metadata: { gender: "men" }
  })
  console.log("  ✅ Created: Men's Tennis Apparel")

  const tennisApparelWomens = await productCategoryModule.createProductCategories({
    name: "Women's Tennis Apparel",
    handle: "tennis-apparel-womens",
    parent_category_id: tennisApparel.id,
    is_active: true,
    metadata: { gender: "women" }
  })
  console.log("  ✅ Created: Women's Tennis Apparel")

  const tennisApparelUnisex = await productCategoryModule.createProductCategories({
    name: "Unisex Tennis Apparel",
    handle: "tennis-apparel-unisex",
    parent_category_id: tennisApparel.id,
    is_active: true,
    metadata: { gender: "unisex" }
  })
  console.log("  ✅ Created: Unisex Tennis Apparel")

  // Tennis Accessories - NO gender (use tags)
  const tennisAccessories = await productCategoryModule.createProductCategories({
    name: "Tennis Accessories",
    handle: "tennis-accessories",
    parent_category_id: tennisRoot.id,
    is_active: true,
    metadata: {
      use_gender_tags: true,
      product_type: "accessories"
    }
  })
  console.log("✅ Created: Tennis Accessories (gender via tags)\n")

  // ==========================================
  // PADEL STRUCTURE
  // ==========================================
  console.log("🏓 Creating Padel categories...")
  
  const padelRoot = await productCategoryModule.createProductCategories({
    name: "Padel",
    handle: "padel",
    is_active: true,
    is_internal: false,
    metadata: {
      sport: "padel",
      icon: "🏓",
      description: "Complete padel equipment and apparel"
    }
  })
  console.log("✅ Created: Padel (root)")

  // Padel Rackets - NO gender subcategories (use tags)
  const padelRackets = await productCategoryModule.createProductCategories({
    name: "Padel Rackets",
    handle: "padel-rackets",
    parent_category_id: padelRoot.id,
    is_active: true,
    metadata: {
      use_gender_tags: true,
      product_type: "equipment"
    }
  })
  console.log("✅ Created: Padel Rackets (gender via tags)")

  // Padel Shoes - WITH gender subcategories
  const padelShoes = await productCategoryModule.createProductCategories({
    name: "Padel Shoes",
    handle: "padel-shoes",
    parent_category_id: padelRoot.id,
    is_active: true,
    metadata: {
      use_gender_categories: true,
      product_type: "footwear"
    }
  })
  console.log("✅ Created: Padel Shoes")

  await productCategoryModule.createProductCategories({
    name: "Men's Padel Shoes",
    handle: "padel-shoes-mens",
    parent_category_id: padelShoes.id,
    is_active: true,
    metadata: { gender: "men" }
  })
  console.log("  ✅ Created: Men's Padel Shoes")

  await productCategoryModule.createProductCategories({
    name: "Women's Padel Shoes",
    handle: "padel-shoes-womens",
    parent_category_id: padelShoes.id,
    is_active: true,
    metadata: { gender: "women" }
  })
  console.log("  ✅ Created: Women's Padel Shoes")

  await productCategoryModule.createProductCategories({
    name: "Kids Padel Shoes",
    handle: "padel-shoes-kids",
    parent_category_id: padelShoes.id,
    is_active: true,
    metadata: { gender: "junior" }
  })
  console.log("  ✅ Created: Kids Padel Shoes")

  // Padel Apparel - WITH gender subcategories
  const padelApparel = await productCategoryModule.createProductCategories({
    name: "Padel Apparel",
    handle: "padel-apparel",
    parent_category_id: padelRoot.id,
    is_active: true,
    metadata: {
      use_gender_categories: true,
      product_type: "apparel"
    }
  })
  console.log("✅ Created: Padel Apparel")

  await productCategoryModule.createProductCategories({
    name: "Men's Padel Apparel",
    handle: "padel-apparel-mens",
    parent_category_id: padelApparel.id,
    is_active: true,
    metadata: { gender: "men" }
  })
  console.log("  ✅ Created: Men's Padel Apparel")

  await productCategoryModule.createProductCategories({
    name: "Women's Padel Apparel",
    handle: "padel-apparel-womens",
    parent_category_id: padelApparel.id,
    is_active: true,
    metadata: { gender: "women" }
  })
  console.log("  ✅ Created: Women's Padel Apparel")

  await productCategoryModule.createProductCategories({
    name: "Unisex Padel Apparel",
    handle: "padel-apparel-unisex",
    parent_category_id: padelApparel.id,
    is_active: true,
    metadata: { gender: "unisex" }
  })
  console.log("  ✅ Created: Unisex Padel Apparel")

  // Padel Accessories - NO gender (use tags)
  const padelAccessories = await productCategoryModule.createProductCategories({
    name: "Padel Accessories",
    handle: "padel-accessories",
    parent_category_id: padelRoot.id,
    is_active: true,
    metadata: {
      use_gender_tags: true,
      product_type: "accessories"
    }
  })
  console.log("✅ Created: Padel Accessories (gender via tags)\n")

  // ==========================================
  // GOLF (Coming Soon)
  // ==========================================
  console.log("⛳ Creating Golf category (coming soon)...")
  
  await productCategoryModule.createProductCategories({
    name: "Golf",
    handle: "golf",
    is_active: false,
    is_internal: false,
    metadata: {
      sport: "golf",
      icon: "⛳",
      coming_soon: true,
      description: "Golf equipment and apparel - launching soon!"
    }
  })
  console.log("✅ Created: Golf (inactive, coming soon)\n")

  console.log("🎉 Multi-sport structure created successfully!")
  console.log("\n📝 Summary:")
  console.log("  - Equipment (racquets/rackets): Gender via TAGS")
  console.log("  - Apparel/Shoes: Gender via CATEGORIES")
  console.log("  - Accessories: Gender via TAGS")
}

