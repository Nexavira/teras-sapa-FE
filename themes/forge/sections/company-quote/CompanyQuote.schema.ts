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
        quote: 'We make the critical parts behind everyday momentum.',
        highlight: 'everyday momentum.',
      },
    },
  ],
}
