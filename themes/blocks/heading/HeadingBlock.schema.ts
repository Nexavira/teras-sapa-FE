import type { BlockSchema } from '#themes/types/theme'

export const HeadingBlockSchema: BlockSchema = {
  type: 'heading',
  name: 'Heading',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Heading Text',
      default: 'Elevate Your Everyday Style',
    },
    {
      type: 'select',
      id: 'heading_size',
      label: 'Heading Size',
      default: 'large',
      options: [
        { label: 'Small (24px)', value: 'small' },
        { label: 'Medium (36px)', value: 'medium' },
        { label: 'Large (44px)', value: 'large' },
      ],
    },
    {
      type: 'select',
      id: 'heading_tag',
      label: 'HTML Tag',
      default: 'h2',
      options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
      ],
    },
  ],
}
