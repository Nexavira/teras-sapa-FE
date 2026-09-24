import type { CSSProperties, FC } from 'react'

import styled from '@emotion/styled'
import { AlertCircleIcon } from 'hugeicons-react'

export interface ThemeErrorCardProps {
  kind: 'block' | 'section'
  title: string
  message?: string
  id?: string
  type?: string
  name?: string
  sectionId?: string
  parentBlockId?: string
  error?: Error | null
  componentStack?: string | null
  isEditor?: boolean
  style?: CSSProperties
  className?: string
}

const ErrorContainer = styled.div<{ $isEditor?: boolean; $isBlock?: boolean }>`
  position: relative;
  box-sizing: border-box;
  margin: ${({ $isBlock }) => ($isBlock ? '8px 0' : '12px 0')};
  padding: 16px;
  background-color: #fef2f2;
  border: 1.5px dashed #ef4444;
  border-radius: 8px;
  color: #991b1b;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.08);
  cursor: ${({ $isEditor }) => ($isEditor ? 'pointer' : 'default')};
  transition:
    border-color 150ms ease,
    background-color 150ms ease;

  &:hover {
    background-color: #fee2e2;
    border-color: #dc2626;
  }
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #b91c1c;
  margin-bottom: 8px;
`

const BadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
`

const PrimaryBadge = styled.span<{ $kind: 'block' | 'section' }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  background-color: #ef4444;
  color: #ffffff;
`

const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  color: #7f1d1d;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  strong {
    font-weight: 600;
    color: #991b1b;
  }
`

const MessageText = styled.p`
  margin: 0 0 10px 0;
  color: #7f1d1d;
  font-size: 13px;
  line-height: 1.5;

  code {
    background-color: #fee2e2;
    padding: 1px 4px;
    border-radius: 3px;
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
  }
`

const DetailsContainer = styled.details`
  margin-top: 8px;
  padding: 8px 10px;
  background-color: #ffffff;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  font-size: 12px;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: #991b1b;
    outline: none;
    user-select: none;

    &:hover {
      color: #7f1d1d;
    }
  }
`

const StackTracePre = styled.pre`
  margin: 8px 0 0 0;
  padding: 8px;
  background-color: #450a0a;
  color: #fecaca;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
`

export const ThemeErrorCard: FC<ThemeErrorCardProps> = ({
  kind,
  title,
  message,
  id,
  type,
  name,
  sectionId,
  parentBlockId,
  error,
  componentStack,
  isEditor,
  style,
  className,
}) => {
  const isBlock = kind === 'block'
  const technicalStack = error?.stack || componentStack || ''

  return (
    <ErrorContainer
      $isEditor={isEditor}
      $isBlock={isBlock}
      className={className}
      style={style}
      data-error-kind={kind}
      data-block-id={isBlock ? id : undefined}
      data-section-id={sectionId || (!isBlock ? id : undefined)}
      data-parent-block-id={parentBlockId}
      data-block-type={isBlock ? type : undefined}
      data-section-type={!isBlock ? type : undefined}
      data-editor-surface={isEditor ? 'true' : undefined}
      role="alert"
    >
      <HeaderRow>
        <AlertCircleIcon size={18} aria-hidden="true" />
        <span>{title}</span>
      </HeaderRow>

      <BadgeGroup>
        <PrimaryBadge $kind={kind}>{kind} Error</PrimaryBadge>
        {id && (
          <MetaChip>
            <strong>ID:</strong> {id}
          </MetaChip>
        )}
        {type && (
          <MetaChip>
            <strong>Type:</strong> {type}
          </MetaChip>
        )}
        {name && (
          <MetaChip>
            <strong>Name:</strong> {name}
          </MetaChip>
        )}
        {sectionId && isBlock && (
          <MetaChip>
            <strong>Section:</strong> {sectionId}
          </MetaChip>
        )}
        {parentBlockId && (
          <MetaChip>
            <strong>Parent:</strong> {parentBlockId}
          </MetaChip>
        )}
      </BadgeGroup>

      {message && <MessageText>{message}</MessageText>}

      {(error || technicalStack) && (
        <DetailsContainer>
          <summary>Technical Details & Stack Trace</summary>
          {error && (
            <div style={{ marginTop: 6, fontWeight: 600, color: '#991b1b' }}>
              {error.name}: {error.message}
            </div>
          )}
          {technicalStack && <StackTracePre>{technicalStack}</StackTracePre>}
        </DetailsContainer>
      )}
    </ErrorContainer>
  )
}
