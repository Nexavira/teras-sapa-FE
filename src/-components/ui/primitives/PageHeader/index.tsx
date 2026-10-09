import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { ArrowLeft02Icon } from 'hugeicons-react'

import { theme } from '../../theme'
import { Typography } from '../Typography'

export interface PageHeaderProps {
  title: string
  description?: string
  backTo?: string
  onBack?: () => void
  actions?: ReactNode
  children?: ReactNode
}

const HeaderWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const BackButton = styled.button`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  background: ${theme.colors.white};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: ${theme.colors.paper};
    border-color: ${theme.colors.primary.DEFAULT};
    color: ${theme.colors.primary.DEFAULT};
  }
`

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const PageHeader = ({
  title,
  description,
  backTo,
  onBack,
  actions,
  children,
}: PageHeaderProps) => {
  return (
    <HeaderWrapper>
      <LeftContainer>
        <TitleRow>
          {backTo ? (
            <Link to={backTo}>
              <BackButton type="button" aria-label="Kembali">
                <ArrowLeft02Icon size={18} />
              </BackButton>
            </Link>
          ) : onBack ? (
            <BackButton type="button" onClick={onBack} aria-label="Kembali">
              <ArrowLeft02Icon size={18} />
            </BackButton>
          ) : null}

          <Typography
            variant="title"
            style={{ fontSize: '1.75rem', fontWeight: 800 }}
          >
            {title}
          </Typography>
        </TitleRow>

        {description && (
          <Typography variant="body" color="secondary">
            {description}
          </Typography>
        )}
      </LeftContainer>

      {(actions || children) && (
        <ActionsRow>
          {actions}
          {children}
        </ActionsRow>
      )}
    </HeaderWrapper>
  )
}
