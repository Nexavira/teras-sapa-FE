import { BentoCardSchema } from '#themes/forge/blocks/bento-card/BentoCard.schema'
import { ButtonBlockSchema } from '#themes/forge/blocks/button/ButtonBlock.schema'
import { FlexBlockSchema } from '#themes/forge/blocks/flex/FlexBlock.schema'
import { GridBlockSchema } from '#themes/forge/blocks/grid/GridBlock.schema'
import { HeadingBlockSchema } from '#themes/forge/blocks/heading/HeadingBlock.schema'
import { HeroMetaBlockSchema } from '#themes/forge/blocks/hero-meta/HeroMetaBlock.schema'
import { TextBlockSchema } from '#themes/forge/blocks/text/TextBlock.schema'
import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyBentoSchema: SectionSchema = {
  type: 'company_bento',
  name: 'Bento grid showcase',
  category: 'Editorial',
  description:
    'Versatile 12-column bento grid for showcasing capabilities, principles, project case studies, or articles with modular blocks.',
  tag: 'section',
  class: 'section-company-bento',
  settings: [
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-2',
    },
    {
      type: 'checkbox',
      id: 'dark_mode',
      label: 'Dark style background',
      default: true,
    },
  ],
  blocks: [
    HeadingBlockSchema,
    HeroMetaBlockSchema,
    TextBlockSchema,
    GridBlockSchema,
    BentoCardSchema,
    ButtonBlockSchema,
    FlexBlockSchema,
  ],
  presets: [
    {
      name: 'Default Bento Showcase',
      settings: {
        color_scheme: 'scheme-2',
        dark_mode: true,
      },
      blocks: [
        {
          type: 'hero_meta',
          settings: {
            eyebrow: 'What we make',
            meta: '',
          },
        },
        {
          type: 'heading',
          settings: {
            heading: 'One partner, from first drawing to factory floor.',
            heading_size: 'large',
            heading_tag: 'h2',
          },
        },
        {
          type: 'grid',
          settings: {
            columns: 12,
            gap: 20,
          },
          blocks: [
            {
              type: 'bento_card',
              settings: {
                tag: '01 / Capability',
                title: 'Precision fabrication',
                description:
                  'Five-axis machining, robotic welding and complex metalwork held to microscopic tolerances.',
                span: '7',
                dark: true,
              },
            },
            {
              type: 'bento_card',
              settings: {
                tag: '02 / Capability',
                title: 'Systems integration',
                description:
                  'Mechanical, electrical and control systems assembled, tested and commissioned as one.',
                span: '5',
                dark: true,
              },
            },
            {
              type: 'bento_card',
              settings: {
                tag: '03 / Capability',
                title: 'Industrial automation',
                description:
                  'Purpose-built production cells that improve repeatability, throughput and operator safety.',
                span: '12',
                dark: true,
              },
            },
          ],
        },
        {
          type: 'button',
          settings: {
            button_label: 'Explore capabilities',
            button_link: '/preview?theme=forge&template=capabilities',
            button_style: 'primary',
          },
        },
      ],
    },
  ],
}
