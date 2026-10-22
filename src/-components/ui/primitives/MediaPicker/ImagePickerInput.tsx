import React, { useState } from 'react'

import styled from '@emotion/styled'
import {
  Cancel01Icon,
  CloudUploadIcon,
  Delete02Icon,
  Edit02Icon,
  Image01Icon,
  Link01Icon,
  ViewIcon,
} from 'hugeicons-react'

import type { MediaItem } from '#/types/media.type'

import { theme } from '../../theme'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { HelperText, Label } from '../Input'
import { Typography } from '../Typography'
import { MediaPickerModal } from './MediaPickerModal'

export interface ImagePickerPrimitiveProps {
  label?: string
  value?: string | null
  defaultValue?: string | null
  onChange?: (url: string) => void
  error?: string
  helperText?: string
  placeholder?: string
  disabled?: boolean
  accept?: string
  modalTitle?: string
  className?: string
  id?: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`

const TriggerEmptyBox = styled.div<{ $hasError: boolean; $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  border: 1.5px dashed
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: 12px;
  background-color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.paper : theme.colors.white};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease-in-out;
  text-align: center;
  gap: 10px;

  &:hover {
    ${({ theme, $hasError, $disabled }) =>
      !$disabled &&
      `
      border-color: ${$hasError ? theme.colors.error : theme.colors.primary.DEFAULT};
      background-color: rgba(0, 168, 107, 0.02);
    `}
  }
`

const IconPill = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${theme.colors.paper};
  color: ${theme.colors.primary.DEFAULT};
  display: grid;
  place-items: center;
  transition: transform 0.2s ease;

  ${TriggerEmptyBox}:hover & {
    transform: scale(1.08);
    background: ${theme.colors.primary.LIGHTER};
  }
`

const SelectedCard = styled.div<{ $hasError: boolean; $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: 10px;
  background-color: ${theme.colors.white};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`

const ImagePreviewBox = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  background-color: ${theme.colors.paper};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid ${theme.colors.border};
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.03);
  }
`

const CardContent = styled.div`
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${theme.colors.white};
`

const SelectedUrlText = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
`

export const ImagePickerInputPrimitive: React.FC<ImagePickerPrimitiveProps> = ({
  label,
  value,
  defaultValue,
  onChange,
  error,
  helperText,
  placeholder = 'Pilih atau unggah gambar...',
  disabled = false,
  accept = 'image/*',
  modalTitle = 'Pustaka Media & Konten',
  className,
  id,
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    value ?? defaultValue ?? '',
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Synchronize controlled value
  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value || '')
    }
  }, [value])

  const currentValue = value !== undefined ? value : internalValue

  const handleOpenModal = () => {
    if (disabled) return
    setIsModalOpen(true)
  }

  const handleSelectMedia = (media: MediaItem) => {
    setInternalValue(media.url)
    onChange?.(media.url)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) return
    setInternalValue('')
    onChange?.('')
  }

  const inputId =
    id ||
    (label
      ? `image-picker-${label.toLowerCase().replace(/\s+/g, '-')}`
      : undefined)

  return (
    <Wrapper className={className} id={inputId}>
      {label && <Label htmlFor={inputId}>{label}</Label>}

      {currentValue ? (
        <SelectedCard $hasError={!!error} $disabled={disabled}>
          <ImagePreviewBox
            onClick={handleOpenModal}
            title="Klik untuk mengganti gambar"
          >
            <img
              src={currentValue}
              alt="Pratinjau terpilih"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  'https://placehold.co/100x100?text=Error'
              }}
            />
          </ImagePreviewBox>

          <CardContent>
            <SelectedUrlText title={currentValue}>
              {currentValue.split('/').pop()?.split('?')[0] || currentValue}
            </SelectedUrlText>

            <ActionsGroup>
              <Button
                size="sm"
                variant="outline"
                color="neutral"
                disabled={disabled}
                onClick={handleOpenModal}
                style={{ flex: 1 }}
              >
                <Edit02Icon size={14} style={{ marginRight: 6 }} />
                Ganti
              </Button>

              <IconButton
                size="sm"
                variant="ghost"
                title="Buka gambar di tab baru"
                onClick={() => window.open(currentValue, '_blank')}
              >
                <Link01Icon size={16} />
              </IconButton>

              <IconButton
                size="sm"
                variant="outline"
                color="error"
                disabled={disabled}
                title="Hapus gambar ini"
                onClick={handleClear}
              >
                <Delete02Icon size={16} />
              </IconButton>
            </ActionsGroup>
          </CardContent>
        </SelectedCard>
      ) : (
        <TriggerEmptyBox
          $hasError={!!error}
          $disabled={disabled}
          onClick={handleOpenModal}
        >
          <IconPill>
            <Image01Icon size={24} />
          </IconPill>
          <div>
            <Typography
              variant="body"
              style={{
                fontWeight: 600,
                fontSize: '0.92rem',
                color: theme.colors.text.primary,
              }}
            >
              {placeholder}
            </Typography>
            <Typography
              variant="caption"
              color="secondary"
              style={{ marginTop: 2 }}
            >
              Klik untuk memilih dari galeri atau unggah gambar baru
            </Typography>
          </div>
          <Button
            size="sm"
            variant="outline"
            color="primary"
            disabled={disabled}
            style={{ pointerEvents: 'none', marginTop: 4 }}
          >
            <CloudUploadIcon size={14} style={{ marginRight: 6 }} />
            Pustaka Media
          </Button>
        </TriggerEmptyBox>
      )}

      {error ? (
        <HelperText error={true}>{error}</HelperText>
      ) : helperText ? (
        <HelperText>{helperText}</HelperText>
      ) : null}

      <MediaPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectMedia}
        initialSelectedUrl={currentValue || undefined}
        title={modalTitle}
        accept={accept}
      />
    </Wrapper>
  )
}
