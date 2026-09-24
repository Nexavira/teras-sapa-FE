import type { BlockSchema } from '#themes/shared/types/theme'

export const ArticleParagraphBlockSchema: BlockSchema = {
  type: 'article_paragraph',
  name: 'Paragraph',
  icon: 'lucide:type',
  settings: [
    {
      type: 'textarea',
      id: 'content',
      label: 'Paragraph text',
      default:
        'Resilience is often discussed as inventory, redundancy or contingency. In manufacturing systems, it begins much earlier: with the architecture of the line itself.',
    },
  ],
}
