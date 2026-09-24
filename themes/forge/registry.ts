import { ArticleParagraphBlock } from './blocks/article-paragraph/ArticleParagraphBlock'
import { ArticleParagraphBlockSchema } from './blocks/article-paragraph/ArticleParagraphBlock.schema'
import { ArticleQuoteBlock } from './blocks/article-quote/ArticleQuoteBlock'
import { ArticleQuoteBlockSchema } from './blocks/article-quote/ArticleQuoteBlock.schema'
import { ArticleSubheadingBlock } from './blocks/article-subheading/ArticleSubheadingBlock'
import { ArticleSubheadingBlockSchema } from './blocks/article-subheading/ArticleSubheadingBlock.schema'
import { BentoCard } from './blocks/bento-card/BentoCard'
import { BentoCardSchema } from './blocks/bento-card/BentoCard.schema'
import { ButtonBlock } from './blocks/button/ButtonBlock'
import { ButtonBlockSchema } from './blocks/button/ButtonBlock.schema'
import { ContactFormBlock } from './blocks/contact-form/ContactFormBlock'
import { ContactFormBlockSchema } from './blocks/contact-form/ContactFormBlock.schema'
import { ContactInfoBlock } from './blocks/contact-info/ContactInfoBlock'
import { ContactInfoBlockSchema } from './blocks/contact-info/ContactInfoBlock.schema'
import { FlexBlock } from './blocks/flex/FlexBlock'
import { FlexBlockSchema } from './blocks/flex/FlexBlock.schema'
import { HeadingBlock } from './blocks/heading/HeadingBlock'
import { HeadingBlockSchema } from './blocks/heading/HeadingBlock.schema'
import { ListItem } from './blocks/list-item/ListItem'
import { ListItemSchema } from './blocks/list-item/ListItem.schema'
import { MetricItem } from './blocks/metric-item/MetricItem'
import { MetricItemSchema } from './blocks/metric-item/MetricItem.schema'
import { TextBlock } from './blocks/text/TextBlock'
import { TextBlockSchema } from './blocks/text/TextBlock.schema'
import { CompanyArticle } from './sections/company-article/CompanyArticle'
import { CompanyArticleSchema } from './sections/company-article/CompanyArticle.schema'
import { CompanyBento } from './sections/company-bento/CompanyBento'
import { CompanyBentoSchema } from './sections/company-bento/CompanyBento.schema'
import { CompanyFooter } from './sections/company-footer/CompanyFooter'
import { CompanyFooterSchema } from './sections/company-footer/CompanyFooter.schema'
import { CompanyHeader } from './sections/company-header/CompanyHeader'
import { CompanyHeaderSchema } from './sections/company-header/CompanyHeader.schema'
import { CompanyHero } from './sections/company-hero/CompanyHero'
import { CompanyHeroSchema } from './sections/company-hero/CompanyHero.schema'
import { CompanyMetrics } from './sections/company-metrics/CompanyMetrics'
import { CompanyMetricsSchema } from './sections/company-metrics/CompanyMetrics.schema'
import { CompanyPage } from './sections/company-page/CompanyPage'
import { CompanyPageSchema } from './sections/company-page/CompanyPage.schema'
import { CompanyQuote } from './sections/company-quote/CompanyQuote'
import { CompanyQuoteSchema } from './sections/company-quote/CompanyQuote.schema'
import { CompanySplit } from './sections/company-split/CompanySplit'
import { CompanySplitSchema } from './sections/company-split/CompanySplit.schema'
import type {
  RegisteredBlock,
  RegisteredSection,
} from '#themes/shared/types/theme'

export const SectionRegistry: Partial<Record<string, RegisteredSection>> = {
  header: { Component: CompanyHeader, schema: CompanyHeaderSchema },
  company_hero: { Component: CompanyHero, schema: CompanyHeroSchema },
  company_metrics: { Component: CompanyMetrics, schema: CompanyMetricsSchema },
  company_bento: { Component: CompanyBento, schema: CompanyBentoSchema },
  company_split: { Component: CompanySplit, schema: CompanySplitSchema },
  company_quote: { Component: CompanyQuote, schema: CompanyQuoteSchema },
  company_article: { Component: CompanyArticle, schema: CompanyArticleSchema },
  company_page: { Component: CompanyPage, schema: CompanyPageSchema },
  footer: { Component: CompanyFooter, schema: CompanyFooterSchema },
}

export const BlockRegistry: Record<string, RegisteredBlock> = {
  heading: { Component: HeadingBlock, schema: HeadingBlockSchema },
  text: { Component: TextBlock, schema: TextBlockSchema },
  button: { Component: ButtonBlock, schema: ButtonBlockSchema },
  flex: { Component: FlexBlock, schema: FlexBlockSchema },
  metric_item: { Component: MetricItem, schema: MetricItemSchema },
  bento_card: { Component: BentoCard, schema: BentoCardSchema },
  list_item: { Component: ListItem, schema: ListItemSchema },
  contact_form: { Component: ContactFormBlock, schema: ContactFormBlockSchema },
  contact_info: { Component: ContactInfoBlock, schema: ContactInfoBlockSchema },
  article_paragraph: {
    Component: ArticleParagraphBlock,
    schema: ArticleParagraphBlockSchema,
  },
  article_subheading: {
    Component: ArticleSubheadingBlock,
    schema: ArticleSubheadingBlockSchema,
  },
  article_quote: {
    Component: ArticleQuoteBlock,
    schema: ArticleQuoteBlockSchema,
  },
}

// Shared controls are available for every registered section and block.
for (const registered of [
  ...Object.values(SectionRegistry),
  ...Object.values(BlockRegistry),
]) {
  if (!registered) continue

  registered.schema = {
    ...registered.schema,
    settings: [
      ...registered.schema.settings,
      {
        type: 'spacing',
        id: 'padding',
        label: 'Padding',
        info: 'Space inside the outer wrapper, in pixels.',
        min: 0,
        step: 1,
        default: { top: 0, right: 0, bottom: 0, left: 0 },
      },
    ],
  }
}
