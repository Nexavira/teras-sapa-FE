import type { BlockSchema } from '#themes/shared/types/theme'

export const TextBlockSchema: BlockSchema = {
  type: 'text',
  name: 'Text & introduction',
  description:
    'Editorial body paragraph, introduction lead text, or description.',
  settings: [
    {
      type: 'textarea',
      id: 'text',
      label: 'Content',
      default:
        'Precision manufacturing for the systems that keep the world moving.',
    },
    {
      type: 'select',
      id: 'text_style',
      label: 'Style',
      default: 'intro',
      options: [
        { label: 'Introduction Lead (Large)', value: 'intro' },
        { label: 'Body Text', value: 'body' },
        { label: 'Caption / Small', value: 'caption' },
      ],
    },
    {
      type: 'select',
      id: 'text_align',
      label: 'Text alignment',
      default: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      type: 'range',
      id: 'max_width',
      label: 'Maximum width',
      min: 320,
      max: 1200,
      step: 20,
      unit: 'px',
      default: 620,
    },
    {
      type: 'select',
      id: 'width',
      label: 'Grid width',
      default: '1',
      options: [
        { label: '1 column', value: '1' },
        { label: '2 columns', value: '2' },
        { label: '3 columns (Full width)', value: '3' },
      ],
    },
  ],
}
