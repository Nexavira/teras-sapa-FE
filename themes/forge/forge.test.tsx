import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PageRenderer } from '#/routes/preview/-components/PageRenderer'

import { forgeTheme } from './index'
import { ThemeLayout } from './layout/ThemeLayout'
import { CompanyFooter } from './sections/company-footer/CompanyFooter'
import { CompanyHeader } from './sections/company-header/CompanyHeader'
import { CompanyHero } from './sections/company-hero/CompanyHero'
import { CompanyHeroSchema } from './sections/company-hero/CompanyHero.schema'
import { Reveal } from './snippets/Reveal'
import { BlockRenderer } from '#themes/shared/components/BlockRenderer'

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
    expect(blockTypes).toContain('image')
  })

  it('has all blocks registered in forgeTheme.BlockRegistry', () => {
    expect(forgeTheme.BlockRegistry.heading).toBeDefined()
    expect(forgeTheme.BlockRegistry.text).toBeDefined()
    expect(forgeTheme.BlockRegistry.button).toBeDefined()
    expect(forgeTheme.BlockRegistry.hero_meta).toBeDefined()
    expect(forgeTheme.BlockRegistry.flex).toBeDefined()
    expect(forgeTheme.BlockRegistry.grid).toBeDefined()
    expect(forgeTheme.BlockRegistry.image).toBeDefined()
    expect(forgeTheme.BlockRegistry.metric_item).toBeDefined()
  })

  it('renders CompanyHero with child blocks', () => {
    const { container } = render(
      <CompanyHero
        id="hero_test"
        settings={{
          layout_style: 'frame',
          dark_mode: false,
        }}
        blockOrder={['meta_1', 'heading_1', 'text_1', 'button_1', 'image_1']}
        blocks={{
          meta_1: {
            type: 'hero_meta',
            settings: {},
          },
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
          image_1: {
            type: 'image',
            settings: {
              show_stamp: true,
              stamp_text: 'Test Stamp',
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
          settings={{ color_scheme: 'scheme-2' }}
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
        <CompanyHero id="legacy_dark_hero" settings={{ dark_mode: true }} />
      </ThemeLayout>,
    )

    expect(
      container.querySelector('[data-color-scheme="scheme-2"]'),
    ).not.toBeNull()
  })

  it('does not render fallback content when no blocks provided', () => {
    const { container } = render(
      <CompanyHero id="hero_no_blocks" settings={{}} />,
    )

    expect(container.textContent).not.toContain('Legacy Eyebrow')
    expect(container.textContent).not.toContain('Legacy Meta')
    expect(container.textContent).not.toContain('Engineered with intent')
  })

  describe('Global Reveal component', () => {
    it('renders block reveal with data-reveal and data-reveal-block attributes', () => {
      const { container } = render(
        <Reveal variant="block">
          <div data-testid="child">Block Content</div>
        </Reveal>,
      )

      const revealEl = container.querySelector('[data-reveal-block="true"]')
      expect(revealEl).not.toBeNull()
      expect(revealEl?.getAttribute('data-reveal')).toBe('')
      expect(container.textContent).toContain('Block Content')
    })

    it('disables animation and renders clean container when enabled is false', () => {
      const { container } = render(
        <Reveal enabled={false} variant="block">
          <div>Disabled Animation Block</div>
        </Reveal>,
      )

      expect(container.querySelector('[data-reveal]')).toBeNull()
      const disabledEl = container.querySelector(
        '[data-reveal-disabled="true"]',
      )
      expect(disabledEl).not.toBeNull()
      expect(container.textContent).toContain('Disabled Animation Block')
    })

    it('renders text reveal with string delimiter separator', () => {
      const { container } = render(
        <Reveal
          variant="text"
          text="Design / Precision / Performance"
          separator=" / "
        />,
      )

      expect(
        container.querySelector('[data-reveal-text="true"]'),
      ).not.toBeNull()
      const separators = container.querySelectorAll('.reveal-inline-separator')
      expect(separators.length).toBe(2)
      separators.forEach((sep) => expect(sep.textContent).toBe(' / '))
      expect(container.textContent).toContain('Design')
      expect(container.textContent).toContain('Precision')
      expect(container.textContent).toContain('Performance')
    })

    it('renders text reveal with custom ReactNode separator', () => {
      const { container } = render(
        <Reveal
          variant="text"
          separator={<span data-testid="custom-dot">•</span>}
        >
          <span>Alpha</span>
          <span>Beta</span>
          <span>Gamma</span>
        </Reveal>,
      )

      const dots = container.querySelectorAll('[data-testid="custom-dot"]')
      expect(dots.length).toBe(2)
      expect(container.textContent).toContain('Alpha')
      expect(container.textContent).toContain('Beta')
      expect(container.textContent).toContain('Gamma')
    })

    it('renders visual separator line when separator is true', () => {
      const { container } = render(
        <Reveal variant="text" text="Single Headline" separator={true} />,
      )

      expect(container.querySelector('.reveal-visual-separator')).not.toBeNull()
      expect(container.textContent).toContain('Single Headline')
    })

    it('declares reveal motion settings in global settings schema', () => {
      const motionCategory = forgeTheme.settingsSchemaData.find(
        (category) => category.name === 'Motion & Interactions',
      )
      const settingIds = motionCategory?.settings?.map((s) => s.id)

      expect(settingIds).toContain('animations_reveal_on_scroll')
      expect(settingIds).toContain('reveal_duration')
      expect(settingIds).toContain('reveal_delay')
      expect(settingIds).toContain('reveal_stagger')

      expect(forgeTheme.defaultSettingsData.current.reveal_duration).toBe(900)
      expect(forgeTheme.defaultSettingsData.current.reveal_delay).toBe(0)
      expect(forgeTheme.defaultSettingsData.current.reveal_stagger).toBe(100)
    })

    it('injects global reveal timing CSS variables into ThemeLayout :root', () => {
      const { container } = render(
        <ThemeLayout
          globalSettings={{
            current: {
              ...forgeTheme.defaultSettingsData.current,
              reveal_duration: 1200,
              reveal_delay: 200,
              reveal_stagger: 150,
            },
          }}
        >
          <div>Content</div>
        </ThemeLayout>,
      )

      const styleTags = container.querySelectorAll('style')
      const allCss = Array.from(styleTags)
        .map((s) => s.textContent || '')
        .join(' ')

      expect(allCss).toContain('--forge-reveal-duration: 1200ms')
      expect(allCss).toContain('--forge-reveal-delay: 200ms')
      expect(allCss).toContain('--forge-reveal-stagger: 150ms')
    })

    it('provides enable_reveal setting for blocks in BlockRegistry', () => {
      const headingSchema = forgeTheme.BlockRegistry.heading.schema
      const enableRevealSetting = headingSchema.settings.find(
        (s) => s.id === 'enable_reveal',
      )

      expect(enableRevealSetting).toBeDefined()
      expect(enableRevealSetting?.type).toBe('checkbox')
      expect(enableRevealSetting?.default).toBe(true)
    })

    it('passes data-reveal-disabled on BlockRenderer when enable_reveal is false', () => {
      const { container } = render(
        <BlockRenderer
          sectionId="hero"
          blockId="h1"
          blockRegistry={forgeTheme.BlockRegistry}
          block={{
            type: 'heading',
            settings: {
              heading: 'No Animation Title',
              enable_reveal: false,
            },
          }}
        />,
      )

      const blockEl = container.querySelector('[data-reveal-disabled="true"]')
      expect(blockEl).not.toBeNull()
      expect(container.textContent).toContain('No Animation Title')
    })
  })

  describe('CompanyMetrics (Metrics & stats)', () => {
    it('has eyebrow and heading removed from section settings schema, separating heading to blocks', () => {
      const settingIds = CompanyMetricsSchema.settings.map((s) => s.id)
      expect(settingIds).not.toContain('eyebrow')
      expect(settingIds).not.toContain('heading')
      expect(settingIds).toContain('color_scheme')
      expect(settingIds).toContain('dark_mode')
    })

    it('declares heading, grid, metric_item, and text in CompanyMetricsSchema.blocks', () => {
      const blockTypes = CompanyMetricsSchema.blocks?.map((b) => b.type)
      expect(blockTypes).toContain('heading')
      expect(blockTypes).toContain('grid')
      expect(blockTypes).toContain('metric_item')
      expect(blockTypes).toContain('text')
    })

    it('declares metric_item, text, and heading in GridBlockSchema.blocks', () => {
      const childTypes = GridBlockSchema.blocks?.map((b) => b.type)
      expect(childTypes).toContain('metric_item')
      expect(childTypes).toContain('text')
      expect(childTypes).toContain('heading')
    })

    it('has columns range setting (1-12) on GridBlockSchema to manage columns', () => {
      const columnsSetting = GridBlockSchema.settings.find(
        (s) => s.id === 'columns',
      )
      expect(columnsSetting).toBeDefined()
      expect(columnsSetting?.type).toBe('range')
      expect(columnsSetting?.min).toBe(1)
      expect(columnsSetting?.max).toBe(12)
      expect(columnsSetting?.step).toBe(1)
      expect(columnsSetting?.default).toBe(3)

      const gapSetting = GridBlockSchema.settings.find((s) => s.id === 'gap')
      expect(gapSetting).toBeDefined()

      const metricItemSchema = forgeTheme.BlockRegistry.metric_item.schema
      const metricWidthSetting = metricItemSchema.settings.find(
        (s) => s.id === 'width',
      )
      expect(metricWidthSetting).toBeDefined()

      const textSchema = forgeTheme.BlockRegistry.text.schema
      const textWidthSetting = textSchema.settings.find((s) => s.id === 'width')
      expect(textWidthSetting).toBeDefined()
    })

    it('renders CompanyMetrics with standalone heading block and grid container with columns', () => {
      const { container } = render(
        <CompanyMetrics
          id="metrics_section"
          settings={{
            dark_mode: false,
          }}
          blockOrder={['heading_1', 'grid_1']}
          blocks={{
            heading_1: {
              type: 'heading',
              settings: {
                heading: 'Engineered Precision',
                heading_size: 'large',
                heading_tag: 'h2',
              },
            },
            grid_1: {
              type: 'grid',
              settings: {
                columns: 3,
                gap: 24,
              },
              block_order: ['text_1', 'metric_1', 'metric_2'],
              blocks: {
                text_1: {
                  type: 'text',
                  settings: {
                    text: 'Measured impact across all operations.',
                    text_style: 'intro',
                    width: '2',
                  },
                },
                metric_1: {
                  type: 'metric_item',
                  settings: {
                    stat: '99.9%',
                    label: 'quality yield rate',
                    accent: true,
                    width: '1',
                  },
                },
                metric_2: {
                  type: 'metric_item',
                  settings: {
                    stat: '0.005',
                    label: 'mm micron calibration',
                    accent: false,
                    width: '3',
                  },
                },
              },
            },
          }}
        />,
      )

      expect(container.textContent).toContain('Engineered Precision')
      expect(container.textContent).toContain(
        'Measured impact across all operations.',
      )
      expect(container.textContent).toContain('99.9%')
      expect(container.textContent).toContain('quality yield rate')
      expect(container.textContent).toContain('0.005')
      expect(container.textContent).toContain('mm micron calibration')
      expect(container.textContent).not.toContain('Scale / measured')
    })

    it('supports direct metric_item blocks for backward compatibility', () => {
      const { container } = render(
        <CompanyMetrics
          id="legacy_metrics"
          settings={{
            heading: 'Legacy Metrics',
            dark_mode: true,
          }}
          blockOrder={['metric_1', 'metric_2']}
          blocks={{
            metric_1: {
              type: 'metric_item',
              settings: {
                stat: '500+',
                label: 'industrial components shipped',
                accent: false,
              },
            },
            metric_2: {
              type: 'metric_item',
              settings: {
                stat: '24/7',
                label: 'continuous production uptime',
                accent: true,
              },
            },
          }}
        />,
      )

      expect(container.textContent).toContain('Legacy Metrics')
      expect(container.textContent).toContain('500+')
      expect(container.textContent).toContain('industrial components shipped')
      expect(container.textContent).toContain('24/7')
      expect(container.textContent).toContain('continuous production uptime')
    })

    it('applies selected color scheme and keeps legacy dark mode compatible', () => {
      const { container: schemeContainer } = render(
        <CompanyMetrics
          id="metrics_scheme"
          settings={{ color_scheme: 'scheme-2' }}
        />,
      )
      const sectionEl = schemeContainer.querySelector(
        '[data-color-scheme="scheme-2"]',
      )
      expect(sectionEl).not.toBeNull()
      expect(sectionEl?.classList.contains('color-scheme-2')).toBe(true)

      const { container: legacyContainer } = render(
        <CompanyMetrics id="metrics_legacy" settings={{ dark_mode: true }} />,
      )
      const legacyEl = legacyContainer.querySelector(
        '[data-color-scheme="scheme-2"]',
      )
      expect(legacyEl).not.toBeNull()
      expect(legacyEl?.classList.contains('color-scheme-2')).toBe(true)
    })
  })
})
