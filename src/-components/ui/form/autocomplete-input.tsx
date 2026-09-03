import type { Control, FieldValues, Path } from 'react-hook-form'

import type { AutocompleteProps } from '../primitives/Autocomplete'
import { Autocomplete } from '../primitives/Autocomplete'
import ControlWrapper from './form-control-wrapper'

interface AutocompleteInputProps<T extends FieldValues> extends Omit<
  AutocompleteProps,
  'name' | 'value' | 'defaultValue' | 'onValueChange' | 'error' | 'helperText'
> {
  name: Path<T>
  control?: Control<T>
}

export const AutocompleteInput = <T extends FieldValues>({
  name,
  control,
  ...props
}: AutocompleteInputProps<T>) => {
  return (
    <ControlWrapper
      name={name}
      control={control}
      render={({ error, helperText, onChange, value, ...field }) => (
        <Autocomplete
          {...props}
          {...field}
          value={value}
          onValueChange={onChange}
          error={error ? helperText || 'Error' : undefined}
          helperText={!error ? helperText : undefined}
        />
      )}
    />
  )
}
