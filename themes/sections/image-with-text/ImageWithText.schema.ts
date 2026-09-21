import { getImageWithTextPresets } from './imageWithTextBlocks'
import {
  EditorialEyebrowBlockSchema,
  EditorialHeadingBlockSchema,
  EditorialImageBlockSchema,
  EditorialLinkBlockSchema,
  EditorialTextBlockSchema,
} from '#themes/blocks/image-with-text/ImageWithTextBlocks.schema'
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
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-2',
    },
    {
      type: 'number',
      id: 'padding_top',
      label: 'Top padding',
      min: 0,
      max: 140,
      step: 4,
      unit: 'px',
      default: 88,
    },
    {
      type: 'number',
      id: 'padding_bottom',
      label: 'Bottom padding',
      min: 0,
      max: 140,
      step: 4,
      unit: 'px',
      default: 88,
    },
  ],
  blocks: [
    EditorialImageBlockSchema,
    EditorialEyebrowBlockSchema,
    EditorialHeadingBlockSchema,
    EditorialTextBlockSchema,
    EditorialLinkBlockSchema,
  ],
  max_blocks: 20,
  presets: [
    {
      name: 'Image with text',
      category: 'Editorial',
      blocks: getImageWithTextPresets(),
      settings: {
        content_blocks_version: 1,
        image_position: 'left',
        color_scheme: 'scheme-2',
        padding_top: 88,
        padding_bottom: 88,
      },
    },
  ],
}
