/**
 * Add slug column to brand table
 * 
 * Run with: npx medusa exec ./src/scripts/add-slug-column.ts
 */

export default async function addSlugColumn({ container }) {
  const brandModuleService = container.resolve("brandModuleService")
  
  console.log("🔧 Adding slug column to brand table...")
  
  try {
    // Access the entity manager directly from the module service
    const manager = (brandModuleService as any).__container__.resolve("manager")
    
    // Check if slug column exists
    const result = await manager.execute(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='brand' AND column_name='slug';
    `)
    
    if (result.length > 0) {
      console.log("  ⚠️  Slug column already exists!")
      return
    }
    
    // Add slug column
    await manager.execute(`
      ALTER TABLE brand 
      ADD COLUMN slug text;
    `)
    console.log("  ✅ Added slug column")
    
    // Update existing records to have a slug based on name
    await manager.execute(`
      UPDATE brand 
      SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'))
      WHERE slug IS NULL;
    `)
    console.log("  ✅ Updated existing records with slugs")
    
    // Make slug NOT NULL
    await manager.execute(`
      ALTER TABLE brand 
      ALTER COLUMN slug SET NOT NULL;
    `)
    console.log("  ✅ Made slug column NOT NULL")
    
    console.log("\n✨ Slug column added successfully!")
    console.log("   You can now run: npx medusa exec ./src/scripts/seed-brands.ts")
    
  } catch (error) {
    console.error("❌ Error adding slug column:", error)
    throw error
  }
}

