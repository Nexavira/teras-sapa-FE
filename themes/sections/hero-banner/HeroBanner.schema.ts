import { ButtonBlockSchema } from '#themes/blocks/button/ButtonBlock.schema'
import { HeadingBlockSchema } from '#themes/blocks/heading/HeadingBlock.schema'
import { TextBlockSchema } from '#themes/blocks/text/TextBlock.schema'
import type { SectionSchema } from '#themes/types/theme'

export const HeroBannerSchema: SectionSchema = {
  type: 'hero_banner',
  name: 'Image Banner',
  category: 'Hero',
  description:
    'Full-width visual banner with heading, subheading, and customizable call-to-action buttons.',
  tag: 'section',
  class: 'section-hero-banner',
  settings: [
    {
      type: 'select',
      id: 'text_alignment',
      label: 'Text Alignment',
      default: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      type: 'select',
      id: 'banner_height',
      label: 'Banner Height',
      default: 'medium',
      options: [
        { label: 'Small (360px)', value: 'small' },
        { label: 'Medium (480px)', value: 'medium' },
        { label: 'Large (600px)', value: 'large' },
      ],
    },
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-3',
    },
    {
      type: 'range',
      id: 'overlay_opacity',
      label: 'Background Overlay Opacity',
      min: 0,
      max: 90,
      step: 10,
      unit: '%',
      default: 40,
    },
  ],
  blocks: [HeadingBlockSchema, TextBlockSchema, ButtonBlockSchema],
  presets: [
    {
      name: 'Default Hero Banner',
      settings: {
        text_alignment: 'center',
        banner_height: 'medium',
        color_scheme: 'scheme-3',
        overlay_opacity: 40,
      },
      blocks: [
        {
          type: 'heading',
          settings: {
            heading: 'Elevate Your Everyday Style',
            heading_size: 'large',
            heading_tag: 'h1',
          },
        },
        {
          type: 'text',
          settings: {
            text: 'Discover the latest seasonal collection crafted with sustainable materials and timeless silhouettes.',
            text_style: 'subheading',
          },
        },
        {
          type: 'button',
          settings: {
            button_label: 'Shop Collection',
            button_link: '/collections/all',
            button_style: 'primary',
          },
        },
      ],
    },
  ],
}
