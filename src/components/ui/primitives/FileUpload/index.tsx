import * as React from 'react'

import styled from '@emotion/styled'
import { Cancel01Icon, CloudUploadIcon, File01Icon } from 'hugeicons-react'

import { Button } from '../Button'
import { HelperText, Label } from '../Input'
import { Typography } from '../Typography'

export type FileUploadProps = {
  label?: string
  error?: string
  helperText?: string
  accept?: string
  maxSize?: number // in bytes
  onFileSelect?: (file: File | null) => void
  className?: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`

const DropZone = styled.div<{ $isDragging: boolean; $hasError: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 2px dashed
    ${({ theme, $isDragging, $hasError }) =>
      $hasError
        ? theme.colors.error
        : $isDragging
          ? theme.colors.primary
          : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme, $isDragging }) =>
    $isDragging ? theme.colors.muted : theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;

  &:hover {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.muted};
  }
`

const IconWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`

const HiddenInput = styled.input`
  display: none;
`

const PreviewWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
`

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
`

const ImagePreview = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const IconPreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.colors.muted};
  color: ${({ theme }) => theme.colors.text.secondary};
`

const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const FileName = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const IconButton = styled(Button)`
  border-radius: ${({ theme }) => theme.radius.full};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.error};
  }
`

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      error,
      helperText,
      accept,
      maxSize,
      onFileSelect,
      className,
      ...props
    },
    ref,
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    const inputRef =
      (ref as React.RefObject<HTMLInputElement> | null) || internalRef
    const [isDragging, setIsDragging] = React.useState(false)
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const [internalError, setInternalError] = React.useState<string | null>(
      null,
    )

    const handleFile = (file: File) => {
      setInternalError(null)

      if (maxSize && file.size > maxSize) {
        setInternalError(
          `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
        )
        return
      }

      setSelectedFile(file)
      onFileSelect?.(file)

      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl(null)
      }
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0])
        e.dataTransfer.clearData()
      }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0])
      }
    }

    const removeFile = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedFile(null)
      setPreviewUrl(null)
      setInternalError(null)
      onFileSelect?.(null)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const displayError = error || internalError
    const isImage = selectedFile?.type.startsWith('image/')

    // Cleanup object URL
    React.useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
      }
    }, [previewUrl])

    return (
      <Wrapper className={className}>
        {label && <Label>{label}</Label>}
        <DropZone
          $isDragging={isDragging}
          $hasError={!!displayError}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <IconWrapper>
            <CloudUploadIcon size={32} />
          </IconWrapper>

          <Typography
            variant="body"
            weight="medium"
            css={{ marginBottom: '4px' }}
          >
            <span style={{ textDecoration: 'underline' }}>Click to upload</span>{' '}
            or drag and drop
          </Typography>

          <Typography variant="caption" color="secondary">
            {accept ? `Accepted files: ${accept}` : 'Any file type supported'}
          </Typography>

          {maxSize && (
            <Typography variant="caption" color="secondary">
              Max size: {formatFileSize(maxSize)}
            </Typography>
          )}

          <HiddenInput
            type="file"
            ref={inputRef}
            onChange={onChange}
            accept={accept}
            {...props}
          />
        </DropZone>

        {selectedFile && (
          <PreviewWrapper>
            <FileInfo>
              {isImage && previewUrl ? (
                <ImagePreview src={previewUrl} alt={selectedFile.name} />
              ) : (
                <IconPreview>
                  <File01Icon size={24} />
                </IconPreview>
              )}
              <FileDetails>
                <FileName
                  variant="body"
                  weight="medium"
                  css={{ title: selectedFile.name }}
                >
                  {selectedFile.name}
                </FileName>
                <Typography variant="caption" color="secondary">
                  {formatFileSize(selectedFile.size)}
                </Typography>
              </FileDetails>
            </FileInfo>
            <IconButton
              variant="ghost"
              size="icon"
              onClick={removeFile}
              aria-label="Remove file"
            >
              <Cancel01Icon size={20} />
            </IconButton>
          </PreviewWrapper>
        )}

        {(displayError || helperText) && (
          <HelperText isError={!!displayError}>
            {displayError || helperText}
          </HelperText>
        )}
      </Wrapper>
    )
  },
)

FileUpload.displayName = 'FileUpload'
