import { AnnouncementBlockSchema } from '#themes/blocks/announcement/AnnouncementBlock.schema'
import type { SectionSchema } from '#themes/types/theme'

export const HeaderSchema: SectionSchema = {
  type: 'header',
  name: 'Header',
  description:
    'Main site header with logo, navigation menu, and utilities (modeled after Shopify Dawn)',
  tag: 'header',
  class: 'section-header',
  settings: [
    {
      type: 'select',
      id: 'logo_position',
      label: 'Desktop logo position',
      default: 'middle-left',
      options: [
        { label: 'Middle left', value: 'middle-left' },
        { label: 'Top left', value: 'top-left' },
        { label: 'Top center', value: 'top-center' },
      ],
    },
    {
      type: 'text',
      id: 'logo_text',
      label: 'Logo text',
      default: 'Serein',
    },
    {
      type: 'textarea',
      id: 'menu_links',
      label: 'Menu links',
      info: 'Comma-separated Label|URL pairs.',
      default:
        'New arrivals|/collections/new, Shop|/collections/all, Journal|/blogs/journal, Our story|/pages/about',
    },
    {
      type: 'select',
      id: 'sticky_header_type',
      label: 'Sticky header',
      default: 'on-scroll-up',
      options: [
        { label: 'None', value: 'none' },
        { label: 'On scroll up', value: 'on-scroll-up' },
        { label: 'Always', value: 'always' },
      ],
    },
    {
      type: 'checkbox',
      id: 'show_line_separator',
      label: 'Show separator line',
      default: true,
    },
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-1',
    },
    {
      id: 'header',
      type: 'header',
      content: 'Header Utilities',
    },
    {
      type: 'checkbox',
      id: 'enable_country_selector',
      label: 'Enable country/region selector',
      default: true,
    },
    {
      type: 'checkbox',
      id: 'enable_language_selector',
      label: 'Enable language selector',
      default: true,
    },
    {
      type: 'range',
      id: 'padding_top',
      label: 'Top padding',
      min: 0,
      max: 36,
      step: 4,
      unit: 'px',
      default: 20,
    },
    {
      type: 'range',
      id: 'padding_bottom',
      label: 'Bottom padding',
      min: 0,
      max: 36,
      step: 4,
      unit: 'px',
      default: 20,
    },
  ],
  blocks: [AnnouncementBlockSchema],
  max_blocks: 3,
  presets: [
    {
      name: 'Default Header',
      settings: {
        logo_position: 'middle-left',
        sticky_header_type: 'on-scroll-up',
        show_line_separator: true,
        color_scheme: 'scheme-1',
        padding_top: 20,
        padding_bottom: 20,
        logo_text: 'Serein',
        menu_links:
          'New arrivals|/collections/new, Shop|/collections/all, Journal|/blogs/journal, Our story|/pages/about',
      },
      blocks: [
        {
          type: 'announcement',
          settings: {
            text: 'Welcome to our store — Free Shipping Available!',
            text_alignment: 'center',
            color_scheme: 'scheme-2',
          },
        },
      ],
    },
  ],
}
