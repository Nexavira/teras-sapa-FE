import type { BlockSchema } from '#themes/shared/types/theme'

export const ButtonBlockSchema: BlockSchema = {
  type: 'button',
  name: 'Action button',
  description:
    'Industrial call-to-action button linking to internal pages or external destinations.',
  settings: [
    {
      type: 'text',
      id: 'button_label',
      label: 'Button label',
      default: 'Explore capabilities',
    },
    {
      type: 'text',
      id: 'button_link',
      label: 'Button link',
      default: '/preview?theme=forge&template=capabilities',
    },
    {
      type: 'select',
      id: 'button_style',
      label: 'Style',
      default: 'primary',
      options: [
        { label: 'Primary (Industrial Dark)', value: 'primary' },
        { label: 'Accent (Forge Orange)', value: 'accent' },
        { label: 'Outline (Steel Border)', value: 'outline' },
      ],
    },
    {
      type: 'select',
      id: 'button_size',
      label: 'Size',
      default: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
  ],
}
