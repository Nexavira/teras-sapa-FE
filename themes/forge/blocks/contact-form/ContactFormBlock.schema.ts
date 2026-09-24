import type { BlockSchema } from '#themes/shared/types/theme'

export const ContactFormBlockSchema: BlockSchema = {
  type: 'contact_form',
  name: 'Contact form',
  icon: 'lucide:mail',
  settings: [
    {
      type: 'text',
      id: 'submit_label',
      label: 'Submit button label',
      default: 'Send enquiry',
    },
    {
      type: 'text',
      id: 'name_placeholder',
      label: 'Name placeholder',
      default: 'Your name',
    },
    {
      type: 'text',
      id: 'email_placeholder',
      label: 'Email placeholder',
      default: 'name@company.com',
    },
    {
      type: 'text',
      id: 'company_placeholder',
      label: 'Company placeholder',
      default: 'Company name',
    },
    {
      type: 'text',
      id: 'brief_placeholder',
      label: 'Brief placeholder',
      default: 'Scope, timing and the problem we can help solve',
    },
  ],
}
