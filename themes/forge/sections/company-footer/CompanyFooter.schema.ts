import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyFooterSchema: SectionSchema = {
  type: 'footer',
  name: 'Company footer',
  category: 'Footer',
  tag: 'footer',
  limit: 1,
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Heading',
      default: 'Built for what comes next.',
    },
    {
      type: 'text',
      id: 'email',
      label: 'Email',
      default: 'projects@atlas-industries.com',
    },
    {
      type: 'text',
      id: 'location',
      label: 'Location',
      default: 'West Java · Indonesia',
    },
  ],
  presets: [{ name: 'Company footer', category: 'Footer' }],
}
