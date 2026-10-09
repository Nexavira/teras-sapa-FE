import type { InputHTMLAttributes, ReactNode } from 'react'
import * as React from 'react'

import styled from '@emotion/styled'
import type { DropzoneOptions, FileRejection } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'

import { HelperText, Label } from '../Input'
import { DropzoneArea } from './components/DropzoneArea'
import { FilePreviewCard } from './components/FilePreviewCard'
import {
  formatAcceptString,
  formatFileSize,
  getRejectionErrorMessage,
  parseAcceptProp,
} from './utils'

export interface FileInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'multiple'
> {
  label?: string
  error?: string
  helperText?: string
  accept?: string
  maxSize?: number // in bytes
  multiple?: boolean
  value?: File | null
  defaultValue?: File | null
  onFileSelect?: (file: File | null) => void
  onChange?: (file: File | null) => void
  disabled?: boolean
  className?: string
  dropzoneText?: ReactNode
  dropzoneSubtext?: ReactNode
  dropzoneOptions?: Omit<
    DropzoneOptions,
    'onDrop' | 'accept' | 'maxSize' | 'multiple' | 'disabled'
  >
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      label,
      error,
      helperText,
      accept,
      maxSize,
      value,
      defaultValue,
      onFileSelect,
      onChange,
      disabled = false,
      className,
      id,
      dropzoneText,
      dropzoneSubtext,
      dropzoneOptions,
    },
    ref,
  ) => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(
      value ?? defaultValue ?? null,
    )
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const [internalError, setInternalError] = React.useState<string | null>(
      null,
    )

    const inputId =
      id ||
      (label
        ? `file-input-${label.toLowerCase().replace(/\s+/g, '-')}`
        : undefined)

    // Synchronize controlled `value`
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedFile(value)
      }
    }, [value])

    // Manage object URL lifecycle for image preview
    React.useEffect(() => {
      if (selectedFile && selectedFile.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreviewUrl(objectUrl)
        return () => {
          URL.revokeObjectURL(objectUrl)
        }
      } else {
        setPreviewUrl(null)
      }
    }, [selectedFile])

    const acceptConfig = React.useMemo(() => parseAcceptProp(accept), [accept])

    const onDrop = React.useCallback(
      (acceptedFiles: Array<File>, fileRejections: Array<FileRejection>) => {
        if (fileRejections.length > 0) {
          const msg = getRejectionErrorMessage(
            fileRejections[0],
            maxSize,
            accept,
          )
          setInternalError(msg)
          return
        }

        if (acceptedFiles.length > 0) {
          setInternalError(null)
          const file = acceptedFiles[0]
          setSelectedFile(file)
          onFileSelect?.(file)
          onChange?.(file)
        }
      },
      [accept, maxSize, onChange, onFileSelect],
    )

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragReject,
      open,
      inputRef,
    } = useDropzone({
      onDrop,
      accept: acceptConfig,
      maxSize,
      multiple: false,
      disabled,
      useFsAccessApi: false,
      ...dropzoneOptions,
    })

    // Forward the input ref from react-dropzone to external forwarded ref
    React.useEffect(() => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(inputRef.current)
      } else {
        ref.current = inputRef.current
      }
    }, [ref, inputRef])

    const handleRemoveFile = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (disabled) return
      setInternalError(null)
      setSelectedFile(null)
      onFileSelect?.(null)
      onChange?.(null)
    }

    const displayError = error || internalError

    // Derived subtext
    const formattedAccept = formatAcceptString(accept)
    const formattedMax = maxSize ? formatFileSize(maxSize) : null
    const computedSubtext =
      dropzoneSubtext ||
      [
        formattedAccept
          ? `${formattedAccept} files supported`
          : 'All files supported',
        formattedMax ? `up to ${formattedMax}` : null,
      ]
        .filter(Boolean)
        .join(', ')

    const handleOpenFilePicker = React.useCallback(() => {
      if (disabled) return
      inputRef.current.value = ''
      inputRef.current.click()
    }, [disabled, inputRef])

    return (
      <Root className={className}>
        {label && <Label htmlFor={inputId}>{label}</Label>}

        <input
          {...getInputProps({
            id: inputId,
            'aria-label': label || 'File input',
          })}
        />

        {!selectedFile ? (
          <DropzoneArea
            getRootProps={() =>
              getRootProps({
                id: inputId ? `${inputId}-dropzone` : undefined,
                'aria-label': label
                  ? `${label} dropzone`
                  : 'File upload dropzone',
              })
            }
            isDragActive={isDragActive}
            isDragReject={isDragReject}
            hasError={Boolean(displayError)}
            disabled={disabled}
            dropzoneText={dropzoneText}
            dropzoneSubtext={computedSubtext}
            onOpen={handleOpenFilePicker}
          />
        ) : (
          <FilePreviewCard
            file={selectedFile}
            previewUrl={previewUrl}
            hasError={Boolean(displayError)}
            disabled={disabled}
            onChangeClick={handleOpenFilePicker}
            onRemoveClick={handleRemoveFile}
          />
        )}

        {(displayError || helperText) && (
          <HelperText
            isError={Boolean(displayError)}
            role={displayError ? 'alert' : undefined}
          >
            {displayError || helperText}
          </HelperText>
        )}
      </Root>
    )
  },
)

FileInput.displayName = 'FileInput'

export { FileInput as FileInputBase, FileInput as FileInputPrimitive }
export { formatAcceptString, formatFileSize, parseAcceptProp } from './utils'
