import { ButtonBlockSchema } from '#themes/forge/blocks/button/ButtonBlock.schema'
import { FlexBlockSchema } from '#themes/forge/blocks/flex/FlexBlock.schema'
import { HeadingBlockSchema } from '#themes/forge/blocks/heading/HeadingBlock.schema'
import { HeroMetaBlockSchema } from '#themes/forge/blocks/hero-meta/HeroMetaBlock.schema'
import { ImageBlockSchema } from '#themes/forge/blocks/image/ImageBlock.schema'
import { TextBlockSchema } from '#themes/forge/blocks/text/TextBlock.schema'
import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyHeroSchema: SectionSchema = {
  type: 'company_hero',
  name: 'Hero banner',
  category: 'Hero',
  description:
    'Full-bleed industrial hero with modular blocks, editorial eyebrow, headline, introduction, and configurable media frame with endurance stamp.',
  tag: 'section',
  class: 'section-company-hero',
  settings: [
    {
      type: 'select',
      id: 'layout_style',
      label: 'Layout mode',
      default: 'frame',
      options: [
        { label: 'Industrial Media Frame (Stacked)', value: 'frame' },
        { label: 'Full-bleed Image Banner (Overlay)', value: 'banner' },
        { label: 'Two-column Split (Editorial)', value: 'split' },
      ],
    },
    {
      type: 'select',
      id: 'text_alignment',
      label: 'Content alignment',
      default: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      type: 'select',
      id: 'banner_height',
      label: 'Section height',
      default: 'auto',
      options: [
        { label: 'Auto (Fit content)', value: 'auto' },
        { label: 'Small (500px)', value: 'small' },
        { label: 'Medium (640px)', value: 'medium' },
        { label: 'Large (800px)', value: 'large' },
        { label: 'Full Screen (100dvh)', value: 'screen' },
      ],
    },
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-1',
    },
    {
      type: 'image_picker',
      id: 'image',
      label: 'Banner background (Banner layout)',
      default:
        'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=88',
    },
    {
      type: 'range',
      id: 'overlay_opacity',
      label: 'Banner overlay opacity',
      min: 0,
      max: 90,
      step: 10,
      unit: '%',
      default: 40,
    },
    {
      type: 'range',
      id: 'padding_top',
      label: 'Top padding',
      min: 40,
      max: 260,
      step: 8,
      unit: 'px',
      default: 160,
    },
    {
      type: 'range',
      id: 'padding_bottom',
      label: 'Bottom padding',
      min: 0,
      max: 160,
      step: 8,
      unit: 'px',
      default: 34,
    },
  ],
  blocks: [
    HeadingBlockSchema,
    TextBlockSchema,
    ButtonBlockSchema,
    HeroMetaBlockSchema,
    FlexBlockSchema,
    ImageBlockSchema,
  ],
  presets: [
    {
      name: 'Default Hero Banner',
      settings: {
        layout_style: 'frame',
        text_alignment: 'left',
        banner_height: 'auto',
        color_scheme: 'scheme-1',
        image:
          'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=88',
        overlay_opacity: 40,
        padding_top: 160,
        padding_bottom: 34,
      },
      blocks: [
        {
          type: 'heading',
          settings: {
            heading: 'Engineered with intent. Built without compromise.',
            heading_size: 'display',
            heading_tag: 'h1',
            text_align: 'left',
          },
        },
        {
          type: 'text',
          settings: {
            text: 'Precision manufacturing for the systems that keep the world moving.',
            text_style: 'intro',
            text_align: 'left',
            max_width: 620,
          },
        },
        {
          type: 'button',
          settings: {
            button_label: 'Start a project',
            button_link: '/preview?theme=forge&template=contact',
            button_style: 'primary',
            button_size: 'medium',
          },
        },
        {
          type: 'image',
          settings: {
            image:
              'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=88',
            media_height: 'large',
            overlay_opacity: 40,
            show_stamp: true,
            stamp_text: 'Made to\nendure\n↘',
            stamp_position: 'bottom-right',
            stamp_color: 'orange',
          },
        },
      ],
    },
  ],
}
