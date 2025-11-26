# Brand Module for MedusaJS

Custom module for managing product brands in a multi-sport ecommerce platform.

## Features

- ✅ Brand CRUD operations (automatic via MedusaService)
- ✅ Link brands to products (many-to-one relationship)
- ✅ Sport-specific brand filtering (tennis, padel, golf)
- ✅ Brand metadata support
- ✅ Searchable brand slugs

## Data Model

```typescript
Brand {
  id: string              // Auto-generated UUID
  name: string            // Brand name (e.g., "Yonex")
  slug: string            // URL-friendly slug (e.g., "yonex")
  description?: string    // Brand description
  logo_url?: string       // Logo image URL
  website_url?: string    // Official website
  sports?: string[]       // ["tennis", "padel", "golf"]
  country?: string        // Country of origin
  metadata?: object       // Additional data
}
```

## Automatic Methods

The module service automatically provides:

- `createBrands(data)` - Create one or multiple brands
- `updateBrands(id, data)` - Update brand(s)
- `retrieveBrand(id)` - Get single brand by ID
- `listBrands(filters)` - List brands with filters
- `listAndCountBrands(filters)` - List with pagination
- `deleteBrands(id)` - Soft delete brand(s)

## Custom Methods

### `retrieveBrandBySlug(slug: string)`

Find a brand by its URL slug.

```typescript
const brand = await brandModuleService.retrieveBrandBySlug("yonex")
```

### `listBrandsBySport(sport: string)`

Get all brands that support a specific sport.

```typescript
const tennisBrands = await brandModuleService.listBrandsBySport("tennis")
```

## Usage Examples

### 1. Create a Brand

```typescript
// Via Medusa Admin API
POST /admin/brands
{
  "name": "Yonex",
  "slug": "yonex",
  "description": "Japanese racquet sports equipment manufacturer",
  "logo_url": "https://...",
  "website_url": "https://yonex.com",
  "sports": ["tennis", "badminton"],
  "country": "Japan"
}
```

### 2. Link Brand to Product

```typescript
// Using Remote Link
import { Modules } from "@medusajs/framework/utils"

const remoteLink = container.resolve("remoteLink")

await remoteLink.create({
  productService: {
    product_id: "prod_01ABC123",
  },
  brandModuleService: {
    brand_id: "brand_01XYZ789",
  },
})
```

### 3. Query Product with Brand

```typescript
const remoteQuery = container.resolve("remoteQuery")

const products = await remoteQuery({
  product: {
    fields: ["id", "title"],
    brand: {
      fields: ["id", "name", "logo_url"],
    },
  },
})

// Result:
// {
//   id: "prod_01ABC123",
//   title: "Ezone 98",
//   brand: {
//     id: "brand_01XYZ789",
//     name: "Yonex",
//     logo_url: "https://..."
//   }
// }
```

### 4. Get All Products by Brand

```typescript
const products = await remoteQuery({
  product: {
    fields: ["id", "title", "handle"],
    brand: {
      fields: ["*"],
    },
  },
  filters: {
    brand: {
      slug: "yonex",
    },
  },
})
```

## Installation Steps

1. ✅ Module files created in `src/modules/brand/`
2. ✅ Link definition created in `src/links/product-brand.ts`
3. ⏳ Run database migration
4. ⏳ Seed initial brands

## Database Migration

The module will automatically create the `brand` table when you run:

```bash
cd ~/Documents/Develop/MedusaCore/medusa-raqueto-backend

# Build the backend
npm run build

# Run migrations
npx medusa db:migrate
```

## Seeding Initial Brands

Create `src/scripts/seed-brands.ts`:

```typescript
import { Modules } from "@medusajs/framework/utils"

const brands = [
  {
    name: "Yonex",
    slug: "yonex",
    description: "Japanese racquet sports leader",
    sports: ["tennis", "badminton"],
    country: "Japan",
  },
  {
    name: "Wilson",
    slug: "wilson",
    description: "American sports equipment manufacturer",
    sports: ["tennis", "padel"],
    country: "USA",
  },
  {
    name: "Head",
    slug: "head",
    description: "Austrian sports equipment manufacturer",
    sports: ["tennis", "padel"],
    country: "Austria",
  },
  {
    name: "Babolat",
    slug: "babolat",
    description: "French tennis equipment manufacturer",
    sports: ["tennis", "padel"],
    country: "France",
  },
  {
    name: "Bullpadel",
    slug: "bullpadel",
    description: "Spanish padel equipment brand",
    sports: ["padel"],
    country: "Spain",
  },
  {
    name: "Nox",
    slug: "nox",
    description: "Spanish padel equipment brand",
    sports: ["padel"],
    country: "Spain",
  },
]

async function seedBrands(container) {
  const brandModuleService = container.resolve("brandModuleService")
  
  for (const brand of brands) {
    await brandModuleService.createBrands(brand)
  }
  
  console.log(`✅ Seeded ${brands.length} brands`)
}

export default seedBrands
```

Run the seed:

```bash
npx medusa exec ./src/scripts/seed-brands.ts
```

## API Routes (Optional)

Create admin routes for brand management:

```typescript
// src/api/admin/brands/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const brandModuleService = req.scope.resolve("brandModuleService")
  
  const brands = await brandModuleService.listBrands()
  
  res.json({ brands })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const brandModuleService = req.scope.resolve("brandModuleService")
  
  const brand = await brandModuleService.createBrands(req.body)
  
  res.json({ brand })
}
```

## Next Steps

1. Run migrations: `npx medusa db:migrate`
2. Seed brands: `npx medusa exec ./src/scripts/seed-brands.ts`
3. Link brands to products via Admin
4. Query products with brands in storefront

---

**Created:** 2025-11-24  
**Version:** 1.0.0  
**MedusaJS:** 2.11.3

