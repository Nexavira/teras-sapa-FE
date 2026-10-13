import type { BlockSchema } from '#themes/shared/types/theme'

export const ManifestoCardBlockSchema: BlockSchema = {
  type: 'manifesto_card',
  name: 'Manifesto card',
  icon: 'lucide:quote',
  settings: [
    {
      type: 'textarea',
      id: 'quote',
      label: 'Quote / Statement',
      default:
        'Atlas began as a twelve-person machine shop in 1987. Today, more than 620 specialists work across design, fabrication, automation and quality. The scale changed. The standard never did.',
    },
    {
      type: 'checkbox',
      id: 'show_glyph',
      label: 'Show quote glyph icon',
      default: true,
    },
  ],
}
