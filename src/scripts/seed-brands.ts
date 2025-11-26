import { Modules } from "@medusajs/framework/utils"

/**
 * Seed Initial Brands
 * 
 * Run with: npx medusa exec ./src/scripts/seed-brands.ts
 */

const brands = [
  // Tennis Brands
  {
    name: "Yonex",
    slug: "yonex",
    description: "Japanese racquet sports equipment manufacturer, known for innovation and quality",
    logo_url: "/brands/yonex-logo.png",
    website_url: "https://yonex.com",
    sports: ["tennis", "badminton"],
    country: "Japan",
    metadata: {
      founded: "1946",
      headquarters: "Tokyo, Japan",
    },
  },
  {
    name: "Wilson",
    slug: "wilson",
    description: "American sports equipment manufacturer with a rich tennis heritage",
    logo_url: "/brands/wilson-logo.png",
    website_url: "https://wilson.com",
    sports: ["tennis", "padel"],
    country: "USA",
    metadata: {
      founded: "1913",
      headquarters: "Chicago, USA",
    },
  },
  {
    name: "Head",
    slug: "head",
    description: "Austrian sports equipment manufacturer, official supplier of professional tours",
    logo_url: "/brands/head-logo.png",
    website_url: "https://head.com",
    sports: ["tennis", "padel"],
    country: "Austria",
    metadata: {
      founded: "1950",
      headquarters: "Amsterdam, Netherlands",
    },
  },
  {
    name: "Babolat",
    slug: "babolat",
    description: "French tennis equipment manufacturer, pioneer in string technology",
    logo_url: "/brands/babolat-logo.png",
    website_url: "https://babolat.com",
    sports: ["tennis", "padel"],
    country: "France",
    metadata: {
      founded: "1875",
      headquarters: "Lyon, France",
    },
  },
  {
    name: "Prince",
    slug: "prince",
    description: "American tennis equipment brand with innovative racquet designs",
    logo_url: "/brands/prince-logo.png",
    website_url: "https://princetennis.com",
    sports: ["tennis"],
    country: "USA",
    metadata: {
      founded: "1970",
    },
  },
  
  // Padel Brands
  {
    name: "Bullpadel",
    slug: "bullpadel",
    description: "Leading Spanish padel equipment brand, official World Padel Tour supplier",
    logo_url: "/brands/bullpadel-logo.png",
    website_url: "https://bullpadel.com",
    sports: ["padel"],
    country: "Spain",
    metadata: {
      founded: "1995",
      headquarters: "Valencia, Spain",
    },
  },
  {
    name: "Nox",
    slug: "nox",
    description: "Spanish padel equipment brand known for innovation and pro player endorsements",
    logo_url: "/brands/nox-logo.png",
    website_url: "https://noxpadel.com",
    sports: ["padel"],
    country: "Spain",
    metadata: {
      founded: "2009",
      headquarters: "Madrid, Spain",
    },
  },
  {
    name: "Dunlop",
    slug: "dunlop",
    description: "British sports equipment brand with strong presence in padel",
    logo_url: "/brands/dunlop-logo.png",
    website_url: "https://dunlop.com",
    sports: ["tennis", "padel"],
    country: "United Kingdom",
    metadata: {
      founded: "1910",
    },
  },
  
  // Golf Brands (for future)
  {
    name: "Callaway",
    slug: "callaway",
    description: "American golf equipment manufacturer",
    logo_url: "/brands/callaway-logo.png",
    website_url: "https://callawaygolf.com",
    sports: ["golf"],
    country: "USA",
    metadata: {
      founded: "1982",
      headquarters: "Carlsbad, California",
    },
  },
  {
    name: "TaylorMade",
    slug: "taylormade",
    description: "American golf equipment company",
    logo_url: "/brands/taylormade-logo.png",
    website_url: "https://taylormadegolf.com",
    sports: ["golf"],
    country: "USA",
    metadata: {
      founded: "1979",
    },
  },
  {
    name: "Titleist",
    slug: "titleist",
    description: "American golf equipment brand, leader in golf balls and clubs",
    logo_url: "/brands/titleist-logo.png",
    website_url: "https://titleist.com",
    sports: ["golf"],
    country: "USA",
    metadata: {
      founded: "1932",
    },
  },
]

export default async function seedBrands({ container }) {
  const brandModuleService = container.resolve("brandModuleService")
  
  console.log("🌱 Seeding brands...")
  
  try {
    // Check if brands already exist
    const existingBrands = await brandModuleService.listBrands()
    
    if (existingBrands.length > 0) {
      console.log(`⚠️  Found ${existingBrands.length} existing brands. Skipping seed.`)
      console.log("   To re-seed, delete brands first.")
      return
    }
    
    // Create brands
    for (const brand of brands) {
      await brandModuleService.createBrands(brand)
      console.log(`  ✅ Created: ${brand.name} (${brand.sports.join(", ")})`)
    }
    
    console.log(`\n✨ Successfully seeded ${brands.length} brands!`)
    console.log("\nBrands by sport:")
    console.log(`  🎾 Tennis: ${brands.filter(b => b.sports.includes("tennis")).length}`)
    console.log(`  🏓 Padel: ${brands.filter(b => b.sports.includes("padel")).length}`)
    console.log(`  ⛳ Golf: ${brands.filter(b => b.sports.includes("golf")).length}`)
    
  } catch (error) {
    console.error("❌ Error seeding brands:", error)
    throw error
  }
}

