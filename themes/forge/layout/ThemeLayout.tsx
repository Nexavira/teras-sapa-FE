import React from 'react'

import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'

import defaultSettingsData from '../config/settings_data.json'
import { ForgeSettingsProvider } from '../settings-context'
import type { ThemeLayoutProps } from '#themes/shared/types/theme'
import { generateColorSchemeCss } from '#themes/shared/utils/colors'

const Root = styled.div`
  min-height: 100dvh;
  overflow: clip;
  background: var(--forge-bone);
  color: var(--forge-ink);
  font-family: var(--forge-body);
  font-size: var(--forge-body-size);
  font-weight: var(--forge-body-weight);
  line-height: var(--forge-body-line-height);
`

const Main = styled.main`
  min-width: 0;
`

export const ThemeLayout: React.FC<ThemeLayoutProps> = ({
  children,
  headerComponent,
  footerComponent,
  globalSettings = defaultSettingsData,
}) => {
  const current = globalSettings.current
  const lightScheme = current.color_schemes?.['scheme-1']?.settings
  const darkScheme = current.color_schemes?.['scheme-2']?.settings
  const motionDuration =
    current.motion_speed === 'fast'
      ? '420ms'
      : current.motion_speed === 'relaxed'
        ? '1100ms'
        : '700ms'
  const buttonShadow =
    current.button_shadow === 'none'
      ? 'none'
      : current.button_shadow === 'subtle'
        ? '0 4px 14px rgba(var(--color-shadow), 0.16)'
        : '0 8px 24px rgba(var(--color-shadow), 0.24)'
  const cardShadow =
    current.card_shadow === 'none'
      ? 'none'
      : current.card_shadow === 'raised'
        ? '0 18px 48px rgba(var(--color-shadow), 0.14)'
        : 'inset 0 0 0 var(--forge-card-border-width) rgba(var(--color-shadow), 0.06)'
  const styles = css`
    :root {
      --forge-ink: ${lightScheme?.text || '#171915'};
      --forge-bone: ${lightScheme?.background || '#e9e7e1'};
      --forge-paper: ${current.surface_color || '#f4f1e9'};
      --forge-dark: ${darkScheme?.background || '#171915'};
      --forge-dark-text: ${darkScheme?.text || '#f4f1e9'};
      --forge-steel: ${current.muted_color || '#6b6e66'};
      --forge-orange: ${current.accent_color || '#f15a24'};
      --forge-heading: ${current.font_heading || "Geist, 'Avenir Next', sans-serif"};
      --forge-heading-weight: ${current.font_heading_weight || '500'};
      --forge-heading-scale: ${(current.heading_scale ?? 100) / 100};
      --forge-heading-letter-spacing: ${current.heading_letter_spacing ?? -1}px;
      --forge-heading-text-transform: ${current.heading_text_transform || 'none'};
      --forge-body: ${current.font_body || "'Plus Jakarta Sans', 'Avenir Next', sans-serif"};
      --forge-body-weight: ${current.font_body_weight || '400'};
      --forge-body-size: ${current.font_body_base_size ?? 15}px;
      --forge-body-line-height: ${current.font_body_line_height ?? 1.65};
      --forge-page-width: ${current.page_width ?? 1440}px;
      --forge-content-width: ${current.content_width ?? 930}px;
      --forge-gutter-desktop: ${current.gutter_desktop ?? 72}px;
      --forge-gutter-mobile: ${current.gutter_mobile ?? 16}px;
      --forge-grid-gap: ${current.grid_gap ?? 8}px;
      --forge-section-space: ${current.section_space_desktop ?? 120}px;
      --forge-section-space-mobile: ${current.section_space_mobile ?? 88}px;
      --forge-button-radius: ${current.button_border_radius ?? 32}px;
      --forge-button-border-width: ${current.button_border_width ?? 1}px;
      --forge-button-letter-spacing: ${current.button_letter_spacing ?? 0}px;
      --forge-button-text-transform: ${current.button_text_transform || 'none'};
      --forge-button-shadow: ${buttonShadow};
      --forge-card-radius: ${current.card_corner_radius ?? 30}px;
      --forge-card-border-width: ${current.card_border_width ?? 1}px;
      --forge-card-shadow: ${cardShadow};
      --forge-media-radius: ${current.media_corner_radius ?? 24}px;
      --forge-pill-radius: ${current.pill_corner_radius ?? 32}px;
      --forge-input-radius: ${current.input_corner_radius ?? 22}px;
      --forge-input-border-width: ${current.input_border_width ?? 1}px;
      --forge-input-focus: ${current.input_focus_color || current.accent_color || '#f15a24'};
      --forge-success: ${current.color_success || '#247a4a'};
      --forge-warning: ${current.color_warning || '#b76b1d'};
      --forge-error: ${current.color_error || '#b6382f'};
      --forge-info: ${current.color_info || '#356899'};
      --forge-ease: cubic-bezier(0.32, 0.72, 0, 1);
      --forge-motion-duration: ${motionDuration};
      --forge-logo-width: ${current.logo_width ?? 180}px;
      --forge-logo-width-mobile: ${current.logo_width_mobile ?? 140}px;
    }

    ${generateColorSchemeCss(current.color_schemes)}

    * {
      box-sizing: border-box;
    }
    html {
      scroll-behavior: smooth;
    }
    body {
      margin: 0;
      background: var(--forge-bone);
    }
    button,
    input,
    textarea,
    select {
      font: inherit;
    }
    a {
      color: inherit;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-family: var(--forge-heading) !important;
      font-weight: var(--forge-heading-weight) !important;
      text-transform: var(--forge-heading-text-transform);
    }
    [data-forge-reveal='off'] [data-reveal] {
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
    }
    [data-forge-hover='off'] a:hover,
    [data-forge-hover='off'] button:hover {
      transform: none !important;
      filter: none !important;
    }
    [data-forge-page-transition='fade'] main {
      animation: forge-page-fade var(--forge-motion-duration) var(--forge-ease)
        both;
    }
    [data-forge-page-transition='rise'] main {
      animation: forge-page-rise var(--forge-motion-duration) var(--forge-ease)
        both;
    }
    @keyframes forge-page-fade {
      from {
        opacity: 0;
      }
    }
    @keyframes forge-page-rise {
      from {
        opacity: 0;
        transform: translateY(18px);
      }
    }
    ::selection {
      background: var(--forge-orange);
      color: var(--forge-ink);
    }
    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `

  return (
    <ForgeSettingsProvider value={current}>
      <Root
        data-forge-button-hover={current.button_hover_effect || 'lift'}
        data-forge-hover={
          current.animations_hover_motion === false ? 'off' : 'on'
        }
        data-forge-page-transition={
          current.animations_page_transition || 'fade'
        }
        data-forge-reveal={
          current.animations_reveal_on_scroll === false ? 'off' : 'on'
        }
      >
        <Global styles={styles} />
        {headerComponent}
        <Main>{children}</Main>
        {footerComponent}
      </Root>
    </ForgeSettingsProvider>
  )
}
