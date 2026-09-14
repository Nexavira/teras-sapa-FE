import type { BlockSchema } from '#themes/types/theme'

export const ProductImageBlockSchema: BlockSchema = {
  type: 'product_image',
  name: 'Image',
  limit: 1,
  settings: [
    {
      type: 'select',
      id: 'image_ratio',
      label: 'Image aspect ratio',
      default: '1 / 1',
      options: [
        { label: 'Square', value: '1 / 1' },
        { label: 'Portrait', value: '3 / 4' },
        { label: 'Landscape', value: '4 / 3' },
      ],
    },
  ],
}

export const ProductBadgeBlockSchema: BlockSchema = {
  type: 'product_badge',
  name: 'Badge',
  limit: 1,
  settings: [],
}
export const ProductCategoryBlockSchema: BlockSchema = {
  type: 'product_category',
  name: 'Vendor / category',
  limit: 1,
  settings: [],
}
export const ProductTitleBlockSchema: BlockSchema = {
  type: 'product_title',
  name: 'Title',
  limit: 1,
  settings: [],
}
export const ProductPriceBlockSchema: BlockSchema = {
  type: 'product_price',
  name: 'Price',
  limit: 1,
  settings: [],
}
export const ProductQuickAddBlockSchema: BlockSchema = {
  type: 'product_quick_add',
  name: 'Quick add',
  limit: 1,
  settings: [
    { type: 'text', id: 'label', label: 'Button label', default: 'Quick add' },
  ],
}

export const FeaturedProductBlockSchema: BlockSchema = {
  type: 'featured_product',
  name: 'Product card',
  limit: 1,
  settings: [
    {
      type: 'paragraph',
      id: 'shared_info',
      content: 'The child blocks and their order apply to every product card.',
    },
  ],
  blocks: [
    ProductImageBlockSchema,
    ProductBadgeBlockSchema,
    ProductCategoryBlockSchema,
    ProductTitleBlockSchema,
    ProductPriceBlockSchema,
    ProductQuickAddBlockSchema,
  ],
  max_blocks: 6,
}
