import * as React from 'react'

import { Autocomplete as BaseAutocomplete } from '@base-ui/react'
import styled from '@emotion/styled'
import { ArrowDown01Icon } from 'hugeicons-react'

import { Input } from '../Input'

export type AutocompleteOption = {
  label: string
  value: string
  disabled?: boolean
}

export type AutocompleteProps = {
  options: AutocompleteOption[]
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'floating'
  placeholder?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  id?: string
  className?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
}

const StyledPopup = styled(BaseAutocomplete.Popup)`
  z-index: 1000;
  margin-top: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  width: var(--anchor-width);
  box-sizing: border-box;
`

const StyledEmpty = styled(BaseAutocomplete.Empty)`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.body};
  text-align: center;
`

const StyledList = styled(BaseAutocomplete.List)`
  padding: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  list-style: none;
  max-height: 250px;
  overflow-y: auto;
`

const StyledItem = styled(BaseAutocomplete.Item)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.body};
  color: ${({ theme }) => theme.colors.text.primary};

  &[data-highlighted] {
    background-color: ${({ theme }) => theme.colors.muted};
  }

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`

const AutocompleteList = () => {
  const filteredOptions = BaseAutocomplete.useFilteredItems()

  if (filteredOptions.length === 0) {
    return <StyledEmpty>No results found</StyledEmpty>
  }

  return (
    <StyledList>
      {filteredOptions.map((option) => (
        <StyledItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </StyledItem>
      ))}
    </StyledList>
  )
}

export const Autocomplete = React.forwardRef<
  HTMLInputElement,
  AutocompleteProps
>(
  (
    {
      options,
      label,
      endAdornment,
      id,
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const inputId =
      id ||
      (label
        ? `autocomplete-${label.toLowerCase().replace(/\s+/g, '-')}`
        : undefined)

    return (
      <BaseAutocomplete.Root
        items={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => onValueChange?.(val)}
      >
        <BaseAutocomplete.Input
          render={
            <Input
              value={value}
              endAdornment={endAdornment || <ArrowDown01Icon size={20} />}
              ref={ref}
              id={inputId}
              label={label}
              {...props}
            />
          }
        />

        <BaseAutocomplete.Portal>
          <BaseAutocomplete.Positioner>
            <StyledPopup>
              <AutocompleteList />
            </StyledPopup>
          </BaseAutocomplete.Positioner>
        </BaseAutocomplete.Portal>
      </BaseAutocomplete.Root>
    )
  },
)

Autocomplete.displayName = 'Autocomplete'
