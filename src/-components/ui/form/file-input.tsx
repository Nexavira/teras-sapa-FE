import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FileInputProps as PrimitiveFileInputProps } from '../primitives/FileInput'
import { FileInput as FileInputPrimitive } from '../primitives/FileInput'
import ControlWrapper from './form-control-wrapper'

export interface FileInputProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  PrimitiveFileInputProps,
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'error'
  | 'helperText'
  | 'onChange'
  | 'onBlur'
> {
  name?: Path<T>
  control?: Control<T>
  value?: File | null
  defaultValue?: File | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | File | null) => void
  error?: string
  helperText?: string
}

export const FileInput = <T extends FieldValues = FieldValues>({
  name,
  control,
  ...props
}: FileInputProps<T>) => {
  if (control && name) {
    return (
      <ControlWrapper
        name={name}
        control={control}
        render={({ error, helperText, onChange, ref, value, ...field }) => (
          <FileInputPrimitive
            {...props}
            {...field}
            ref={ref}
            value={value ?? null}
            onFileSelect={onChange}
            error={error ? helperText || 'Error' : undefined}
            helperText={!error ? helperText : undefined}
          />
        )}
      />
    )
  }

  return <FileInputPrimitive {...props} />
}

export default FileInput
