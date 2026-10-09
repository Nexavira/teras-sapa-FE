import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Note01Icon,
} from 'hugeicons-react'

import { StatCard } from '#/-components/ui/primitives/StatCard'
import { StatsGrid } from '#/-components/ui/primitives/StatsGrid'
import { theme } from '#/-components/ui/theme'
import type { Article } from '#/types/article.type'

export const ArticleStats = ({ articles }: { articles: Array<Article> }) => (
  <StatsGrid columns={3}>
    <StatCard
      icon={<Note01Icon size={22} />}
      color={theme.colors.primary.DEFAULT}
      label="Total Artikel"
      value={articles.length}
    />
    <StatCard
      icon={<CheckmarkCircle02Icon size={22} />}
      color="#10b981"
      label="Diterbitkan"
      value={
        articles.filter((article) => article.status === 'published').length
      }
    />
    <StatCard
      icon={<AlertCircleIcon size={22} />}
      color="#f59e0b"
      label="Draf"
      value={articles.filter((article) => article.status === 'draft').length}
    />
  </StatsGrid>
)
