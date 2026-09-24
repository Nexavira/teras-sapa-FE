import { BentoCardSchema } from '#themes/forge/blocks/bento-card/BentoCard.schema'
import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyBentoSchema: SectionSchema = {
  type: 'company_bento',
  name: 'Bento grid showcase',
  category: 'Editorial',
  description:
    'Versatile 12-column bento grid for showcasing capabilities, principles, project case studies, or articles.',
  tag: 'section',
  class: 'section-company-bento',
  settings: [
    {
      type: 'text',
      id: 'eyebrow',
      label: 'Eyebrow',
      default: 'What we make',
    },
    {
      type: 'textarea',
      id: 'heading',
      label: 'Heading',
      default: 'One partner, from first drawing to factory floor.',
    },
    {
      type: 'checkbox',
      id: 'dark_mode',
      label: 'Dark style background',
      default: true,
    },
    {
      type: 'text',
      id: 'cta_label',
      label: 'Call to action label (Optional)',
      default: 'Explore capabilities',
    },
    {
      type: 'url',
      id: 'cta_url',
      label: 'Call to action URL',
      default: '/preview?theme=forge&template=capabilities',
    },
  ],
  blocks: [BentoCardSchema],
  presets: [
    {
      name: 'Default Bento Showcase',
      settings: {
        eyebrow: 'What we make',
        heading: 'One partner, from first drawing to factory floor.',
        dark_mode: true,
        cta_label: 'Explore capabilities',
        cta_url: '/preview?theme=forge&template=capabilities',
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
  ],
}
