import type { BlockSchema } from '#themes/shared/types/theme'

export const ArticleSubheadingBlockSchema: BlockSchema = {
  type: 'article_subheading',
  name: 'Subheading',
  icon: 'lucide:heading',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Subheading',
      default: 'Start with the handoffs',
    },
  ],
}
