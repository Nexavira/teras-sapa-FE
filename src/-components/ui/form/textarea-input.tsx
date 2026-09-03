import type { Control, FieldValues, Path } from 'react-hook-form'

import type { TextareaProps } from '../primitives/Textarea'
import { Textarea } from '../primitives/Textarea'
import ControlWrapper from './form-control-wrapper'

interface TextareaInputProps<T extends FieldValues> extends Omit<
  TextareaProps,
  'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'helperText'
> {
  name: Path<T>
  control?: Control<T>
}

export const TextareaInput = <T extends FieldValues>({
  name,
  control,
  ...props
}: TextareaInputProps<T>) => {
  return (
    <ControlWrapper
      name={name}
      control={control}
      render={({ error, helperText, ref, ...field }) => (
        <Textarea
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
