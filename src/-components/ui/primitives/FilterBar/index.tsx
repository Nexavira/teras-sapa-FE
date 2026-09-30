import type { ReactNode } from 'react'

import styled from '@emotion/styled'
import { Search01Icon } from 'hugeicons-react'

import { theme } from '../../theme'
import { Button } from '../Button'

export interface FilterTab<T extends string = string> {
  key: T
  label: string
  count?: number
}

export interface FilterBarProps<T extends string = string> {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  tabs?: FilterTab<T>[]
  activeTab?: T
  onTabChange?: (key: T) => void
  children?: ReactNode
  actions?: ReactNode
}

const FilterBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 14px 18px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
`

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 240px;
  max-width: 420px;

  svg {
    position: absolute;
    left: 12px;
    color: ${theme.colors.muted};
    pointer-events: none;
  }
`

const SearchInput = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 12px 0 38px;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  background: ${theme.colors.paper};
  color: ${theme.colors.text.primary};
  font-size: 0.88rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${theme.colors.primary.DEFAULT};
    background: ${theme.colors.white};
  }
`

const TabGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const FilterBar = <T extends string = string>({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  tabs,
  activeTab,
  onTabChange,
  children,
  actions,
}: FilterBarProps<T>) => {
  return (
    <FilterBarWrapper>
      {onSearchChange !== undefined && (
        <SearchWrapper>
          <Search01Icon size={16} />
          <SearchInput
            type="text"
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            value={search ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </SearchWrapper>
      )}

      {tabs && tabs.length > 0 && onTabChange && (
        <TabGroup>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <Button
                key={tab.key}
                type="button"
                size="sm"
                variant="outline"
                color={isActive ? 'primary' : 'neutral'}
                onClick={() => onTabChange(tab.key)}
                style={{
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {tab.label}
                {typeof tab.count === 'number' ? ` (${tab.count})` : ''}
              </Button>
            )
          })}
        </TabGroup>
      )}

      {children}

      {actions && <ActionsContainer>{actions}</ActionsContainer>}
    </FilterBarWrapper>
  )
}
