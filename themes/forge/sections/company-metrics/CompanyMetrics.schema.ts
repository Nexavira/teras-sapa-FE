import { GridBlockSchema } from '#themes/forge/blocks/grid/GridBlock.schema'
import { HeadingBlockSchema } from '#themes/forge/blocks/heading/HeadingBlock.schema'
import { MetricItemSchema } from '#themes/forge/blocks/metric-item/MetricItem.schema'
import { TextBlockSchema } from '#themes/forge/blocks/text/TextBlock.schema'
import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyMetricsSchema: SectionSchema = {
  type: 'company_metrics',
  name: 'Metrics & stats',
  category: 'Editorial',
  description:
    'Key operational metrics and stats grid featuring a configurable block grid container for metric items and editorial text.',
  tag: 'section',
  class: 'section-company-metrics',
  settings: [
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-1',
    },
    {
      type: 'checkbox',
      id: 'dark_mode',
      label: 'Dark style background',
      default: false,
    },
  ],
  blocks: [
    HeadingBlockSchema,
    GridBlockSchema,
    MetricItemSchema,
    TextBlockSchema,
  ],
  presets: [
    {
      name: 'Default Metrics',
      settings: {
        color_scheme: 'scheme-1',
        dark_mode: false,
      },
      blocks: [
        {
          type: 'heading',
          settings: {
            heading: 'Industrial capability, human accountability.',
            heading_size: 'large',
            heading_tag: 'h2',
          },
        },
        {
          type: 'grid',
          settings: {
            columns: 3,
            gap: 24,
          },
          blocks: [
            {
              type: 'metric_item',
              settings: {
                stat: '38',
                label: 'years of engineering craft',
                accent: true,
                width: '1',
              },
            },
            {
              type: 'metric_item',
              settings: {
                stat: '0.01',
                label: 'mm verified tolerance',
                accent: false,
                width: '1',
              },
            },
            {
              type: 'metric_item',
              settings: {
                stat: '17',
                label: 'markets delivered',
                accent: false,
                width: '1',
              },
            },
          ],
        },
      ],
    },
  ],
}
