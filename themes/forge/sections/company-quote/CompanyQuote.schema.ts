import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyQuoteSchema: SectionSchema = {
  type: 'company_quote',
  name: 'Featured quote',
  category: 'Editorial',
  description:
    'Large typography quote statement with optional accent highlight styling.',
  tag: 'section',
  class: 'section-company-quote',
  settings: [
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-1',
    },
    {
      type: 'textarea',
      id: 'quote',
      label: 'Quote statement',
      default: 'We make the critical parts behind everyday momentum.',
    },
    {
      type: 'text',
      id: 'highlight',
      label: 'Accent highlight text (Optional)',
      default: 'everyday momentum.',
      info: 'Matches this substring inside the quote and styles it in Forge orange accent.',
    },
  ],
  presets: [
    {
      name: 'Default Statement Quote',
      settings: {
        color_scheme: 'scheme-1',
        quote: 'We make the critical parts behind everyday momentum.',
        highlight: 'everyday momentum.',
      },
    },
  ],
}
