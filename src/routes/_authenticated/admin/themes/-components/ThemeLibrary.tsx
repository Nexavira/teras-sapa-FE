import React from 'react'

import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import {
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  Layers01Icon,
  PaintBoardIcon,
  SparklesIcon,
} from 'hugeicons-react'

import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  theme,
  Typography,
} from '#/-components/ui'
import type { TenantTemplateType } from '#/types/cms.type'

import { DEFAULT_THEME_ID, getTheme } from '#themes'

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const LibraryCard = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  border-radius: 16px;
  background-color: #ffffff;
  border: 1px solid ${theme.colors.border};
`

const ThemeRow = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 24px;
  border-bottom: 1px solid ${theme.colors.border};
  background-color: ${({ isActive }) =>
    isActive ? `${theme.colors.primary.DEFAULT}04` : '#ffffff'};
  transition: background-color 0.15s ease;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ isActive }) =>
      isActive ? `${theme.colors.primary.DEFAULT}08` : '#f8fafc'};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`

const ThemeThumbnail = styled.div<{ bgGradient?: string }>`
  width: 54px;
  height: 54px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ bgGradient }) =>
    bgGradient ||
    `linear-gradient(135deg, ${theme.colors.gray[100]} 0%, ${theme.colors.gray[200]} 100%)`};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.text.secondary};
`

const ThemeMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

const SubtitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.8125rem;
  color: ${theme.colors.text.secondary};

  span.item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  flex-wrap: wrap;

  a {
    text-decoration: none;
  }

  @media (max-width: 520px) {
    width: 100%;

    a,
    button {
      flex: 1;
    }
  }
`

export interface ThemeLibraryProps {
  tenantTemplates: Array<TenantTemplateType>
  onPublish: (template: TenantTemplateType) => void
  onScrollToCatalog: () => void
}

export const ThemeLibrary: React.FC<ThemeLibraryProps> = ({
  tenantTemplates,
  onPublish,
  onScrollToCatalog,
}) => {
  if (tenantTemplates.length === 0) {
    return (
      <SectionContainer>
        <PageHeader
          title="Theme Library"
          description="Tema yang telah dibuat atau dipasang untuk store Anda."
        />

        <EmptyState
          action={
            <Button
              color="primary"
              size="sm"
              variant="solid"
              onClick={onScrollToCatalog}
            >
              Jelajahi Theme Catalog
            </Button>
          }
          description="Kamu belum memiliki tema di library. Pilih tema dari Theme Catalog di bawah untuk mulai membangun store kamu."
          title="Belum Ada Tema di Library"
        />
      </SectionContainer>
    )
  }

  return (
    <SectionContainer>
      <HeaderRow>
        <PageHeader
          title="Theme Library"
          description="Tema yang telah dibuat atau dipasang untuk store Anda."
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography as="h2" variant="title" weight="bold">
            Theme Library
          </Typography>
          <Badge size="sm" variant="neutral">
            {tenantTemplates.length} themes
          </Badge>
        </div>
        <Typography variant="body" color="secondary">
          Koleksi tema yang tersimpan di store kamu. Kamu bisa punya beberapa
          draft tema, tapi <strong>hanya 1 tema yang bisa aktif</strong> di
          store pada satu waktu.
        </Typography>
      </HeaderRow>

      <LibraryCard padding="none" variant="flat">
        {tenantTemplates.map((template) => {
          const isActive = Boolean(template.active_template)
          const customSettings = template.template_settings as
            Record<string, unknown> | undefined

          const themeSlug =
            (customSettings?.theme_id as string) ||
            (template.global_template?.title?.toLowerCase().includes('forge')
              ? 'forge'
              : template.global_template?.title?.toLowerCase().includes('dawn')
                ? 'dawn'
                : DEFAULT_THEME_ID)

          const themeDef = getTheme(themeSlug)

          const displayTitle =
            (customSettings?.theme_title as string) ||
            template.global_template?.title ||
            themeDef.name

          const pageCount = template.pages?.length || 0
          const tenantSlug = template.tenant?.slug
          const previewUrl = tenantSlug
            ? `/preview/${encodeURIComponent(tenantSlug)}?theme=${encodeURIComponent(themeDef.id)}`
            : `/preview?theme=${encodeURIComponent(themeDef.id)}`

          return (
            <ThemeRow key={template.uuid} isActive={isActive}>
              <LeftGroup>
                <ThemeThumbnail
                  bgGradient={
                    themeDef.id === 'forge'
                      ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                      : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                  }
                >
                  <Layers01Icon
                    size={24}
                    color={themeDef.id === 'forge' ? '#f8fafc' : '#059669'}
                  />
                </ThemeThumbnail>

                <ThemeMeta>
                  <TitleRow>
                    <Typography variant="body" weight="bold">
                      {displayTitle}
                    </Typography>
                    {isActive ? (
                      <Badge size="sm" variant="success">
                        <CheckmarkCircle02Icon size={12} />
                        Active Theme
                      </Badge>
                    ) : (
                      <Badge size="sm" variant="neutral">
                        Draft
                      </Badge>
                    )}
                    <Badge size="sm" variant="neutral">
                      {themeDef.category}
                    </Badge>
                  </TitleRow>

                  <SubtitleRow>
                    <span className="item">
                      Base: <strong>{themeDef.name}</strong>
                    </span>
                    <span>•</span>
                    <span className="item">
                      <File01Icon size={13} />
                      {pageCount} pages
                    </span>
                    <span>•</span>
                    <span className="item">v{template.version + 1}.0</span>
                  </SubtitleRow>
                </ThemeMeta>
              </LeftGroup>

              <ActionsGroup>
                {!isActive && (
                  <Button
                    variant="outline"
                    color="primary"
                    size="sm"
                    startIcon={<SparklesIcon size={15} />}
                    onClick={() => onPublish(template)}
                  >
                    Publish
                  </Button>
                )}

                <Link
                  to="/editor"
                  search={{
                    theme: themeDef.id,
                    tenant_template: template.uuid,
                    tenant: tenantSlug,
                  }}
                >
                  <Button
                    variant={isActive ? 'solid' : 'outline'}
                    color={isActive ? 'primary' : 'neutral'}
                    size="sm"
                    startIcon={<PaintBoardIcon size={15} />}
                  >
                    Customize
                  </Button>
                </Link>

                <a href={previewUrl} target="_blank" rel="noreferrer">
                  <Button
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    endIcon={<ArrowUpRight01Icon size={14} />}
                  >
                    Preview
                  </Button>
                </a>
              </ActionsGroup>
            </ThemeRow>
          )
        })}
      </LibraryCard>
    </SectionContainer>
  )
}
