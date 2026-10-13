import { ButtonBlockSchema } from '#themes/forge/blocks/button/ButtonBlock.schema'
import { HeadingBlockSchema } from '#themes/forge/blocks/heading/HeadingBlock.schema'
import { TextBlockSchema } from '#themes/forge/blocks/text/TextBlock.schema'
import type { SectionSchema } from '#themes/shared/types/theme'

export const CompanyFooterSchema: SectionSchema = {
  type: 'footer',
  name: 'Company footer',
  category: 'Footer',
  tag: 'footer',
  limit: 1,
  settings: [
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-2',
    },
    {
      type: 'text',
      id: 'heading',
      label: 'Heading',
      default: 'Built for what comes next.',
    },
    {
      type: 'text',
      id: 'email',
      label: 'Email',
      default: 'projects@atlas-industries.com',
    },
    {
      type: 'text',
      id: 'location',
      label: 'Location',
      default: 'West Java · Indonesia',
    },
  ],
  blocks: [HeadingBlockSchema, TextBlockSchema, ButtonBlockSchema],
  presets: [{ name: 'Company footer', category: 'Footer' }],
}
