import type { BlockSchema } from '#themes/shared/types/theme'

export const ListItemSchema: BlockSchema = {
  type: 'list_item',
  name: 'List item',
  icon: 'lucide:list',
  settings: [
    {
      type: 'text',
      id: 'number',
      label: 'Number / Index',
      default: '01',
      placeholder: '01',
    },
    {
      type: 'text',
      id: 'title',
      label: 'Title / Year / Role',
      default: 'Design for manufacture',
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Description / Details',
      default: '',
    },
    {
      type: 'url',
      id: 'link_url',
      label: 'Link URL (Optional)',
    },
    {
      type: 'select',
      id: 'arrow_icon',
      label: 'Arrow icon',
      default: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Up Right (↗)', value: 'up_right' },
        { label: 'Down Right (↘)', value: 'down_right' },
      ],
    },
  ],
}
