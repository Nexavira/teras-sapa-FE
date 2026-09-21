import type { BlockSchema } from '#themes/shared/types/theme'

export const EditorialImageBlockSchema: BlockSchema = {
  type: 'editorial_image',
  name: 'Image',
  limit: 1,
  settings: [
    {
      type: 'image_picker',
      id: 'image',
      label: 'Image',
      default: '/images/dawn/hero-editorial.webp',
    },
    {
      type: 'text',
      id: 'alt',
      label: 'Alt text',
      default: 'Natural everyday essentials',
    },
  ],
}
export const EditorialEyebrowBlockSchema: BlockSchema = {
  type: 'editorial_eyebrow',
  name: 'Eyebrow',
  settings: [
    {
      type: 'text',
      id: 'eyebrow',
      label: 'Eyebrow',
      default: 'Considered by design',
    },
  ],
}
export const EditorialHeadingBlockSchema: BlockSchema = {
  type: 'editorial_heading',
  name: 'Heading',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Heading',
      default: 'Fewer things. Better made.',
    },
  ],
}
export const EditorialTextBlockSchema: BlockSchema = {
  type: 'editorial_text',
  name: 'Text',
  settings: [
    {
      type: 'textarea',
      id: 'text',
      label: 'Text',
      default:
        'Natural materials, enduring shapes, and thoughtful details. We make everyday pieces to keep, wear, and live with for years.',
    },
  ],
}
export const EditorialLinkBlockSchema: BlockSchema = {
  type: 'editorial_link',
  name: 'Link',
  settings: [
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
  ],
}
