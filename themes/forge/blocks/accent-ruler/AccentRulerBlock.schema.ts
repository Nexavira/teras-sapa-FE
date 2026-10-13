import type { BlockSchema } from '#themes/shared/types/theme'

export const AccentRulerBlockSchema: BlockSchema = {
  type: 'accent_ruler',
  name: 'Accent ruler',
  icon: 'lucide:minus',
  settings: [
    {
      type: 'text',
      id: 'tag',
      label: 'Tag text',
      default: 'PHILOSOPHY',
    },
    {
      type: 'checkbox',
      id: 'show_bar',
      label: 'Show orange accent bar',
      default: true,
    },
    {
      type: 'checkbox',
      id: 'show_tag',
      label: 'Show tag text',
      default: true,
    },
  ],
}
