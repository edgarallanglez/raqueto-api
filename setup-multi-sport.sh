#!/bin/bash

echo "🚀 Setting up Multi-Sport Store Structure"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1/2: Creating category structure...${NC}"
npx medusa exec ./src/scripts/setup-multi-sport-structure.ts

echo ""
echo -e "${BLUE}Step 2/2: Creating product tags...${NC}"
npx medusa exec ./src/scripts/setup-product-tags.ts

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "  1. Visit your admin panel: https://api.raqueto.shop/app"
echo "  2. Go to Products → Categories to see your new structure"
echo "  3. Go to Products → Settings → Tags to see all tags"
echo "  4. Start adding products to the appropriate categories!"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "  - For racquets/rackets: Add to category, tag with gender"
echo "  - For shoes/apparel: Add to gender-specific subcategory"
echo "  - Use sport tags (sport:tennis, sport:padel) for filtering"
echo ""

