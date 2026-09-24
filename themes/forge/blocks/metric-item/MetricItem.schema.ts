import type { BlockSchema } from '#themes/shared/types/theme'

export const MetricItemSchema: BlockSchema = {
  type: 'metric_item',
  name: 'Metric item',
  icon: 'lucide:bar-chart',
  settings: [
    {
      type: 'text',
      id: 'stat',
      label: 'Stat / Value',
      default: '38',
      placeholder: 'e.g. 38 or 0.01 mm',
    },
    {
      type: 'text',
      id: 'label',
      label: 'Label',
      default: 'years of engineering craft',
      placeholder: 'Metric description',
    },
    {
      type: 'checkbox',
      id: 'accent',
      label: 'Accent highlight (Orange background)',
      default: false,
    },
  ],
}
