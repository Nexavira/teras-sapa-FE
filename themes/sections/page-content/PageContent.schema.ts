import { ButtonBlockSchema } from '#themes/blocks/button/ButtonBlock.schema'
import { HeadingBlockSchema } from '#themes/blocks/heading/HeadingBlock.schema'
import { TextBlockSchema } from '#themes/blocks/text/TextBlock.schema'
import type { SectionSchema } from '#themes/types/theme'

export const PageContentSchema: SectionSchema = {
  type: 'page_content',
  name: 'Page content',
  category: 'Editorial',
  settings: [
    {
      type: 'select',
      id: 'layout',
      label: 'Layout',
      default: 'stacked',
      options: [
        { value: 'stacked', label: 'Simple content' },
        { value: 'editorial', label: 'Image and content' },
        { value: 'accordion', label: 'Expandable answers' },
        { value: 'compact', label: 'Compact introduction' },
      ],
    },
    { type: 'image_picker', id: 'image', label: 'Editorial image' },
    { type: 'text', id: 'image_alt', label: 'Image description' },
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color scheme',
      default: 'scheme-1',
    },
  ],
  blocks: [HeadingBlockSchema, TextBlockSchema, ButtonBlockSchema],
  presets: [
    {
      name: 'Page content',
      blocks: [
        {
          type: 'heading',
          settings: { heading: 'Your page title', heading_tag: 'h1' },
        },
        {
          type: 'text',
          settings: { text: 'Share your story with your customers.' },
        },
      ],
    },
  ],
}
