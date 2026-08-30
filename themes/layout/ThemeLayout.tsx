import React from 'react'

import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'

import defaultSettingsData from '#themes/config/settings_data.json'
import type { GlobalSettingsData } from '#themes/types/theme'
import { generateColorSchemeCss } from '#themes/utils/colors'

export interface ThemeLayoutProps {
  children: React.ReactNode
  headerComponent?: React.ReactNode
  footerComponent?: React.ReactNode
  globalSettings?: GlobalSettingsData
}

const PageRoot = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: rgb(var(--color-background, 255, 255, 255));
  color: rgb(var(--color-foreground, 18, 18, 18));
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: var(--font-body-size, 15px);
  line-height: var(--font-body-line-height, 1.6);
`

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  min-width: 0;
`

const DefaultFooter = styled.footer`
  width: 100%;
  padding: 40px 24px;
  text-align: center;
  font-size: 14px;
  border-top: 1px solid var(--color-border, rgba(0, 0, 0, 0.1));
`

export const ThemeLayout: React.FC<ThemeLayoutProps> = ({
  children,
  headerComponent,
  footerComponent,
  globalSettings = defaultSettingsData,
}) => {
  const current = globalSettings.current

  const dynamicGlobalStyles = css`
    :root {
      /* ====================================================================
       * 1. Layout & Grid Spacing Tokens
       * ==================================================================== */
      --page-width: ${current.page_width ?? 1280}px;
      --gutter-desktop: ${current.gutter_desktop ?? 32}px;
      --gutter-mobile: ${current.gutter_mobile ?? 16}px;
      --grid-gap-horizontal: ${current.grid_gap_horizontal ?? 24}px;
      --grid-gap-vertical: ${current.grid_gap_vertical ?? 32}px;
      --section-space-desktop: ${current.section_space_desktop ?? 64}px;
      --section-space-mobile: ${current.section_space_mobile ?? 36}px;

      /* ====================================================================
       * 2. Typography System
       * ==================================================================== */
      --font-heading: ${current.font_heading || "'Inter', sans-serif"};
      --font-heading-weight: ${current.font_heading_weight || '700'};
      --heading-scale: ${(current.heading_scale ?? 100) / 100};
      --heading-letter-spacing: ${current.heading_letter_spacing ?? 0}px;
      --heading-text-transform: ${current.heading_text_transform || 'none'};

      --font-body: ${current.font_body || "'Inter', sans-serif"};
      --font-body-weight: ${current.font_body_weight || '400'};
      --font-body-size: ${current.font_body_base_size ?? 15}px;
      --font-body-line-height: ${current.font_body_line_height ?? 1.6};

      /* ====================================================================
       * 3. Interactive UI, Buttons & Inputs
       * ==================================================================== */
      --button-radius: ${current.button_border_radius ?? 8}px;
      --button-border-width: ${current.button_border_width ?? 1}px;
      --button-letter-spacing: ${current.button_letter_spacing ?? 0}px;
      --button-text-transform: ${current.button_text_transform || 'none'};

      /* ====================================================================
       * 4. Cards & Badges
       * ==================================================================== */
      --card-radius: ${current.card_corner_radius ?? 12}px;
      --card-border-width: ${current.card_border_width ?? 1}px;
      --card-image-padding: ${current.card_image_padding ?? 0}px;
      --badge-radius: ${current.badge_shape === 'square' ? '0px' : current.badge_shape === 'rounded' ? '4px' : '9999px'};

      /* ====================================================================
       * 5. Semantic Status & Feedback Colors
       * ==================================================================== */
      --color-success: ${current.color_success || '#16A34A'};
      --color-warning: ${current.color_warning || '#F59E0B'};
      --color-error: ${current.color_error || '#DC2626'};
      --color-info: ${current.color_info || '#2563EB'};
    }

    /* ====================================================================
     * 6. Dynamic Scoped Color Schemes (.color-scheme-1, .color-scheme-2, ...)
     * ==================================================================== */
    ${generateColorSchemeCss(current.color_schemes)}
  `

  return (
    <PageRoot>
      <Global styles={dynamicGlobalStyles} />

      {/* 1. Header Section Group */}
      {headerComponent}

      {/* 2. Main Page Content (Equivalent to {{ content_for_layout }}) */}
      <MainContent>{children}</MainContent>

      {/* 3. Footer Section Group */}
      {footerComponent || (
        <DefaultFooter className="color-scheme-3 gradient">
          <p>
            © 2026 {current.shop_name || 'Teras Sapa Store'}.{' '}
            {current.shop_tagline || 'Modern Headless Commerce'}
          </p>
        </DefaultFooter>
      )}
    </PageRoot>
  )
}
