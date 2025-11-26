import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront, PlusMini, PencilSquare } from "@medusajs/icons"
import { 
  Container,
  Heading,
  Button,
  Input,
  Label,
  Textarea,
  Switch,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  useDataTable,
  IconButton,
} from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useMemo, useState } from "react"

type Brand = {
  id: string
  name: string
  slug: string
  description?: string
  order?: number
  is_active?: boolean
  sports?: string[]
  country?: string
  logo_url?: string
  website_url?: string
}

type BrandsResponse = {
  brands: Brand[]
  count: number
  limit: number
  offset: number
}

const createColumns = (onEdit: (brand: Brand) => void) => {
  const columnHelper = createDataTableColumnHelper<Brand>()

  return [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("slug", {
      header: "Slug",
      cell: ({ getValue }) => (
        <span className="text-ui-fg-subtle">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("sports", {
      header: "Sports",
      cell: ({ getValue }) => {
        const sports = getValue()
        return sports && sports.length > 0 ? sports.join(", ") : "-"
      },
    }),
    columnHelper.accessor("is_active", {
      header: "Status",
      cell: ({ getValue }) => {
        const isActive = getValue()
        return (
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
            isActive 
              ? 'bg-ui-tag-green-bg text-ui-tag-green-text' 
              : 'bg-ui-tag-neutral-bg text-ui-tag-neutral-text'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isActive ? 'bg-ui-tag-green-icon' : 'bg-ui-tag-neutral-icon'
            }`} />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        )
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <IconButton
            variant="transparent"
            onClick={() => onEdit(row.original)}
          >
            <PencilSquare />
          </IconButton>
        </div>
      ),
    }),
  ]
}

const BrandsPage = () => {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [isActive, setIsActive] = useState(true)
  
  const limit = 15
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  })
  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const { data, isLoading } = useQuery<BrandsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/brands`, {
      query: {
        limit,
        offset,
      },
    }),
    queryKey: ["brands", limit, offset],
  })

  // Create brand mutation
  const createBrandMutation = useMutation({
    mutationFn: async (brandData: {
      name: string
      description?: string
      order?: number
      is_active?: boolean
      sports?: string[]
      country?: string
      logo_url?: string
      website_url?: string
    }) => {
      return sdk.client.fetch(`/admin/brands`, {
        method: "POST",
        body: brandData,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      handleCloseModal()
    },
  })

  // Update brand mutation
  const updateBrandMutation = useMutation({
    mutationFn: async ({ id, ...brandData }: {
      id: string
      name: string
      description?: string
      order?: number
      is_active?: boolean
      sports?: string[]
      country?: string
      logo_url?: string
      website_url?: string
    }) => {
      return sdk.client.fetch(`/admin/brands/${id}`, {
        method: "POST",
        body: brandData,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      handleCloseModal()
    },
  })

  const handleOpenCreateModal = () => {
    setEditingBrand(null)
    setIsActive(true) // Default to active for new brands
    setShowModal(true)
  }

  const handleOpenEditModal = (brand: Brand) => {
    setEditingBrand(brand)
    setIsActive(brand.is_active ?? true) // Set to brand's current state
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingBrand(null)
    setIsActive(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const sportsString = formData.get("sports") as string
    const sports = sportsString 
      ? sportsString.split(",").map(s => s.trim()).filter(Boolean)
      : []
    
    const orderString = formData.get("order") as string
    const order = orderString ? parseInt(orderString, 10) : undefined

    const brandData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      order: order !== undefined && !isNaN(order) ? order : undefined,
      is_active: isActive, // Use state value
      sports: sports.length > 0 ? sports : undefined,
      country: formData.get("country") as string || undefined,
      logo_url: formData.get("logo_url") as string || undefined,
      website_url: formData.get("website_url") as string || undefined,
    }

    if (editingBrand) {
      await updateBrandMutation.mutateAsync({
        id: editingBrand.id,
        ...brandData,
      })
    } else {
      await createBrandMutation.mutateAsync(brandData)
    }
  }

  const columns = useMemo(() => createColumns(handleOpenEditModal), [])

  const table = useDataTable({
    columns,
    data: data?.brands || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  const isSubmitting = createBrandMutation.isPending || updateBrandMutation.isPending

  return (
    <>
      <Container className="divide-y p-0">
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
            <Heading>Brands</Heading>
            <Button
              variant="secondary"
              size="small"
              onClick={handleOpenCreateModal}
            >
              <PlusMini />
              Create Brand
            </Button>
          </DataTable.Toolbar>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      </Container>

      {/* Create/Edit Brand Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Heading level="h2" className="mb-4">
              {editingBrand ? `Edit Brand: ${editingBrand.name}` : "Create New Brand"}
            </Heading>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-2">Brand Name *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={editingBrand?.name}
                  placeholder="e.g., Wilson, Yonex, Head"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="mb-2">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingBrand?.description}
                  placeholder="Brief description of the brand"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="order" className="mb-2">
                  Display Order
                  <span className="text-ui-fg-subtle text-xs ml-2">(Lower numbers appear first)</span>
                </Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={editingBrand?.order ?? 999}
                  placeholder="e.g., 1, 2, 3..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-x-2">
                  <Switch
                    id="is_active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="is_active">
                    Active in Storefront
                  </Label>
                </div>
                <div className="txt-small text-ui-fg-subtle ml-9">
                  {isActive
                    ? "Brand is visible to customers"
                    : "Brand is hidden from storefront"}
                </div>
              </div>

              <div>
                <Label htmlFor="sports" className="mb-2">Sports (comma-separated)</Label>
                <Input
                  id="sports"
                  name="sports"
                  defaultValue={editingBrand?.sports?.join(", ")}
                  placeholder="e.g., tennis, padel, golf"
                />
              </div>

              <div>
                <Label htmlFor="country" className="mb-2">Country</Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={editingBrand?.country}
                  placeholder="e.g., USA, Japan, Austria"
                />
              </div>

              <div>
                <Label htmlFor="logo_url" className="mb-2">Logo URL</Label>
                <Input
                  id="logo_url"
                  name="logo_url"
                  defaultValue={editingBrand?.logo_url}
                  placeholder="e.g., /brands/wilson-logo.png"
                />
              </div>

              <div>
                <Label htmlFor="website_url" className="mb-2">Website URL</Label>
                <Input
                  id="website_url"
                  name="website_url"
                  type="url"
                  defaultValue={editingBrand?.website_url}
                  placeholder="e.g., https://wilson.com"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (editingBrand ? "Updating..." : "Creating...") 
                    : (editingBrand ? "Update Brand" : "Create Brand")
                  }
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export const config = defineRouteConfig({
  label: "Brands",
  icon: BuildingStorefront,
})

export default BrandsPage
