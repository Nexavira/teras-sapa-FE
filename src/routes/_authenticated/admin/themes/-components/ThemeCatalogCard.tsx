import React from 'react'

import styled from '@emotion/styled'
import {
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
  Layers01Icon,
} from 'hugeicons-react'

import {
  Badge,
  Button,
  Card,
  theme as adminTheme,
  Typography,
} from '#/-components/ui'

import type { ThemeDefinition } from '#themes'

const CardRoot = styled(Card)<{ isActiveTheme?: boolean }>`
  display: flex;
  min-width: 0;
  flex-direction: column;
  border-radius: 16px;
  background-color: #ffffff;
  overflow: hidden;
  border: 1px solid ${adminTheme.colors.border};
`

const PreviewViewport = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 1px solid ${adminTheme.colors.border};
  background: ${adminTheme.colors.gray[100]};

  iframe {
    width: 200%;
    height: 200%;
    border: 0;
    pointer-events: none;
    transform: scale(0.5);
    transform-origin: top left;
  }
`

const BadgeContainer = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`

const CardBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
`

const ThemeHeading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`

const ThemeCopy = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
`

const PageTemplatesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 8px;
  flex-wrap: wrap;

  a {
    text-decoration: none;
  }

  @media (max-width: 520px) {
    align-items: stretch;
    flex-direction: column;

    a,
    button {
      width: 100%;
    }
  }
`

export interface ThemeCatalogCardProps {
  theme: ThemeDefinition
  globalTemplateUuid?: string
  recommended?: boolean
  installedCount?: number
  onInstall: () => void
}

export const ThemeCatalogCard: React.FC<ThemeCatalogCardProps> = ({
  theme,
  recommended = false,
  installedCount = 0,
  onInstall,
}) => {
  const previewUrl = `/preview?theme=${encodeURIComponent(theme.id)}`
  const catalogEntries = Object.entries(theme.templateCatalog)

  return (
    <CardRoot padding="none" variant="flat">
      <PreviewViewport>
        <iframe
          aria-hidden="true"
          loading="lazy"
          src={previewUrl}
          tabIndex={-1}
          title={`Preview theme ${theme.name}`}
        />
        <BadgeContainer>
          {recommended &&  (
            <Badge size="sm" variant="neutral">
              Recommended
            </Badge>
          )}
        </BadgeContainer>
      </PreviewViewport>

      <CardBody>
        <ThemeHeading>
          <ThemeCopy>
            <Typography as="h3" variant="title" weight="bold">
              {theme.name}
            </Typography>
            <Typography color="secondary" variant="body">
              {theme.description}
            </Typography>
          </ThemeCopy>
          <Badge variant="neutral">{theme.category}</Badge>
        </ThemeHeading>

        <div>
          <Typography
            variant="caption"
            color="secondary"
            weight="medium"
            style={{ marginBottom: '8px', display: 'block' }}
          >
            Template Pages ({catalogEntries.length}):
          </Typography>
          <PageTemplatesList>
            {catalogEntries.slice(0, 5).map(([key, entry]) => (
              <Badge key={key} size="sm" variant="neutral">
                {entry.label}
              </Badge>
            ))}
            {catalogEntries.length > 5 && (
              <Badge size="sm" variant="neutral">
                +{catalogEntries.length - 5} lainnya
              </Badge>
            )}
          </PageTemplatesList>
        </div>

        <Actions>
          <Button
            color="primary"
            startIcon={<Layers01Icon size={16} />}
            variant="solid"
            onClick={onInstall}
          >
            {installedCount > 0
              ? 'Add Duplicate Theme'
              : 'Add to Theme Library'}
          </Button>

          <a href={previewUrl} rel="noreferrer" target="_blank">
            <Button
              color="neutral"
              endIcon={<ArrowUpRight01Icon size={15} />}
              variant="outline"
            >
              Preview
            </Button>
          </a>
        </Actions>
      </CardBody>
    </CardRoot>
  )
}
