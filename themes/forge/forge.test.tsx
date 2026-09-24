import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PageRenderer } from '#/routes/preview/-components/PageRenderer'

import { forgeTheme } from './index'
import { ThemeLayout } from './layout/ThemeLayout'
import { CompanyFooter } from './sections/company-footer/CompanyFooter'
import { CompanyHeader } from './sections/company-header/CompanyHeader'
import { CompanyHero } from './sections/company-hero/CompanyHero'
import { CompanyHeroSchema } from './sections/company-hero/CompanyHero.schema'

afterEach(cleanup)

describe('Forge manufacturing theme', () => {
  it('ships complete global setting categories with persisted defaults', () => {
    const categories = forgeTheme.settingsSchemaData.filter(
      (category) => category.name !== 'theme_info',
    )
    const settingIds = categories.flatMap(
      (category) => category.settings?.map((setting) => setting.id) || [],
    )

    expect(categories.map((category) => category.name)).toEqual([
      'Brand & Identity',
      'Colors',
      'Typography',
      'Layout & Grid',
      'Buttons & CTAs',
      'Cards & Surfaces',
      'Forms',
      'Motion & Interactions',
      'Social Links',
    ])
    expect(settingIds.length).toBeGreaterThanOrEqual(45)

    settingIds
      .filter((id) => id !== 'color_schemes')
      .forEach((id) =>
        expect(forgeTheme.defaultSettingsData.current).toHaveProperty(id),
      )
  })

  it('uses global brand settings in the Forge header and footer', () => {
    const { container } = render(
      <ThemeLayout
        globalSettings={{
          current: {
            ...forgeTheme.defaultSettingsData.current,
            company_name: 'Northstar Fabrication',
            company_tagline: 'Built for demanding environments',
            logo: 'https://example.com/northstar.svg',
            social_linkedin: 'https://linkedin.com/company/northstar',
          },
        }}
        headerComponent={<CompanyHeader id="header" settings={{}} />}
        footerComponent={<CompanyFooter id="footer" settings={{}} />}
      >
        <div>Page content</div>
      </ThemeLayout>,
    )

    expect(
      container.querySelector('img[alt="Northstar Fabrication"]'),
    ).not.toBeNull()
    expect(container.textContent).toContain('Built for demanding environments')
    expect(container.textContent).toContain('Northstar Fabrication')
    expect(
      container.querySelector(
        'a[href="https://linkedin.com/company/northstar"]',
      ),
    ).not.toBeNull()
  })

  it.each(Object.keys(forgeTheme.templateCatalog))(
    'renders the %s template without missing sections',
    (templateId) => {
      const { container } = render(
        <PageRenderer themeId="forge" templateId={templateId} />,
      )

      expect(container.querySelector('h1')).not.toBeNull()
      expect(container.textContent).not.toContain('Unknown section type')
      expect(container.textContent).toContain('ATLAS / INDUSTRIES')
    },
  )

  it('declares block support in CompanyHeroSchema matching Dawn architecture', () => {
    expect(CompanyHeroSchema.blocks).toBeDefined()
    const blockTypes = CompanyHeroSchema.blocks?.map((b) => b.type)
    expect(blockTypes).toContain('heading')
    expect(blockTypes).toContain('text')
    expect(blockTypes).toContain('button')
    expect(blockTypes).toContain('hero_meta')
    expect(blockTypes).toContain('flex')
  })

  it('has all blocks registered in forgeTheme.BlockRegistry', () => {
    expect(forgeTheme.BlockRegistry.heading).toBeDefined()
    expect(forgeTheme.BlockRegistry.text).toBeDefined()
    expect(forgeTheme.BlockRegistry.button).toBeDefined()
    expect(forgeTheme.BlockRegistry.hero_meta).toBeDefined()
    expect(forgeTheme.BlockRegistry.flex).toBeDefined()
  })

  it('renders CompanyHero with child blocks', () => {
    const { container } = render(
      <CompanyHero
        id="hero_test"
        settings={{
          layout_style: 'frame',
          dark_mode: false,
          show_stamp: true,
          stamp_text: 'Test Stamp',
        }}
        blockOrder={['meta_1', 'heading_1', 'text_1', 'button_1']}
        blocks={{
          heading_1: {
            type: 'heading',
            settings: {
              heading: 'Precision Engineering Unit',
              heading_size: 'display',
              heading_tag: 'h1',
            },
          },
          text_1: {
            type: 'text',
            settings: {
              text: 'Custom crafted industrial components.',
              text_style: 'intro',
            },
          },
          button_1: {
            type: 'button',
            settings: {
              button_label: 'Get in touch',
              button_link: '/contact',
              button_style: 'accent',
            },
          },
        }}
      />,
    )

    expect(container.textContent).toContain('Industrial / 01')
    expect(container.textContent).toContain('EST. 2026')
    expect(container.textContent).toContain('Precision Engineering Unit')
    expect(container.textContent).toContain(
      'Custom crafted industrial components.',
    )
    expect(container.textContent).toContain('Get in touch')
    expect(container.textContent).toContain('Test Stamp')
  })

  it('applies the selected color scheme to the hero banner', () => {
    const { container } = render(
      <ThemeLayout>
        <CompanyHero
          id="hero_color_scheme"
          settings={{ color_scheme: 'scheme-2', show_media: false }}
        />
      </ThemeLayout>,
    )

    const hero = container.querySelector('[data-color-scheme="scheme-2"]')
    expect(hero).not.toBeNull()
    expect(hero?.classList.contains('color-scheme-2')).toBe(true)
  })

  it('keeps legacy dark hero settings compatible', () => {
    const { container } = render(
      <ThemeLayout>
        <CompanyHero
          id="legacy_dark_hero"
          settings={{ dark_mode: true, show_media: false }}
        />
      </ThemeLayout>,
    )

    expect(
      container.querySelector('[data-color-scheme="scheme-2"]'),
    ).not.toBeNull()
  })

  it('renders CompanyHero with fallback settings when no blocks provided', () => {
    const { container } = render(
      <CompanyHero
        id="hero_fallback"
        settings={{
          title: 'Legacy Title Without Blocks',
          intro: 'Legacy Intro Paragraph',
          button_label: 'Legacy Button',
          button_link: '/legacy',
        }}
      />,
    )

    expect(container.textContent).toContain('Legacy Eyebrow')
    expect(container.textContent).toContain('Legacy Meta')
    expect(container.textContent).toContain('Legacy Title Without Blocks')
    expect(container.textContent).toContain('Legacy Intro Paragraph')
    expect(container.textContent).toContain('Legacy Button')
  })
})
