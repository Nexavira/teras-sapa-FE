import { FilterBar } from '#/-components/ui/primitives/FilterBar'

interface CollectionFiltersProps {
  search: string
  onSearchChange: (value: string) => void
}

export const CollectionFilters = ({
  search,
  onSearchChange,
}: CollectionFiltersProps) => {
  return (
    <FilterBar
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search collections by title or slug..."
    />
  )
}
