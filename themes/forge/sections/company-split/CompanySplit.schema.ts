import { AccentRulerBlockSchema } from '#themes/forge/blocks/accent-ruler/AccentRulerBlock.schema'
import { ButtonBlockSchema } from '#themes/forge/blocks/button/ButtonBlock.schema'
import { ContactFormBlockSchema } from '#themes/forge/blocks/contact-form/ContactFormBlock.schema'
import { ContactInfoBlockSchema } from '#themes/forge/blocks/contact-info/ContactInfoBlock.schema'
import { HeadingBlockSchema } from '#themes/forge/blocks/heading/HeadingBlock.schema'
import { ImageBlockSchema } from '#themes/forge/blocks/image/ImageBlock.schema'
import { ListItemSchema } from '#themes/forge/blocks/list-item/ListItem.schema'
import { ManifestoCardBlockSchema } from '#themes/forge/blocks/manifesto-card/ManifestoCardBlock.schema'
import { TextBlockSchema } from '#themes/forge/blocks/text/TextBlock.schema'
import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanySplitSchema: SectionSchema = {
  type: 'company_split',
  name: 'Split content & list',
  category: 'Editorial',
  description:
    'Two-column split narrative featuring headline & intro on the left, with interactive list items, milestones, contact form, or campus info on the right.',
  tag: 'section',
  class: 'section-company-split',
  settings: [
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-1',
    },
    {
      type: 'text',
      id: 'watermark_text',
      label: 'Watermark reference text',
      default: 'Atlas Ref. Spec 02',
    },
    {
      type: 'checkbox',
      id: 'show_watermark',
      label: 'Show watermark mark',
      default: true,
    },
    {
      type: 'text',
      id: 'accent_tag',
      label: 'Fallback accent tag',
      default: 'PHILOSOPHY',
    },
    {
      type: 'checkbox',
      id: 'dark_mode',
      label: 'Dark style background',
      default: false,
    },
    {
      type: 'text',
      id: 'eyebrow',
      label: 'Eyebrow (Fallback)',
      default: 'Our principle',
    },
    {
      type: 'textarea',
      id: 'heading',
      label: 'Heading (Fallback)',
      default: 'Capability earns attention. Consistency earns trust.',
    },
    {
      type: 'textarea',
      id: 'intro',
      label: 'Introductory text (Fallback)',
      default: '',
    },
  ],
  blocks: [
    HeadingBlockSchema,
    TextBlockSchema,
    AccentRulerBlockSchema,
    ButtonBlockSchema,
    ManifestoCardBlockSchema,
    ListItemSchema,
    ImageBlockSchema,
    ContactFormBlockSchema,
    ContactInfoBlockSchema,
  ],
  presets: [
    {
      name: 'Default Split Section',
      settings: {
        dark_mode: false,
        watermark_text: 'Atlas Ref. Spec 02',
        show_watermark: true,
      },
      blocks: [
        {
          type: 'heading',
          settings: {
            heading: 'Capability earns attention. Consistency earns trust.',
            heading_size: 'large',
            heading_tag: 'h2',
          },
        },
        {
          type: 'accent_ruler',
          settings: {
            tag: 'PHILOSOPHY',
            show_bar: true,
          },
        },
        {
          type: 'manifesto_card',
          settings: {
            quote:
              'Atlas began as a twelve-person machine shop in 1987. Today, more than 620 specialists work across design, fabrication, automation and quality. The scale changed. The standard never did.',
            show_glyph: true,
          },
        },
      ],
    },
  ],
}
