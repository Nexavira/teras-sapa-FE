import type { FieldValues } from 'react-hook-form'

import type { FileInputProps } from './file-input'
import { FileInput } from './file-input'

export type FileUploadInputProps<T extends FieldValues = FieldValues> =
  FileInputProps<T>

export const FileUploadInput = FileInput

export default FileUploadInput
