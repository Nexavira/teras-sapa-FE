import type { Control, FieldValues, Path } from 'react-hook-form'

import type { ColorPickerProps } from '../primitives/ColorPicker'
import { ColorPicker } from '../primitives/ColorPicker'
import ControlWrapper from './form-control-wrapper'

interface ColorPickerInputProps<T extends FieldValues> extends Omit<
  ColorPickerProps,
  'value' | 'onChange'
> {
  name: Path<T>
  control?: Control<T>
}

export const ColorPickerInput = <T extends FieldValues>({
  name,
  control,
  ...props
}: ColorPickerInputProps<T>) => {
  return (
    <ControlWrapper
      name={name}
      control={control}
      render={({ value, onChange, helperText }) => (
        <ColorPicker
          {...props}
          value={value}
          onChange={onChange}
          helperText={helperText}
        />
      )}
    />
  )
}
