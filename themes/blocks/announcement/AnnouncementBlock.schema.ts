import type { BlockSchema } from '#themes/types/theme'

export const AnnouncementBlockSchema: BlockSchema = {
  type: 'announcement',
  name: 'Announcement',
  limit: 3,
  settings: [
    {
      type: 'text',
      id: 'text',
      label: 'Announcement Text',
      default: 'Free worldwide shipping on all orders over $75!',
    },
    {
      type: 'url',
      id: 'link',
      label: 'Announcement Link',
      default: '/collections/all',
    },
    {
      type: 'select',
      id: 'text_alignment',
      label: 'Text Alignment',
      default: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-2',
    },
  ],
}
