import type { Control, FieldValues, Path } from 'react-hook-form'

import type { FileUploadProps } from '../primitives/FileUpload'
import { FileUpload } from '../primitives/FileUpload'
import ControlWrapper from './form-control-wrapper'

interface FileUploadInputProps<T extends FieldValues> extends Omit<
  FileUploadProps,
  'name' | 'onFileSelect' | 'error' | 'helperText'
> {
  name: Path<T>
  control?: Control<T>
}

export const FileUploadInput = <T extends FieldValues>({
  name,
  control,
  ...props
}: FileUploadInputProps<T>) => {
  return (
    <ControlWrapper
      name={name}
      control={control}
      render={({ error, helperText, onChange, ref, value, ...field }) => (
        <FileUpload
          {...props}
          {...field}
          ref={ref}
          onFileSelect={onChange}
          error={error ? helperText || 'Error' : undefined}
          helperText={!error ? helperText : undefined}
        />
      )}
    />
  )
}
