import type { BlockSchema } from '#themes/shared/types/theme'

export const ArticleQuoteBlockSchema: BlockSchema = {
  type: 'article_quote',
  name: 'Pull quote',
  icon: 'lucide:quote',
  settings: [
    {
      type: 'textarea',
      id: 'quote',
      label: 'Quote text',
      default:
        '“The best time to discover a collision is inside a digital model, not during a production ramp.”',
    },
  ],
}
