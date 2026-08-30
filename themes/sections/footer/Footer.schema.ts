import { ButtonBlockSchema } from '#themes/blocks/button/ButtonBlock.schema'
import { FlexBlockSchema } from '#themes/blocks/flex/FlexBlock.schema'
import { HeadingBlockSchema } from '#themes/blocks/heading/HeadingBlock.schema'
import { TextBlockSchema } from '#themes/blocks/text/TextBlock.schema'
import type { SectionSchema } from '#themes/types/theme'

export const FooterSchema: SectionSchema = {
  type: 'footer',
  name: 'Footer',
  category: 'Footer',
  description:
    'Store information, navigation, newsletter, and payment methods.',
  tag: 'footer',
  class: 'section-footer',
  limit: 1,
  settings: [
    {
      type: 'text',
      id: 'brand_name',
      label: 'Brand name',
      default: 'Teras Sapa',
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Description',
      default:
        'Thoughtfully made essentials for slower, more intentional everyday living.',
    },
    {
      type: 'text',
      id: 'shop_links',
      label: 'Shop links',
      info: 'Separate links with commas.',
      default: 'New arrivals, Best sellers, Home & living, Gifts',
    },
    {
      type: 'text',
      id: 'help_links',
      label: 'Help links',
      info: 'Separate links with commas.',
      default: 'About us, Shipping & returns, FAQs, Contact',
    },
    { type: 'header', id: 'newsletter_header', content: 'Newsletter' },
    {
      type: 'text',
      id: 'newsletter_heading',
      label: 'Heading',
      default: 'Stay in the loop',
    },
    {
      type: 'textarea',
      id: 'newsletter_text',
      label: 'Text',
      default:
        'New stories, considered objects, and occasional notes — delivered with care.',
    },
    {
      type: 'text',
      id: 'email_placeholder',
      label: 'Email placeholder',
      default: 'Your email address',
    },
    { type: 'header', id: 'appearance_header', content: 'Appearance' },
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-4',
    },
    {
      type: 'checkbox',
      id: 'show_socials',
      label: 'Show social links',
      default: true,
    },
    {
      type: 'checkbox',
      id: 'show_payment_methods',
      label: 'Show payment methods',
      default: true,
    },
    {
      type: 'text',
      id: 'copyright_text',
      label: 'Copyright text',
      default: '© 2026 Teras Sapa. All rights reserved.',
    },
    {
      type: 'range',
      id: 'padding_top',
      label: 'Top padding',
      min: 32,
      max: 120,
      step: 4,
      unit: 'px',
      default: 72,
    },
    {
      type: 'range',
      id: 'padding_bottom',
      label: 'Bottom padding',
      min: 16,
      max: 80,
      step: 4,
      unit: 'px',
      default: 28,
    },
  ],
  blocks: [
    HeadingBlockSchema,
    TextBlockSchema,
    ButtonBlockSchema,
    FlexBlockSchema,
  ],
  max_blocks: 6,
  presets: [{ name: 'Default Footer', category: 'Footer' }],
}
