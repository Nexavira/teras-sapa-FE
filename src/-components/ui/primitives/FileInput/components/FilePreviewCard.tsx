import styled from '@emotion/styled'
import { Delete02Icon, File01Icon, Pdf01Icon } from 'hugeicons-react'

import { ActionIconButton } from '../../ActionIconButton'
import { Badge } from '../../Badge'
import { Button } from '../../Button'
import { formatFileSize } from '../utils'

export interface FilePreviewCardProps {
  file: File
  previewUrl: string | null
  hasError: boolean
  disabled: boolean
  onChangeClick: () => void
  onRemoveClick: (e: React.MouseEvent) => void
}

const PreviewCardContainer = styled.div<{
  $hasError: boolean
  $disabled: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s cubic-bezier(0.32, 0.72, 0, 1);

  &:hover {
    ${({ theme, $hasError, $disabled }) =>
      !$disabled &&
      `
      border-color: ${$hasError ? theme.colors.error : theme.colors.primary.DEFAULT};
      background-color: rgba(0, 168, 107, 0.02);
    `}
  }
`

const PreviewLeading = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
`

const Thumbnail = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`

const FileTypeIconBox = styled.div<{ $isPdf?: boolean }>`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ $isPdf }) =>
    $isPdf ? 'rgba(219, 65, 83, 0.1)' : 'rgba(0, 168, 107, 0.1)'};
  color: ${({ theme, $isPdf }) =>
    $isPdf ? theme.colors.error : theme.colors.primary.DEFAULT};
  flex-shrink: 0;
`

const MetaColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  overflow: hidden;
`

const FileName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

export const FilePreviewCard = ({
  file,
  previewUrl,
  hasError,
  disabled,
  onChangeClick,
  onRemoveClick,
}: FilePreviewCardProps) => {
  const isImage = Boolean(file.type.startsWith('image/'))
  const isPdf = Boolean(
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'),
  )

  const handleCardClick = () => {
    if (disabled) return
    onChangeClick()
  }

  return (
    <PreviewCardContainer
      $hasError={hasError}
      $disabled={disabled}
      onClick={handleCardClick}
    >
      <PreviewLeading>
        {isImage && previewUrl ? (
          <Thumbnail src={previewUrl} alt={file.name} />
        ) : (
          <FileTypeIconBox $isPdf={isPdf}>
            {isPdf ? <Pdf01Icon size={24} /> : <File01Icon size={24} />}
          </FileTypeIconBox>
        )}

        <MetaColumn>
          <FileName title={file.name}>{file.name}</FileName>
          <MetaRow>
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <Badge variant="success" size="sm" dot>
              Ready
            </Badge>
          </MetaRow>
        </MetaColumn>
      </PreviewLeading>

      <ActionsGroup>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            onChangeClick()
          }}
        >
          Change
        </Button>
        <ActionIconButton
          type="button"
          danger
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            onRemoveClick(e)
          }}
          aria-label="Remove file"
          title="Remove file"
        >
          <Delete02Icon size={16} />
        </ActionIconButton>
      </ActionsGroup>
    </PreviewCardContainer>
  )
}
