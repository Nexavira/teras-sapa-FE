import type { ReactNode } from 'react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { CloudUploadIcon } from 'hugeicons-react'

export interface DropzoneAreaProps {
  getRootProps: (props?: unknown) => Record<string, unknown>
  isDragActive: boolean
  isDragReject: boolean
  hasError: boolean
  disabled: boolean
  dropzoneText?: ReactNode
  dropzoneSubtext?: ReactNode
  onOpen?: () => void
}

const DropzoneContainer = styled.div<{
  $isDragActive: boolean
  $isDragReject: boolean
  $hasError: boolean
  $disabled: boolean
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.md}`};
  border: 2px dashed
    ${({ theme, $isDragActive, $isDragReject, $hasError }) =>
      $isDragReject || $hasError
        ? theme.colors.error
        : $isDragActive
          ? theme.colors.primary.DEFAULT
          : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({
    theme,
    $isDragActive,
    $isDragReject,
    $hasError,
    $disabled,
  }) =>
    $disabled
      ? theme.colors.paper
      : $isDragReject || $hasError
        ? 'rgba(219, 65, 83, 0.03)'
        : $isDragActive
          ? 'rgba(0, 168, 107, 0.06)'
          : theme.colors.background};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  text-align: center;
  transition: all 0.22s cubic-bezier(0.32, 0.72, 0, 1);
  outline: none;

  ${({ $isDragActive }) =>
    $isDragActive &&
    css`
      box-shadow: 0 0 0 4px rgba(0, 168, 107, 0.12);
      transform: scale(1.005);
    `}

  &:hover {
    ${({ theme, $hasError, $disabled }) =>
      !$disabled &&
      css`
        border-color: ${
          $hasError ? theme.colors.error : theme.colors.primary.DEFAULT
        };
        background-color: ${
          $hasError ? 'rgba(219, 65, 83, 0.04)' : 'rgba(0, 168, 107, 0.03)'
        };
        .dropzone-icon-pill {
          transform: translateY(-2px);
          background-color: ${theme.colors.primary.LIGHTER};
          color: ${theme.colors.primary.DARKER};
        }
      `}
  }

  &:focus-visible {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary.DEFAULT};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? 'rgba(219, 65, 83, 0.18)' : 'rgba(0, 168, 107, 0.18)'};
  }
`

const IconWrapper = styled.div<{ $isDragActive: boolean }>`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: ${({ theme, $isDragActive }) =>
    $isDragActive ? theme.colors.primary.LIGHTER : theme.colors.paper};
  color: ${({ theme, $isDragActive }) =>
    $isDragActive ? theme.colors.primary.DARKER : theme.colors.text.secondary};
  transition: all 0.2s cubic-bezier(0.32, 0.72, 0, 1);
  pointer-events: none;
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: none;
`

const MainText = styled.div`
  font-size: 0.9rem;
  font-weight: 550;
  color: ${({ theme }) => theme.colors.text.primary};

  span {
    color: ${({ theme }) => theme.colors.primary.DEFAULT};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`

const MetaText = styled.div`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

export const DropzoneArea = ({
  getRootProps,
  isDragActive,
  isDragReject,
  hasError,
  disabled,
  dropzoneText,
  dropzoneSubtext,
  onOpen,
}: DropzoneAreaProps) => {
  const rootProps = getRootProps()

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    if (typeof rootProps.onClick === 'function') {
      ;(rootProps.onClick as React.MouseEventHandler)(e)
    } else {
      onOpen?.()
    }
  }

  return (
    <DropzoneContainer
      {...rootProps}
      $isDragActive={isDragActive}
      $isDragReject={isDragReject}
      $hasError={hasError}
      $disabled={disabled}
      onClick={handleClick}
    >
      <IconWrapper className="dropzone-icon-pill" $isDragActive={isDragActive}>
        <CloudUploadIcon size={24} />
      </IconWrapper>

      <TextGroup>
        <MainText>
          {isDragReject ? (
            <span style={{ color: '#DB4153', textDecoration: 'none' }}>
              File not supported
            </span>
          ) : isDragActive ? (
            <span>Drop file here</span>
          ) : (
            <>
              <span>{dropzoneText || 'Click to browse'}</span> or drag and drop
            </>
          )}
        </MainText>
        <MetaText>{dropzoneSubtext}</MetaText>
      </TextGroup>
    </DropzoneContainer>
  )
}
