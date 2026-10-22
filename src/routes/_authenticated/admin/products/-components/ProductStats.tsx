import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  PackageIcon,
  ShoppingBag01Icon,
} from 'hugeicons-react'

import { StatCard } from '#/-components/ui/primitives/StatCard'
import { StatsGrid } from '#/-components/ui/primitives/StatsGrid'
import { theme } from '#/-components/ui/theme'
import type { Product } from '#/types/product.type'

interface ProductStatsProps {
  products: Array<Product>
}

export const ProductStats = ({ products }: ProductStatsProps) => {
  const totalCount = products.length
  const activeCount = products.filter((p) => p.status === 'active').length
  const draftCount = products.filter((p) => p.status === 'draft').length
  const totalStock = products.reduce((sum, p) => sum + p.totalInventory, 0)

  return (
    <StatsGrid columns={4}>
      <StatCard
        icon={<ShoppingBag01Icon size={22} />}
        color={theme.colors.primary.DEFAULT}
        label="Total Produk"
        value={totalCount}
      />
      <StatCard
        icon={<CheckmarkCircle02Icon size={22} />}
        color="#10b981"
        label="Item Aktif"
        value={activeCount}
      />
      <StatCard
        icon={<AlertCircleIcon size={22} />}
        color="#f59e0b"
        label="Draf"
        value={draftCount}
      />
      <StatCard
        icon={<PackageIcon size={22} />}
        color="#6366f1"
        label="Total Stok"
        value={`${totalStock} unit`}
      />
    </StatsGrid>
  )
}
