import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading, Label, Select, Text } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { sdk } from "../lib/sdk"

type AdminProductBrand = AdminProduct & {
  brand?: {
    id: string
    name: string
    slug: string
    description?: string
    sports?: string[]
  }
}

// Product Brand Widget
const ProductBrandWidget = ({ 
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const queryClient = useQueryClient()
  const [selectedBrandId, setSelectedBrandId] = useState<string>("__none__")

  // Fetch product with brand using JS SDK and Tanstack Query
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+brand.*",
    }),
    queryKey: ["product", product.id, "brand"],
  })

  // Fetch all brands
  const { data: brandsData, isLoading: isLoadingBrands } = useQuery({
    queryFn: async () => {
      const response = await fetch('/admin/brands', {
        credentials: 'include',
      })
      return response.json()
    },
    queryKey: ["brands"],
  })

  const currentBrand = (productData?.product as AdminProductBrand)?.brand
  const brands = brandsData?.brands || []

  // Update brand mutation
  const updateBrandMutation = useMutation({
    mutationFn: async (brandId: string) => {
      if (!brandId || brandId === "__none__") {
        // Remove brand association
        return fetch(`/admin/products/${product.id}/brand`, {
          method: 'DELETE',
          credentials: 'include',
        })
      }

      // Link brand to product
      return fetch(`/admin/products/${product.id}/brand`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brand_id: brandId }),
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["product", product.id, "brand"] })
    },
  })

  const handleBrandChange = async (brandId: string) => {
    setSelectedBrandId(brandId)
    try {
      await updateBrandMutation.mutateAsync(brandId)
    } catch (error) {
      console.error("Failed to update brand:", error)
      alert("Failed to update brand")
    }
  }

  if (isLoadingProduct || isLoadingBrands) {
    return (
      <Container className="p-6">
        <Text className="text-ui-fg-subtle text-sm">Loading brands...</Text>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Brand</Heading>
      </div>
      <div className="px-6 py-4">
        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-2">Select Brand</Label>
            <Select 
              value={currentBrand?.id || "__none__"} 
              onValueChange={handleBrandChange}
              disabled={updateBrandMutation.isPending}
            >
              <Select.Trigger>
                <Select.Value placeholder="No brand selected" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="__none__">No brand</Select.Item>
                {brands.map((brand: any) => (
                  <Select.Item key={brand.id} value={brand.id}>
                    {brand.name}
                    {brand.sports && brand.sports.length > 0 && (
                      <span className="text-ui-fg-subtle ml-2">
                        ({brand.sports.join(", ")})
                      </span>
                    )}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          
          {currentBrand && (
            <div className="bg-ui-bg-subtle rounded-lg p-4">
              <Text size="small" weight="plus">{currentBrand.name}</Text>
              {currentBrand.sports && currentBrand.sports.length > 0 && (
                <Text size="xsmall" className="text-ui-fg-subtle mt-1">
                  Sports: {currentBrand.sports.join(", ")}
                </Text>
              )}
              {currentBrand.description && (
                <Text size="xsmall" className="text-ui-fg-subtle mt-2">
                  {currentBrand.description}
                </Text>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductBrandWidget

