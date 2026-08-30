import type { SectionSchema } from '#themes/types/theme'

export const ImageWithTextSchema: SectionSchema = {
  type: 'image_with_text',
  name: 'Image with text',
  category: 'Editorial',
  description:
    'A Dawn-inspired split editorial section with image, copy, and link.',
  tag: 'section',
  class: 'section-image-with-text',
  settings: [
    {
      type: 'image_picker',
      id: 'image',
      label: 'Image',
      default: '/images/dawn/hero-editorial.webp',
    },
    {
      type: 'select',
      id: 'image_position',
      label: 'Desktop image position',
      default: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      type: 'text',
      id: 'eyebrow',
      label: 'Eyebrow',
      default: 'Considered by design',
    },
    {
      type: 'text',
      id: 'heading',
      label: 'Heading',
      default: 'Fewer things. Better made.',
    },
    {
      type: 'textarea',
      id: 'text',
      label: 'Text',
      default:
        'Natural materials, enduring shapes, and thoughtful details. We make everyday pieces to keep, wear, and live with for years.',
    },
    {
      type: 'text',
      id: 'button_label',
      label: 'Link label',
      default: 'Our approach',
    },
    {
      type: 'text',
      id: 'button_link',
      label: 'Link',
      default: '/pages/about',
    },
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-2',
    },
    {
      type: 'range',
      id: 'padding_top',
      label: 'Top padding',
      min: 0,
      max: 140,
      step: 4,
      unit: 'px',
      default: 88,
    },
    {
      type: 'range',
      id: 'padding_bottom',
      label: 'Bottom padding',
      min: 0,
      max: 140,
      step: 4,
      unit: 'px',
      default: 88,
    },
  ],
  presets: [
    {
      name: 'Image with text',
      category: 'Editorial',
      settings: {
        image: '/images/dawn/hero-editorial.webp',
        image_position: 'left',
        eyebrow: 'Considered by design',
        heading: 'Fewer things. Better made.',
        text: 'Natural materials, enduring shapes, and thoughtful details. We make everyday pieces to keep, wear, and live with for years.',
        button_label: 'Our approach',
        button_link: '/pages/about',
        color_scheme: 'scheme-2',
        padding_top: 88,
        padding_bottom: 88,
      },
    },
  ],
}
