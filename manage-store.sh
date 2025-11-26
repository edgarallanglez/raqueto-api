#!/bin/bash

# MedusaJS Store Management Script
# This script helps you manage your store via API calls

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE="http://localhost:9000"
ADMIN_TOKEN="your-admin-token-here"  # You'll need to get this from your Medusa setup

echo -e "${BLUE}🛍️ MedusaJS Store Management${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to make API calls
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -n "$data" ]; then
        curl -s -X $method \
            -H "Content-Type: application/json" \
            -H "x-medusa-access-token: $ADMIN_TOKEN" \
            -d "$data" \
            "$API_BASE$endpoint"
    else
        curl -s -X $method \
            -H "x-medusa-access-token: $ADMIN_TOKEN" \
            "$API_BASE$endpoint"
    fi
}

# Check if API is running
check_api() {
    print_status "Checking API connection..."
    if curl -s "$API_BASE/health" > /dev/null; then
        print_status "API is running!"
        return 0
    else
        print_error "API is not running. Please start your Medusa server first."
        return 1
    fi
}

# List products
list_products() {
    print_status "Fetching products..."
    api_call "GET" "/admin/products" | jq '.' 2>/dev/null || echo "No products found or jq not installed"
}

# Create a product
create_product() {
    local title=$1
    local description=$2
    local price=$3
    
    if [ -z "$title" ] || [ -z "$description" ] || [ -z "$price" ]; then
        echo "Usage: create_product 'Product Title' 'Description' 'Price'"
        return 1
    fi
    
    print_status "Creating product: $title"
    
    local product_data=$(cat << EOF
{
    "title": "$title",
    "description": "$description",
    "status": "published",
    "variants": [
        {
            "title": "Default Variant",
            "prices": [
                {
                    "amount": $price,
                    "currency_code": "usd"
                }
            ]
        }
    ]
}
EOF
)
    
    api_call "POST" "/admin/products" "$product_data" | jq '.' 2>/dev/null || echo "Product created (install jq for better output)"
}

# List orders
list_orders() {
    print_status "Fetching orders..."
    api_call "GET" "/admin/orders" | jq '.' 2>/dev/null || echo "No orders found or jq not installed"
}

# List customers
list_customers() {
    print_status "Fetching customers..."
    api_call "GET" "/admin/customers" | jq '.' 2>/dev/null || echo "No customers found or jq not installed"
}

# Show help
show_help() {
    echo -e "${BLUE}Available commands:${NC}"
    echo "  check          - Check if API is running"
    echo "  products       - List all products"
    echo "  create-product - Create a new product (interactive)"
    echo "  orders         - List all orders"
    echo "  customers      - List all customers"
    echo "  help           - Show this help"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./manage-store.sh check"
    echo "  ./manage-store.sh products"
    echo "  ./manage-store.sh create-product"
}

# Interactive product creation
interactive_create_product() {
    echo -e "${BLUE}Creating a new product...${NC}"
    read -p "Product title: " title
    read -p "Product description: " description
    read -p "Price (in cents, e.g., 1000 for $10.00): " price
    
    create_product "$title" "$description" "$price"
}

# Main script logic
case "${1:-help}" in
    "check")
        check_api
        ;;
    "products")
        if check_api; then
            list_products
        fi
        ;;
    "create-product")
        if check_api; then
            interactive_create_product
        fi
        ;;
    "orders")
        if check_api; then
            list_orders
        fi
        ;;
    "customers")
        if check_api; then
            list_customers
        fi
        ;;
    "help"|*)
        show_help
        ;;
esac
