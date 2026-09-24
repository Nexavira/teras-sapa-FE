import { MetricItemSchema } from '#themes/forge/blocks/metric-item/MetricItem.schema'
import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyMetricsSchema: SectionSchema = {
  type: 'company_metrics',
  name: 'Metrics & stats',
  category: 'Editorial',
  description:
    'Key operational metrics and stats grid featuring reorderable metric blocks with optional accent coloring.',
  tag: 'section',
  class: 'section-company-metrics',
  settings: [
    {
      type: 'text',
      id: 'eyebrow',
      label: 'Eyebrow',
      default: 'Scale / measured',
    },
    {
      type: 'textarea',
      id: 'heading',
      label: 'Heading',
      default: 'Industrial capability, human accountability.',
    },
    {
      type: 'checkbox',
      id: 'dark_mode',
      label: 'Dark style background',
      default: false,
    },
  ],
  blocks: [MetricItemSchema],
  presets: [
    {
      name: 'Default Metrics',
      settings: {
        eyebrow: 'Scale / measured',
        heading: 'Industrial capability, human accountability.',
        dark_mode: false,
      },
      blocks: [
        {
          type: 'metric_item',
          settings: {
            stat: '38',
            label: 'years of engineering craft',
            accent: true,
          },
        },
        {
          type: 'metric_item',
          settings: {
            stat: '0.01',
            label: 'mm verified tolerance',
            accent: false,
          },
        },
        {
          type: 'metric_item',
          settings: {
            stat: '17',
            label: 'markets delivered',
            accent: false,
          },
        },
      ],
    },
  ],
}
