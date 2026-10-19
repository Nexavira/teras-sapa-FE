import React from 'react'

import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import {
  CheckmarkCircle02Icon,
  File01Icon,
  PaintBoardIcon,
  PlusSignIcon,
  ViewIcon,
} from 'hugeicons-react'

import { Badge, Button, Card, theme, Typography } from '#/-components/ui'
import type { TenantTemplateType } from '#/types/cms.type'

import type { ThemeDefinition } from '#themes'

const CardRoot = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(
    135deg,
    ${theme.colors.background} 0%,
    ${theme.colors.gray[100]} 100%
  );
  border: 1px solid ${theme.colors.primary.DEFAULT}33;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

const ThemeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #ffffff;
  border: 1px solid ${theme.colors.border};
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: ${theme.colors.text.secondary};

  strong {
    color: ${theme.colors.text.primary};
  }
`

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export interface ActiveThemeCardProps {
  tenantTemplate: TenantTemplateType
  themeDefinition: ThemeDefinition
  onAddPage: () => void
}

export const ActiveThemeCard: React.FC<ActiveThemeCardProps> = ({
  tenantTemplate,
  themeDefinition,
  onAddPage,
}) => {
  const pageCount = tenantTemplate.pages?.length || 0
  const previewUrl = `/preview?theme=${encodeURIComponent(themeDefinition.id)}`

  return (
    <CardRoot padding="lg" variant="flat">
      <HeaderRow>
        <ThemeInfo>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Badge variant="success">
              <CheckmarkCircle02Icon size={14} />
              Tema Aktif Toko
            </Badge>
            <Badge variant="neutral">{themeDefinition.category}</Badge>
          </div>
          <Typography as="h2" variant="title" weight="bold">
            {themeDefinition.name}
          </Typography>
          <Typography variant="body" color="secondary">
            {themeDefinition.description}
          </Typography>
        </ThemeInfo>

        <ActionsRow>
          <Button
            variant="outline"
            color="primary"
            startIcon={<PlusSignIcon size={16} />}
            onClick={onAddPage}
          >
            Tambah Halaman dari Template
          </Button>

          <Link
            to="/editor"
            search={{
              theme: themeDefinition.id,
              tenant_template: tenantTemplate.uuid,
            }}
          >
            <Button
              variant="solid"
              color="primary"
              startIcon={<PaintBoardIcon size={16} />}
            >
              Sesuaikan di Editor
            </Button>
          </Link>

          <a href={previewUrl} target="_blank" rel="noreferrer">
            <Button
              variant="ghost"
              color="neutral"
              startIcon={<ViewIcon size={16} />}
            >
              Pratinjau Toko
            </Button>
          </a>
        </ActionsRow>
      </HeaderRow>

      <StatsRow>
        <StatItem>
          <File01Icon size={18} color={theme.colors.primary.DEFAULT} />
          <span>
            Halaman Dibuat: <strong>{pageCount} halaman</strong>
          </span>
        </StatItem>
        <StatItem>
          <span>
            Toko:{' '}
            <strong>
              {tenantTemplate.tenant?.name || 'Toko'} (
              {tenantTemplate.tenant?.slug})
            </strong>
          </span>
        </StatItem>
        <StatItem>
          <span>
            Versi Template: <strong>v{tenantTemplate.version + 1}.0</strong>
          </span>
        </StatItem>
      </StatsRow>
    </CardRoot>
  )
}
