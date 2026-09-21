import { getFeaturedCollectionPresets } from './featuredCollectionBlocks'
import { ButtonBlockSchema } from '#themes/dawn/blocks/button/ButtonBlock.schema'
import { FeaturedProductBlockSchema } from '#themes/dawn/blocks/featured-product/FeaturedProductBlock.schema'
import { FlexBlockSchema } from '#themes/dawn/blocks/flex/FlexBlock.schema'
import { HeadingBlockSchema } from '#themes/dawn/blocks/heading/HeadingBlock.schema'
import { TextBlockSchema } from '#themes/dawn/blocks/text/TextBlock.schema'
import type { SectionSchema } from '#themes/shared/types/theme'

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
      type: 'collection',
      id: 'collection',
      label: 'Collection',
      info: 'Select a collection to display products from.',
    },
    {
      type: 'range',
      id: 'products_to_show',
      label: 'Products to show',
      min: 2,
      max: 8,
      step: 1,
      default: 4,
    },
    {
      type: 'image_picker',
      id: 'product_image_sheet',
      label: 'Product image sheet',
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
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-1',
    },
    {
      type: 'number',
      id: 'padding_top',
      label: 'Top Padding',
      min: 0,
      max: 80,
      step: 8,
      unit: 'px',
      default: 48,
    },
    {
      type: 'number',
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
    FeaturedProductBlockSchema,
    HeadingBlockSchema,
    TextBlockSchema,
    ButtonBlockSchema,
    FlexBlockSchema,
  ],
  max_blocks: 20,
  presets: [
    {
      name: 'Default Featured Collection',
      blocks: getFeaturedCollectionPresets(),
      settings: {
        content_blocks_version: 3,
        columns_desktop: '4',
        color_scheme: 'scheme-1',
        padding_top: 48,
        padding_bottom: 48,
      },
    },
  ],
}
