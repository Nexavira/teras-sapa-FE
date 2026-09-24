import { ContactFormBlockSchema } from '#themes/forge/blocks/contact-form/ContactFormBlock.schema'
import { ContactInfoBlockSchema } from '#themes/forge/blocks/contact-info/ContactInfoBlock.schema'
import { ListItemSchema } from '#themes/forge/blocks/list-item/ListItem.schema'
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
      type: 'text',
      id: 'eyebrow',
      label: 'Eyebrow',
      default: 'Our principle',
    },
    {
      type: 'textarea',
      id: 'heading',
      label: 'Heading',
      default: 'Capability earns attention. Consistency earns trust.',
    },
    {
      type: 'textarea',
      id: 'intro',
      label: 'Introductory text (Optional)',
      default: '',
    },
    {
      type: 'checkbox',
      id: 'dark_mode',
      label: 'Dark style background',
      default: false,
    },
  ],
  blocks: [ListItemSchema, ContactFormBlockSchema, ContactInfoBlockSchema],
  presets: [
    {
      name: 'Default Split Section',
      settings: {
        eyebrow: 'Our principle',
        heading: 'Capability earns attention. Consistency earns trust.',
        intro:
          'Atlas began as a twelve-person machine shop in 1987. Today, more than 620 specialists work across design, fabrication, automation and quality. The scale changed. The standard never did.',
        dark_mode: false,
      },
      blocks: [],
    },
  ],
}
