import type { BlockSchema } from '#themes/types/theme'

export const TextBlockSchema: BlockSchema = {
  type: 'text',
  name: 'Text',
  settings: [
    {
      type: 'textarea',
      id: 'text',
      label: 'Text Content',
      default:
        'Discover the latest seasonal collection crafted with sustainable materials and timeless silhouettes.',
    },
    {
      type: 'select',
      id: 'text_style',
      label: 'Text Style',
      default: 'subheading',
      options: [
        { label: 'Body (14px)', value: 'body' },
        { label: 'Subheading (18px)', value: 'subheading' },
      ],
    },
  ],
}
