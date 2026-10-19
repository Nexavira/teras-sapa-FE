import React from 'react'

import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import {
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  PaintBoardIcon,
  Store01Icon,
} from 'hugeicons-react'

import { Badge, Button, Card, theme, Typography } from '#/-components/ui'
import type { TenantTemplateType } from '#/types/cms.type'

import type { ThemeDefinition } from '#themes'

const CardRoot = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid ${theme.colors.border};
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
`

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 460px 1fr;
  gap: 32px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`

/* Double-bezel browser preview mockup */
const BrowserMockup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
  background-color: #f8fafc;
  overflow: hidden;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.08),
    0 8px 10px -6px rgba(0, 0, 0, 0.04);
`

const BrowserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background-color: #f1f5f9;
  border-bottom: 1px solid ${theme.colors.border};
`

const WindowDots = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }

  span:nth-of-type(1) {
    background-color: #ff5f56;
  }
  span:nth-of-type(2) {
    background-color: #ffbd2e;
  }
  span:nth-of-type(3) {
    background-color: #27c93f;
  }
`

const UrlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  background-color: #ffffff;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.75rem;
  color: ${theme.colors.text.secondary};
  font-family: monospace;
`

const PreviewFrameWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  width: 100%;
  background-color: #ffffff;
  overflow: hidden;

  iframe {
    width: 200%;
    height: 200%;
    border: 0;
    pointer-events: none;
    transform: scale(0.5);
    transform-origin: top left;
  }
`

const PreviewFloatingBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
`

const ThemeDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const ActiveIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  background-color: #ecfdf5;
  color: #059669;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #a7f3d0;

  span.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
`

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background-color: ${theme.colors.gray[100]};
  border: 1px solid ${theme.colors.border};
`

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  span.label {
    font-size: 0.75rem;
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  span.val {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: 6px;
  }
`

const ActionButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 6px;

  a {
    text-decoration: none;
  }

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;

    a,
    button {
      width: 100%;
    }
  }
`

export interface CurrentThemeCardProps {
  tenantTemplate: TenantTemplateType
  themeDefinition: ThemeDefinition
}

export const CurrentThemeCard: React.FC<CurrentThemeCardProps> = ({
  tenantTemplate,
  themeDefinition,
}) => {
  const pageCount = tenantTemplate.pages?.length || 0
  const tenantSlug = tenantTemplate.tenant?.slug
  const previewUrl = tenantSlug
    ? `/preview/${encodeURIComponent(tenantSlug)}?theme=${encodeURIComponent(themeDefinition.id)}`
    : `/preview?theme=${encodeURIComponent(themeDefinition.id)}`
  const storeHost = tenantSlug
    ? `${tenantSlug}.shopiti.app`
    : 'tokosaya.shopiti.app'

  // Extract custom title from template_settings if stored, or fallback to global template title / definition name
  const customSettings = tenantTemplate.template_settings as
    | Record<string, unknown>
    | undefined
  const displayTitle =
    (customSettings?.theme_title as string) ||
    tenantTemplate.global_template?.title ||
    themeDefinition.name

  return (
    <CardRoot padding="none" variant="flat">
      <MainGrid>
        {/* Left Column: Device Mockup with real preview */}
        <BrowserMockup>
          <BrowserHeader>
            <WindowDots>
              <span />
              <span />
              <span />
            </WindowDots>
            <UrlBar>
              <Store01Icon size={12} />
              <span>https://{storeHost}</span>
            </UrlBar>
          </BrowserHeader>

          <PreviewFrameWrapper>
            <iframe
              aria-hidden="true"
              loading="lazy"
              src={previewUrl}
              tabIndex={-1}
              title={`Preview ${displayTitle}`}
            />
            <PreviewFloatingBadge>
              <Badge size="sm" variant="success">
                <CheckmarkCircle02Icon size={12} />
                Live di Store
              </Badge>
            </PreviewFloatingBadge>
          </PreviewFrameWrapper>
        </BrowserMockup>

        {/* Right Column: Details & Shopify CTA */}
        <ThemeDetails>
          <HeaderSection>
            <TagRow>
              <ActiveIndicator>
                <span className="dot" />
                Published • Active Theme
              </ActiveIndicator>
              <Badge variant="neutral">{themeDefinition.category}</Badge>
            </TagRow>

            <div>
              <Typography as="h2" variant="title" weight="bold">
                {displayTitle}
              </Typography>
              <Typography variant="body" color="secondary">
                {themeDefinition.description}
              </Typography>
            </div>
          </HeaderSection>

          <MetaGrid>
            <MetaItem>
              <span className="label">Base Template</span>
              <span className="val">{themeDefinition.name}</span>
            </MetaItem>

            <MetaItem>
              <span className="label">Pages</span>
              <span className="val">
                <File01Icon size={14} color={theme.colors.primary.DEFAULT} />
                {pageCount} pages
              </span>
            </MetaItem>

            <MetaItem>
              <span className="label">Status Store</span>
              <span className="val" style={{ color: '#059669' }}>
                Live & Aktif
              </span>
            </MetaItem>
          </MetaGrid>

          <ActionButtonsRow>
            <Link
              to="/editor"
              search={{
                theme: themeDefinition.id,
                tenant_template: tenantTemplate.uuid,
                tenant: tenantSlug,
              }}
            >
              <Button
                variant="solid"
                color="primary"
                size="md"
                startIcon={<PaintBoardIcon size={18} />}
              >
                Customize Theme
              </Button>
            </Link>

            <a href={previewUrl} target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                color="neutral"
                size="md"
                endIcon={<ArrowUpRight01Icon size={16} />}
              >
                Preview Store
              </Button>
            </a>
          </ActionButtonsRow>
        </ThemeDetails>
      </MainGrid>
    </CardRoot>
  )
}
