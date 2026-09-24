import { ArticleParagraphBlockSchema } from '#themes/forge/blocks/article-paragraph/ArticleParagraphBlock.schema'
import { ArticleQuoteBlockSchema } from '#themes/forge/blocks/article-quote/ArticleQuoteBlock.schema'
import { ArticleSubheadingBlockSchema } from '#themes/forge/blocks/article-subheading/ArticleSubheadingBlock.schema'
import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyArticleSchema: SectionSchema = {
  type: 'company_article',
  name: 'Article content',
  category: 'Editorial',
  description:
    'Two-column editorial reading layout with author metadata on the left and structured content blocks (paragraphs, subheadings, pull quotes) on the right.',
  tag: 'section',
  class: 'section-company-article',
  settings: [
    {
      type: 'text',
      id: 'eyebrow',
      label: 'Article eyebrow',
      default: 'Field note / 018',
    },
    {
      type: 'text',
      id: 'author_name',
      label: 'Author name',
      default: 'Raka Santoso',
    },
    {
      type: 'text',
      id: 'author_role',
      label: 'Author role',
      default: 'Director of Engineering',
    },
    {
      type: 'text',
      id: 'read_time',
      label: 'Read time',
      default: '8 minute read',
    },
    {
      type: 'text',
      id: 'date',
      label: 'Publication date',
      default: '18 September 2026',
    },
  ],
  blocks: [
    ArticleParagraphBlockSchema,
    ArticleSubheadingBlockSchema,
    ArticleQuoteBlockSchema,
  ],
  presets: [
    {
      name: 'Default Article Content',
      settings: {
        eyebrow: 'Field note / 018',
        author_name: 'Raka Santoso',
        author_role: 'Director of Engineering',
        read_time: '8 minute read',
        date: '18 September 2026',
      },
      blocks: [
        {
          type: 'article_paragraph',
          settings: {
            content:
              'Resilience is often discussed as inventory, redundancy or contingency. In manufacturing systems, it begins much earlier: with the architecture of the line itself.',
          },
        },
        {
          type: 'article_paragraph',
          settings: {
            content:
              'The most dependable production cells are not simply overbuilt. They are legible. Their functions are modular, their interfaces explicit, and their failure modes considered before steel is cut.',
          },
        },
        {
          type: 'article_subheading',
          settings: {
            title: 'Start with the handoffs',
          },
        },
        {
          type: 'article_paragraph',
          settings: {
            content:
              'Every interface is a potential source of uncertainty. Mechanical, electrical, controls and operator workflows must be designed as one connected system—not as parallel workstreams joined at commissioning.',
          },
        },
        {
          type: 'article_quote',
          settings: {
            quote:
              '“The best time to discover a collision is inside a digital model, not during a production ramp.”',
          },
        },
        {
          type: 'article_paragraph',
          settings: {
            content:
              'Digital commissioning lets teams test sequences, access zones and recovery states while changes are still inexpensive. It turns review from a presentation into a working session.',
          },
        },
        {
          type: 'article_subheading',
          settings: {
            title: 'Modularity is operational leverage',
          },
        },
        {
          type: 'article_paragraph',
          settings: {
            content:
              'A modular cell can absorb product variants, isolate maintenance and scale throughput without forcing a complete redesign. The value appears not only at launch, but through every year of the equipment lifecycle.',
          },
        },
        {
          type: 'article_paragraph',
          settings: {
            content:
              'Good manufacturing engineering makes change less dramatic. That is the quiet advantage of designing resilience into the system from day one.',
          },
        },
      ],
    },
  ],
}
