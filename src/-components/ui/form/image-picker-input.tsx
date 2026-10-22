import type { Control, FieldValues, Path } from 'react-hook-form'

import type { ImagePickerPrimitiveProps } from '../primitives/MediaPicker'
import { ImagePickerInputPrimitive } from '../primitives/MediaPicker'
import ControlWrapper from './form-control-wrapper'

export interface ImagePickerInputProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  ImagePickerPrimitiveProps,
  'value' | 'defaultValue' | 'error' | 'helperText' | 'onChange'
> {
  name?: Path<T>
  control?: Control<T>
  value?: string | null
  defaultValue?: string | null
  onChange?: (url: string) => void
  error?: string
  helperText?: string
}

export const ImagePickerInput = <T extends FieldValues = FieldValues>({
  name,
  control,
  value,
  defaultValue,
  onChange,
  error,
  helperText,
  ...props
}: ImagePickerInputProps<T>) => {
  if (control && name) {
    return (
      <ControlWrapper
        name={name}
        control={control}
        render={({
          error: hasError,
          helperText: formHelperText,
          onChange: formOnChange,
          value: formValue,
        }) => (
          <ImagePickerInputPrimitive
            {...props}
            value={formValue ?? ''}
            onChange={(url) => {
              formOnChange(url)
              onChange?.(url)
            }}
            error={hasError ? formHelperText || 'Error' : undefined}
            helperText={!hasError ? helperText || formHelperText : undefined}
          />
        )}
      />
    )
  }

  return (
    <ImagePickerInputPrimitive
      {...props}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      error={error}
      helperText={helperText}
    />
  )
}

export const ImagePicker = ImagePickerInput
export default ImagePickerInput
