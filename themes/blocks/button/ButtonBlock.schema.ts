import type { BlockSchema } from '#themes/types/theme'

export const ButtonBlockSchema: BlockSchema = {
  type: 'button',
  name: 'Button',
  settings: [
    {
      type: 'text',
      id: 'button_label',
      label: 'Button Label',
      default: 'Shop Collection',
    },
    {
      type: 'url',
      id: 'button_link',
      label: 'Button Link',
      default: '/collections/all',
    },
    {
      type: 'select',
      id: 'button_style',
      label: 'Button Style',
      default: 'primary',
      options: [
        { label: 'Primary White', value: 'primary' },
        { label: 'Brand Accent', value: 'accent' },
        { label: 'Outline', value: 'outline' },
      ],
    },
  ],
}
