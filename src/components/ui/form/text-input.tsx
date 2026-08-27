import type { Control, FieldValues, Path } from 'react-hook-form'

import type { InputProps } from '../primitives/Input'
import { Input } from '../primitives/Input'
import ControlWrapper from './form-control-wrapper'

interface TextInputProps<T extends FieldValues> extends Omit<
  InputProps,
  'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'helperText'
> {
  name: Path<T>
  control?: Control<T>
}

export const TextInput = <T extends FieldValues>({
  name,
  control,
  ...props
}: TextInputProps<T>) => {
  return (
    <ControlWrapper
      name={name}
      control={control}
      render={({ error, helperText, ref, ...field }) => (
        <Input
          {...props}
          {...field}
          ref={ref}
          error={error ? helperText || 'Error' : undefined}
          helperText={!error ? helperText : undefined}
        />
      )}
    />
  )
}
