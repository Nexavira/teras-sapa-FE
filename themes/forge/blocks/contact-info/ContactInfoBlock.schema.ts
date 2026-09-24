import type { BlockSchema } from '#themes/shared/types/theme'

export const ContactInfoBlockSchema: BlockSchema = {
  type: 'contact_info',
  name: 'Contact info',
  icon: 'lucide:map-pin',
  settings: [
    {
      type: 'textarea',
      id: 'address',
      label: 'Address',
      default: 'Jl. Industri Selatan 18\nBandung, West Java 40286',
    },
    {
      type: 'text',
      id: 'phone',
      label: 'Phone number',
      default: '+62 22 555 0187',
    },
    {
      type: 'text',
      id: 'email',
      label: 'Email address',
      default: 'projects@atlas-industries.com',
    },
  ],
}
