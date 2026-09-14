import type React from 'react'

import {
  AnnouncementBlock,
  AnnouncementBlockSchema,
} from './blocks/announcement'
import { ButtonBlock, ButtonBlockSchema } from './blocks/button'
import {
  FeaturedProductBlock,
  ProductBadgeBlock,
  ProductCategoryBlock,
  ProductImageBlock,
  ProductPriceBlock,
  ProductQuickAddBlock,
  ProductTitleBlock,
} from './blocks/featured-product/FeaturedProductBlock'
import {
  FeaturedProductBlockSchema,
  ProductBadgeBlockSchema,
  ProductCategoryBlockSchema,
  ProductImageBlockSchema,
  ProductPriceBlockSchema,
  ProductQuickAddBlockSchema,
  ProductTitleBlockSchema,
} from './blocks/featured-product/FeaturedProductBlock.schema'
import { FlexBlock, FlexBlockSchema } from './blocks/flex'
import { HeadingBlock, HeadingBlockSchema } from './blocks/heading'
import { TextBlock, TextBlockSchema } from './blocks/text'
import {
  FeaturedCollection,
  FeaturedCollectionSchema,
} from './sections/featured-collection'
import { Footer, FooterSchema } from './sections/footer'
import { Header, HeaderSchema } from './sections/header'
import { HeroBanner, HeroBannerSchema } from './sections/hero-banner'
import { ImageWithText, ImageWithTextSchema } from './sections/image-with-text'
import type { BlockSchema, SectionSchema } from '#themes/types/theme'

export interface RegisteredSection {
  Component: React.ComponentType<any>
  schema: SectionSchema
}

export interface RegisteredBlock {
  Component: React.ComponentType<any>
  schema: BlockSchema
}

export const SectionRegistry: Partial<Record<string, RegisteredSection>> = {
  header: {
    Component: Header,
    schema: HeaderSchema,
  },
  hero_banner: {
    Component: HeroBanner,
    schema: HeroBannerSchema,
  },
  featured_collection: {
    Component: FeaturedCollection,
    schema: FeaturedCollectionSchema,
  },
  image_with_text: {
    Component: ImageWithText,
    schema: ImageWithTextSchema,
  },
  footer: {
    Component: Footer,
    schema: FooterSchema,
  },
}

export const BlockRegistry: Record<string, RegisteredBlock> = {
  product_image: {
    Component: ProductImageBlock,
    schema: ProductImageBlockSchema,
  },
  product_badge: {
    Component: ProductBadgeBlock,
    schema: ProductBadgeBlockSchema,
  },
  product_category: {
    Component: ProductCategoryBlock,
    schema: ProductCategoryBlockSchema,
  },
  product_title: {
    Component: ProductTitleBlock,
    schema: ProductTitleBlockSchema,
  },
  product_price: {
    Component: ProductPriceBlock,
    schema: ProductPriceBlockSchema,
  },
  product_quick_add: {
    Component: ProductQuickAddBlock,
    schema: ProductQuickAddBlockSchema,
  },
  featured_product: {
    Component: FeaturedProductBlock,
    schema: FeaturedProductBlockSchema,
  },
  announcement: {
    Component: AnnouncementBlock,
    schema: AnnouncementBlockSchema,
  },
  heading: {
    Component: HeadingBlock,
    schema: HeadingBlockSchema,
  },
  text: {
    Component: TextBlock,
    schema: TextBlockSchema,
  },
  button: {
    Component: ButtonBlock,
    schema: ButtonBlockSchema,
  },
  flex: {
    Component: FlexBlock,
    schema: FlexBlockSchema,
  },
}

// Shared controls are available for every registered section and block.
for (const registered of [
  ...Object.values(SectionRegistry),
  ...Object.values(BlockRegistry),
]) {
  if (!registered) continue

  registered.schema = {
    ...registered.schema,
    settings: [
      ...registered.schema.settings,
      {
        type: 'spacing',
        id: 'padding',
        label: 'Padding',
        info: 'Space inside the outer wrapper, in pixels.',
        min: 0,
        step: 1,
        default: { top: 0, right: 0, bottom: 0, left: 0 },
      },
    ],
  }
}
