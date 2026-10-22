import * as React from 'react'

import { Autocomplete as BaseAutocomplete } from '@base-ui/react'
import styled from '@emotion/styled'
import { ArrowDown01Icon } from 'hugeicons-react'

import type { InputProps } from '../Input'
import { Input } from '../Input'

export type AutocompleteOption = {
  label: string
  value: string
  disabled?: boolean
}

export type AutocompleteProps = InputProps & {
  options: Array<AutocompleteOption>
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
  isLoading?: boolean
}

const StyledPositioner = styled(BaseAutocomplete.Positioner)`
  /* Keep the entire popup stacking context above modal overlays. */
  z-index: 1000;
`

const StyledPopup = styled(BaseAutocomplete.Popup)`
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

const AutocompleteList = ({ isLoading }: { isLoading: boolean }) => {
  const filteredOptions: Array<AutocompleteOption> =
    BaseAutocomplete.useFilteredItems()

  if (isLoading) {
    return <StyledEmpty role="status">Loading options...</StyledEmpty>
  }

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
      isLoading = false,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')
    const selectedValue = value ?? internalValue
    const displayValue =
      options.find((option) => option.value === selectedValue)?.label ??
      selectedValue
    const inputId =
      id ||
      (label
        ? `autocomplete-${label.toLowerCase().replace(/\s+/g, '-')}`
        : undefined)

    return (
      <BaseAutocomplete.Root
        items={isLoading ? [] : options}
        open={open && !props.disabled}
        onOpenChange={setOpen}
        openOnInputClick
        value={displayValue}
        onValueChange={(val) => {
          setInternalValue(val)
          onValueChange?.(val)
        }}
      >
        <BaseAutocomplete.Input
          onFocus={() => {
            if (!props.disabled) setOpen(true)
          }}
          aria-busy={isLoading}
          render={
            <Input
              endAdornment={endAdornment || <ArrowDown01Icon size={20} />}
              ref={ref}
              id={inputId}
              label={label}
              {...props}
            />
          }
        />

        <BaseAutocomplete.Portal>
          <StyledPositioner>
            <StyledPopup>
              <AutocompleteList isLoading={isLoading} />
            </StyledPopup>
          </StyledPositioner>
        </BaseAutocomplete.Portal>
      </BaseAutocomplete.Root>
    )
  },
)

Autocomplete.displayName = 'Autocomplete'
