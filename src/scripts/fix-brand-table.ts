/**
 * Fix Brand Table - Drop and Recreate
 * 
 * Run with: npx medusa exec ./src/scripts/fix-brand-table.ts
 */

export default async function fixBrandTable({ container }) {
  const  manager = container.resolve("manager")
  
  console.log("🔧 Fixing brand table...")
  
  try {
    // Drop the existing brand table
    await manager.execute(`DROP TABLE IF EXISTS brand CASCADE;`)
    console.log("  ✅ Dropped old brand table")
    
    // Recreate it with the correct schema
    await manager.execute(`
      CREATE TABLE brand (
        id text NOT NULL,
        name text NOT NULL,
        slug text NOT NULL,
        description text NULL,
        logo_url text NULL,
        website_url text NULL,
        sports jsonb NULL,
        country text NULL,
        metadata jsonb NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL,
        CONSTRAINT brand_pkey PRIMARY KEY (id)
      );
    `)
    console.log("  ✅ Created new brand table with slug column")
    
    // Create index
    await manager.execute(`
      CREATE INDEX IF NOT EXISTS IDX_brand_deleted_at 
      ON brand (deleted_at) 
      WHERE deleted_at IS NULL;
    `)
    console.log("  ✅ Created index")
    
    // Drop and recreate the product-brand link table
    await manager.execute(`DROP TABLE IF EXISTS product_product_brandmodule_brand CASCADE;`)
    await manager.execute(`
      CREATE TABLE product_product_brandmodule_brand (
        id text NOT NULL,
        product_id text NOT NULL,
        brand_id text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL,
        CONSTRAINT product_product_brandmodule_brand_pkey PRIMARY KEY (id)
      );
    `)
    console.log("  ✅ Recreated product-brand link table")
    
    console.log("\n✨ Brand table fixed successfully!")
    console.log("   You can now run: npx medusa exec ./src/scripts/seed-brands.ts")
    
  } catch (error) {
    console.error("❌ Error fixing brand table:", error)
    throw error
  }
}

