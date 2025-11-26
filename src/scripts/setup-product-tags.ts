import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Setup Product Tags for Multi-Sport Store
 * 
 * Tags are used for:
 * - Gender (when not using categories)
 * - Sport identification
 * - Player level
 * - Surface/court type
 * - Brands
 */
export default async function setupProductTags({ container }: { container: MedusaContainer }) {
  const productModule = container.resolve(Modules.PRODUCT)
  
  console.log("🏷️  Creating product tags...\n")

  const tags = [
    // ==========================================
    // SPORT TAGS (Critical - identifies sport)
    // ==========================================
    { value: "sport:tennis", metadata: { category: "sport", display: "Tennis" } },
    { value: "sport:padel", metadata: { category: "sport", display: "Padel" } },
    { value: "sport:golf", metadata: { category: "sport", display: "Golf", coming_soon: true } },

    // ==========================================
    // GENDER TAGS (For equipment without gender categories)
    // ==========================================
    { value: "gender:men", metadata: { category: "gender", display: "Men's", icon: "👨" } },
    { value: "gender:women", metadata: { category: "gender", display: "Women's", icon: "👩" } },
    { value: "gender:junior", metadata: { category: "gender", display: "Junior", icon: "👶" } },
    { value: "gender:unisex", metadata: { category: "gender", display: "Unisex", icon: "🚻" } },

    // ==========================================
    // PLAYER LEVEL (Universal across sports)
    // ==========================================
    { value: "level:beginner", metadata: { category: "level", display: "Beginner", icon: "🌱" } },
    { value: "level:intermediate", metadata: { category: "level", display: "Intermediate", icon: "📈" } },
    { value: "level:advanced", metadata: { category: "level", display: "Advanced", icon: "⭐" } },
    { value: "level:pro", metadata: { category: "level", display: "Professional", icon: "🏆" } },

    // ==========================================
    // TENNIS - Surface/Court Type
    // ==========================================
    { value: "surface:hard-court", metadata: { category: "surface", sport: "tennis", display: "Hard Court", icon: "🏟️" } },
    { value: "surface:clay-court", metadata: { category: "surface", sport: "tennis", display: "Clay Court", icon: "🟫" } },
    { value: "surface:grass-court", metadata: { category: "surface", sport: "tennis", display: "Grass Court", icon: "🌱" } },
    { value: "surface:all-court", metadata: { category: "surface", sport: "tennis", display: "All Court", icon: "✅" } },

    // ==========================================
    // PADEL - Court Type
    // ==========================================
    { value: "court:indoor-padel", metadata: { category: "court", sport: "padel", display: "Indoor", icon: "🏠" } },
    { value: "court:outdoor-padel", metadata: { category: "court", sport: "padel", display: "Outdoor", icon: "🌤️" } },
    { value: "court:all-weather", metadata: { category: "court", sport: "padel", display: "All Weather", icon: "☀️🌧️" } },

    // ==========================================
    // BRANDS - Multi-Sport
    // ==========================================
    { value: "brand:wilson", metadata: { category: "brand", display: "Wilson", sports: ["tennis", "padel"], country: "🇺🇸" } },
    { value: "brand:head", metadata: { category: "brand", display: "Head", sports: ["tennis", "padel"], country: "🇦🇹" } },
    { value: "brand:nike", metadata: { category: "brand", display: "Nike", sports: ["tennis", "padel", "golf"], country: "🇺🇸" } },
    { value: "brand:adidas", metadata: { category: "brand", display: "Adidas", sports: ["tennis", "padel", "golf"], country: "🇩🇪" } },

    // ==========================================
    // BRANDS - Tennis Specific
    // ==========================================
    { value: "brand:yonex", metadata: { category: "brand", display: "Yonex", sports: ["tennis"], country: "🇯🇵" } },
    { value: "brand:babolat", metadata: { category: "brand", display: "Babolat", sports: ["tennis", "padel"], country: "🇫🇷" } },
    { value: "brand:prince", metadata: { category: "brand", display: "Prince", sports: ["tennis"], country: "🇺🇸" } },
    { value: "brand:tecnifibre", metadata: { category: "brand", display: "Tecnifibre", sports: ["tennis"], country: "🇫🇷" } },
    { value: "brand:dunlop", metadata: { category: "brand", display: "Dunlop", sports: ["tennis", "padel"], country: "🇬🇧" } },

    // ==========================================
    // BRANDS - Padel Specific
    // ==========================================
    { value: "brand:bullpadel", metadata: { category: "brand", display: "Bullpadel", sports: ["padel"], country: "🇪🇸" } },
    { value: "brand:nox", metadata: { category: "brand", display: "Nox", sports: ["padel"], country: "🇪🇸" } },
    { value: "brand:adidas-padel", metadata: { category: "brand", display: "Adidas Padel", sports: ["padel"], country: "🇪🇸" } },
    { value: "brand:starvie", metadata: { category: "brand", display: "StarVie", sports: ["padel"], country: "🇪🇸" } },

    // ==========================================
    // BRANDS - Golf Specific (Future)
    // ==========================================
    { value: "brand:callaway", metadata: { category: "brand", display: "Callaway", sports: ["golf"], country: "🇺🇸", coming_soon: true } },
    { value: "brand:titleist", metadata: { category: "brand", display: "Titleist", sports: ["golf"], country: "🇺🇸", coming_soon: true } },
    { value: "brand:taylormade", metadata: { category: "brand", display: "TaylorMade", sports: ["golf"], country: "🇺🇸", coming_soon: true } },

    // ==========================================
    // PRODUCT FEATURES/STYLES
    // ==========================================
    { value: "feature:lightweight", metadata: { category: "feature", display: "Lightweight" } },
    { value: "feature:power", metadata: { category: "feature", display: "Power Focused" } },
    { value: "feature:control", metadata: { category: "feature", display: "Control Focused" } },
    { value: "feature:spin", metadata: { category: "feature", display: "Spin Enhanced" } },
    { value: "feature:comfort", metadata: { category: "feature", display: "Comfort" } },
    { value: "feature:durability", metadata: { category: "feature", display: "Durable" } },

    // ==========================================
    // SPECIAL COLLECTIONS
    // ==========================================
    { value: "collection:new-arrival", metadata: { category: "collection", display: "New Arrival", icon: "🆕" } },
    { value: "collection:best-seller", metadata: { category: "collection", display: "Best Seller", icon: "🔥" } },
    { value: "collection:sale", metadata: { category: "collection", display: "On Sale", icon: "💰" } },
    { value: "collection:pro-choice", metadata: { category: "collection", display: "Pro's Choice", icon: "⭐" } },
  ]

  console.log(`Creating ${tags.length} tags...\n`)

  let created = 0
  let skipped = 0

  for (const tag of tags) {
    try {
      await productModule.createProductTags(tag)
      console.log(`✅ Created: ${tag.value}`)
      created++
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log(`⏭️  Skipped: ${tag.value} (already exists)`)
        skipped++
      } else {
        console.log(`❌ Error creating ${tag.value}:`, error.message)
      }
    }
  }

  console.log(`\n🎉 Tag setup complete!`)
  console.log(`  Created: ${created}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  Total: ${tags.length}`)

  console.log("\n📝 Tag Categories:")
  console.log("  - Sport: tennis, padel, golf")
  console.log("  - Gender: men, women, junior, unisex")
  console.log("  - Level: beginner, intermediate, advanced, pro")
  console.log("  - Surface/Court: (sport-specific)")
  console.log("  - Brands: 20+ brands across sports")
  console.log("  - Features: lightweight, power, control, spin, etc.")
  console.log("  - Collections: new-arrival, best-seller, sale, pro-choice")
}

