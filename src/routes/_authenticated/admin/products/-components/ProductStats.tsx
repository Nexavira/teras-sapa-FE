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
  products: Product[]
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
        label="Total Products"
        value={totalCount}
      />
      <StatCard
        icon={<CheckmarkCircle02Icon size={22} />}
        color="#10b981"
        label="Active Items"
        value={activeCount}
      />
      <StatCard
        icon={<AlertCircleIcon size={22} />}
        color="#f59e0b"
        label="Drafts"
        value={draftCount}
      />
      <StatCard
        icon={<PackageIcon size={22} />}
        color="#6366f1"
        label="Total Stock"
        value={`${totalStock} units`}
      />
    </StatsGrid>
  )
}
