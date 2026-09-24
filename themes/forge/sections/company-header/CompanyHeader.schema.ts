import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyHeaderSchema: SectionSchema = {
  type: 'header',
  name: 'Company header',
  category: 'Header',
  tag: 'header',
  limit: 1,
  settings: [
    {
      type: 'text',
      id: 'logo_text',
      label: 'Company name',
      default: 'ATLAS / INDUSTRIES',
    },
    {
      type: 'text',
      id: 'cta_label',
      label: 'CTA label',
      default: 'Start a project',
    },
    {
      type: 'url',
      id: 'cta_url',
      label: 'CTA link',
      default: '/preview?theme=forge&template=contact',
    },
  ],
  presets: [{ name: 'Company header', category: 'Header' }],
}
