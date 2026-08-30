import { ButtonBlockSchema } from '#themes/blocks/button/ButtonBlock.schema'
import { FlexBlockSchema } from '#themes/blocks/flex/FlexBlock.schema'
import { HeadingBlockSchema } from '#themes/blocks/heading/HeadingBlock.schema'
import { TextBlockSchema } from '#themes/blocks/text/TextBlock.schema'
import type { SectionSchema } from '#themes/types/theme'

export const FeaturedCollectionSchema: SectionSchema = {
  type: 'featured_collection',
  name: 'Featured Collection',
  category: 'Collection',
  description:
    'Display a curated grid of products with image, pricing, badges, and quick add-to-cart.',
  tag: 'section',
  class: 'section-featured-collection',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Section Heading',
      default: 'Featured Collection',
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Section Subtitle',
      default:
        'Explore our handpicked curation of bestsellers and essential pieces.',
    },
    {
      type: 'range',
      id: 'products_to_show',
      label: 'Products to Show',
      min: 2,
      max: 8,
      step: 1,
      default: 4,
    },
    {
      type: 'image_picker',
      id: 'product_image_sheet',
      label: 'Product image sheet',
      info: 'A square 2 × 2 contact sheet for the first four products.',
      default: '/images/dawn/product-grid.webp',
    },
    {
      type: 'select',
      id: 'columns_desktop',
      label: 'Desktop Columns',
      default: '4',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      type: 'checkbox',
      id: 'show_view_all',
      label: 'Show "View All" button',
      default: true,
    },
    {
      type: 'checkbox',
      id: 'show_quick_add',
      label: 'Show quick add',
      default: true,
    },
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-1',
    },
    {
      type: 'range',
      id: 'padding_top',
      label: 'Top Padding',
      min: 0,
      max: 80,
      step: 8,
      unit: 'px',
      default: 48,
    },
    {
      type: 'range',
      id: 'padding_bottom',
      label: 'Bottom Padding',
      min: 0,
      max: 80,
      step: 8,
      unit: 'px',
      default: 48,
    },
  ],
  blocks: [
    HeadingBlockSchema,
    TextBlockSchema,
    ButtonBlockSchema,
    FlexBlockSchema,
  ],
  max_blocks: 8,
  presets: [
    {
      name: 'Default Featured Collection',
      settings: {
        title: 'Featured Collection',
        description:
          'Explore our handpicked curation of bestsellers and essential pieces.',
        products_to_show: 4,
        product_image_sheet: '/images/dawn/product-grid.webp',
        columns_desktop: '4',
        show_view_all: true,
        show_quick_add: true,
        color_scheme: 'scheme-1',
        padding_top: 48,
        padding_bottom: 48,
      },
    },
  ],
}
