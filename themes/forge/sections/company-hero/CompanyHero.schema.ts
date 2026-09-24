import { ButtonBlockSchema } from '#themes/forge/blocks/button/ButtonBlock.schema'
import { FlexBlockSchema } from '#themes/forge/blocks/flex/FlexBlock.schema'
import { HeadingBlockSchema } from '#themes/forge/blocks/heading/HeadingBlock.schema'
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
      type: 'select',
      id: 'media_height',
      label: 'Media frame height',
      default: 'large',
      options: [
        { label: 'Small (440px)', value: 'small' },
        { label: 'Medium (600px)', value: 'medium' },
        { label: 'Large (760px)', value: 'large' },
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
      label: 'Hero media / background',
      default:
        'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=88',
    },
    {
      type: 'range',
      id: 'overlay_opacity',
      label: 'Media overlay opacity',
      min: 0,
      max: 90,
      step: 10,
      unit: '%',
      default: 40,
    },
    {
      type: 'checkbox',
      id: 'show_media',
      label: 'Show media frame',
      default: true,
    },
    {
      type: 'checkbox',
      id: 'show_stamp',
      label: 'Show endurance stamp badge',
      default: true,
    },
    {
      type: 'text',
      id: 'stamp_text',
      label: 'Stamp text',
      default: 'Made to endure ↘',
    },
    {
      type: 'select',
      id: 'stamp_position',
      label: 'Stamp position',
      default: 'bottom-right',
      options: [
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Top Right', value: 'top-right' },
      ],
    },
    {
      type: 'select',
      id: 'stamp_color',
      label: 'Stamp color',
      default: 'orange',
      options: [
        { label: 'Forge Orange', value: 'orange' },
        { label: 'Industrial Dark (Ink)', value: 'ink' },
        { label: 'Bone Light', value: 'bone' },
      ],
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
    // Fallback settings (used when no blocks are present in template)
    {
      type: 'header',
      id: 'fallback_header',
      content: 'Fallback content (when no blocks are added)',
    },
    {
      type: 'textarea',
      id: 'title',
      label: 'Fallback headline',
      default: 'Engineered with intent. Built without compromise.',
    },
    {
      type: 'textarea',
      id: 'intro',
      label: 'Fallback introduction',
      default:
        'Precision manufacturing for the systems that keep the world moving.',
    },
    {
      type: 'text',
      id: 'button_label',
      label: 'Fallback button label',
      default: '',
    },
    {
      type: 'text',
      id: 'button_link',
      label: 'Fallback button link',
      default: '',
    },
  ],
  blocks: [
    HeadingBlockSchema,
    TextBlockSchema,
    ButtonBlockSchema,
    FlexBlockSchema,
  ],
  presets: [
    {
      name: 'Default Hero Banner',
      settings: {
        layout_style: 'frame',
        text_alignment: 'left',
        banner_height: 'auto',
        media_height: 'large',
        color_scheme: 'scheme-1',
        image:
          'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=88',
        overlay_opacity: 40,
        show_media: true,
        show_stamp: true,
        stamp_text: 'Made to endure ↘',
        stamp_position: 'bottom-right',
        stamp_color: 'orange',
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
      ],
    },
  ],
}
