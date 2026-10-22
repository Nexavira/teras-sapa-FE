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

const TABS: Array<FilterTab<ProductStatusFilter>> = [
  { key: 'all', label: 'Semua' },
  { key: 'active', label: 'Aktif' },
  { key: 'draft', label: 'Draf' },
  { key: 'archived', label: 'Diarsipkan' },
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
      searchPlaceholder="Cari produk berdasarkan judul, tag, atau kategori..."
      tabs={TABS}
      activeTab={statusFilter}
      onTabChange={onStatusFilterChange}
    />
  )
}
