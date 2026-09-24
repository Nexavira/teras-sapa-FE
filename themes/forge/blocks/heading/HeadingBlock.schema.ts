import type { BlockSchema } from '#themes/shared/types/theme'

export const HeadingBlockSchema: BlockSchema = {
  type: 'heading',
  name: 'Heading',
  description:
    'Industrial display or section heading with configurable typography and HTML tag.',
  settings: [
    {
      type: 'textarea',
      id: 'heading',
      label: 'Heading text',
      default: 'Engineered with intent. Built without compromise.',
    },
    {
      type: 'select',
      id: 'heading_size',
      label: 'Size',
      default: 'display',
      options: [
        { label: 'Display (Oversized Hero)', value: 'display' },
        { label: 'Large (Editorial H1)', value: 'large' },
        { label: 'Medium (Section H2)', value: 'medium' },
        { label: 'Small (Subheading H3)', value: 'small' },
      ],
    },
    {
      type: 'select',
      id: 'heading_tag',
      label: 'HTML tag',
      default: 'h1',
      options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
        { label: 'span', value: 'span' },
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
  ],
}
