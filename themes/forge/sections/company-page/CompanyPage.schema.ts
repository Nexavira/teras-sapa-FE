import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyPageSchema: SectionSchema = {
  type: 'company_page',
  name: 'Company page',
  category: 'Editorial',
  tag: 'section',
  settings: [
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-1',
    },
    {
      type: 'select',
      id: 'page',
      label: 'Page layout',
      default: 'home',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'About', value: 'about' },
        { label: 'Capabilities', value: 'capabilities' },
        { label: 'Industries', value: 'industries' },
        { label: 'Projects', value: 'projects' },
        { label: 'Sustainability', value: 'sustainability' },
        { label: 'Insights', value: 'insights' },
        { label: 'Article', value: 'article' },
        { label: 'Careers', value: 'careers' },
        { label: 'Contact', value: 'contact' },
      ],
    },
    {
      type: 'text',
      id: 'eyebrow',
      label: 'Eyebrow',
      default: 'Manufacturing / 01',
    },
    {
      type: 'textarea',
      id: 'title',
      label: 'Page title',
      default: 'Engineered with intent. Built without compromise.',
    },
    {
      type: 'textarea',
      id: 'intro',
      label: 'Introduction',
      default:
        'Precision manufacturing for the systems that keep the world moving.',
    },
    { type: 'image_picker', id: 'image', label: 'Hero image' },
  ],
  presets: [{ name: 'Company page', category: 'Editorial' }],
}
