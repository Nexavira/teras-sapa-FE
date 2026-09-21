import type { FilterTab } from '#/-components/ui/primitives/FilterBar'
import { FilterBar } from '#/-components/ui/primitives/FilterBar'
import type { ProductStatus } from '#/types/product.type'

export type ProductStatusFilter = ProductStatus | 'all'

interface ProductFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: ProductStatusFilter
  onStatusFilterChange: (status: ProductStatusFilter) => void
}

const TABS: FilterTab<ProductStatusFilter>[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'draft', label: 'Draft' },
  { key: 'archived', label: 'Archived' },
]

export const ProductFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ProductFiltersProps) => {
  return (
    <FilterBar<ProductStatusFilter>
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search products by title, tag, or category..."
      tabs={TABS}
      activeTab={statusFilter}
      onTabChange={onStatusFilterChange}
    />
  )
}
