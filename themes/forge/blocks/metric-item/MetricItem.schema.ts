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
    {
      type: 'select',
      id: 'width',
      label: 'Grid width',
      default: '1',
      options: [
        { label: '1 column', value: '1' },
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
      ],
    },
  ],
}
