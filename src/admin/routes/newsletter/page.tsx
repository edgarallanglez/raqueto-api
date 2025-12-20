import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Envelope } from "@medusajs/icons"
import { 
  Container,
  Heading,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  useDataTable,
  Badge,
} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useMemo, useState } from "react"

type NewsletterSubscription = {
  id: string
  email: string
  status: "active" | "unsubscribed" | "bounced"
  source?: string
  created_at: string
  updated_at: string
}

type SubscriptionsResponse = {
  subscriptions: NewsletterSubscription[]
  count: number
  limit: number
  offset: number
}

const createColumns = () => {
  const columnHelper = createDataTableColumnHelper<NewsletterSubscription>()

  return [
    columnHelper.accessor("email", {
      header: "Email",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <Badge
            color={
              status === "active" 
                ? "green" 
                : status === "unsubscribed" 
                ? "grey" 
                : "red"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    }),
    columnHelper.accessor("source", {
      header: "Source",
      cell: ({ getValue }) => {
        const source = getValue()
        return source ? (
          <span className="text-ui-fg-subtle">{source}</span>
        ) : (
          <span className="text-ui-fg-muted">-</span>
        )
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Subscribed At",
      cell: ({ getValue }) => {
        const date = new Date(getValue())
        return (
          <span className="text-ui-fg-subtle">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </span>
        )
      },
    }),
  ]
}

const NewsletterPage = () => {
  const limit = 15
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  })
  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const { data, isLoading } = useQuery<SubscriptionsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/newsletter`, {
      query: {
        limit,
        offset,
      },
    }),
    queryKey: ["newsletter-subscriptions", limit, offset],
  })

  const columns = useMemo(() => createColumns(), [])

  const table = useDataTable({
    columns,
    data: data?.subscriptions || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  return (
    <Container className="divide-y p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div>
            <Heading>Newsletter Subscriptions</Heading>
            <p className="text-ui-fg-subtle text-sm mt-1">
              Manage email subscriptions from your storefront
            </p>
          </div>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Newsletter",
  icon: Envelope,
})

export default NewsletterPage

