import type React from 'react'

import {
  AnnouncementBlock,
  AnnouncementBlockSchema,
} from './blocks/announcement'
import { ButtonBlock, ButtonBlockSchema } from './blocks/button'
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
