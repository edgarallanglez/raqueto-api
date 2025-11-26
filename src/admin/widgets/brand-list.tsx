import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"

// Brand List Widget
const BrandListWidget = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Brands</Heading>
      </div>
      <div className="px-6 py-4">
        <p className="text-ui-fg-subtle">
          Brand management will appear here. This is a placeholder.
        </p>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default BrandListWidget

