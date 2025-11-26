# Product Spec Templates

Pre-defined metadata templates for different product types.

## Available Templates

- **racquet.json** - Tennis/Padel racquets (12 fields)
- **shoes.json** - Athletic footwear (12 fields)
- **apparel.json** - Clothing items (10 fields)
- **bags.json** - Sports bags (10 fields)
- **accessories.json** - General accessories (8 fields)

## Quick Start

### Copy & Paste (Easiest)

1. Open template file: `cat racquet.json`
2. Copy the JSON content
3. In Medusa Admin → Product → Metadata → Add metadata
4. Key: `specs`
5. Value: (paste JSON)
6. Fill in the empty values
7. Save

### Use Script

```bash
# From medusa-raqueto-backend directory
ADMIN_EMAIL="your@email.com" ADMIN_PASSWORD="pass" \
  node apply-spec-template.js prod_01ABC123 racquet
```

## Template Structure

Each template uses this format:

```json
{
  "field_name": {
    "value": "",        // Fill this in
    "unit": "g",        // Optional: unit of measurement
    "label": "Label"    // Optional: custom display label
  }
}
```

## Adding Custom Templates

Create a new `.json` file in this folder with your custom fields:

```json
{
  "your_field": {
    "value": "",
    "label": "Your Field Label"
  }
}
```

## Documentation

See full documentation: `../PRODUCT_SPEC_TEMPLATES_GUIDE.md`

## Examples

### Filled Racquet Specs
```json
{
  "head_size": {
    "value": "98 sq in",
    "label": "Head Size"
  },
  "strung_weight": {
    "value": 305,
    "unit": "g"
  }
}
```

### Filled Shoes Specs
```json
{
  "weight": {
    "value": 11.2,
    "unit": "oz"
  },
  "surface": {
    "value": "Hard Court / Clay",
    "label": "Court Surface"
  }
}
```


