import type { BlockSchema } from '#themes/shared/types/theme'

export const ImageBlockSchema: BlockSchema = {
  type: 'image',
  name: 'Media frame',
  settings: [
    {
      type: 'image_picker',
      id: 'image',
      label: 'Hero media / image',
      default:
        'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=88',
    },
    {
      type: 'select',
      id: 'media_height',
      label: 'Media frame height',
      default: 'large',
      options: [
        { label: 'Small (440px)', value: 'small' },
        { label: 'Medium (600px)', value: 'medium' },
        { label: 'Large (760px)', value: 'large' },
      ],
    },
    {
      type: 'range',
      id: 'overlay_opacity',
      label: 'Media overlay opacity',
      min: 0,
      max: 90,
      step: 10,
      unit: '%',
      default: 40,
    },
    {
      type: 'checkbox',
      id: 'show_stamp',
      label: 'Show stamp badge',
      default: true,
    },
    {
      type: 'text',
      id: 'stamp_text',
      label: 'Stamp text',
      default: 'Made to\nendure\n↘',
    },
    {
      type: 'select',
      id: 'stamp_position',
      label: 'Stamp position',
      default: 'bottom-right',
      options: [
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Top Right', value: 'top-right' },
      ],
    },
    {
      type: 'select',
      id: 'stamp_color',
      label: 'Stamp color',
      default: 'orange',
      options: [
        { label: 'Forge Orange', value: 'orange' },
        { label: 'Industrial Dark (Ink)', value: 'ink' },
        { label: 'Bone Light', value: 'bone' },
      ],
    },
  ],
}
