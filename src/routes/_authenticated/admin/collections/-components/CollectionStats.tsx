import {
  Bookmark02Icon,
  GridTableIcon,
  ShoppingBag01Icon,
} from 'hugeicons-react'

import { StatCard } from '#/-components/ui/primitives/StatCard'
import { StatsGrid } from '#/-components/ui/primitives/StatsGrid'
import { theme } from '#/-components/ui/theme'
import type { Collection } from '#/types/collection.type'

interface CollectionStatsProps {
  collections: Array<Collection>
}

export const CollectionStats = ({ collections }: CollectionStatsProps) => {
  const totalCount = collections.length
  const totalAssignedProducts = collections.reduce(
    (sum, c) => sum + (c.productUuids?.length || 0),
    0,
  )

  return (
    <StatsGrid columns={3}>
      <StatCard
        icon={<GridTableIcon size={22} />}
        color={theme.colors.primary.DEFAULT}
        label="Total Koleksi"
        value={totalCount}
      />
      <StatCard
        icon={<Bookmark02Icon size={22} />}
        color="#10b981"
        label="Koleksi Aktif"
        value={`${totalCount} aktif`}
      />
      <StatCard
        icon={<ShoppingBag01Icon size={22} />}
        color="#6366f1"
        label="Produk Terdaftar"
        value={`${totalAssignedProducts} item`}
      />
    </StatsGrid>
  )
}
