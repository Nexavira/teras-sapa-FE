import { ButtonBlockSchema } from '../button/ButtonBlock.schema'
import { FlexBlockSchema } from '../flex/FlexBlock.schema'
import { HeadingBlockSchema } from '../heading/HeadingBlock.schema'
import { ImageBlockSchema } from '../image/ImageBlock.schema'
import { TextBlockSchema } from '../text/TextBlock.schema'
import type { BlockSchema } from '#themes/shared/types/theme'

export const BentoCardSchema: BlockSchema = {
  type: 'bento_card',
  name: 'Bento card',
  icon: 'lucide:layout-grid',
  settings: [
    {
      type: 'text',
      id: 'tag',
      label: 'Tag / Badge',
      default: '01 / Capability',
      placeholder: 'e.g. 01 / Capability',
    },
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Precision fabrication',
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Description',
      default:
        'Five-axis machining, robotic welding and complex metalwork held to microscopic tolerances.',
    },
    {
      type: 'image_picker',
      id: 'image',
      label: 'Card image (Optional)',
      info: 'Used for project cards or media showcases',
    },
    {
      type: 'text',
      id: 'link_label',
      label: 'Link label (Optional)',
      placeholder: 'e.g. Read article',
    },
    {
      type: 'url',
      id: 'link_url',
      label: 'Link URL',
    },
    {
      type: 'checkbox',
      id: 'dark',
      label: 'Dark style card',
      default: false,
    },
    {
      type: 'select',
      id: 'span',
      label: 'Grid column span',
      default: '4',
      options: [
        { label: '4 columns (1/3 width)', value: '4' },
        { label: '5 columns (~42% width)', value: '5' },
        { label: '6 columns (1/2 width)', value: '6' },
        { label: '7 columns (~58% width)', value: '7' },
        { label: '12 columns (Full width)', value: '12' },
      ],
    },
  ],
  blocks: [
    HeadingBlockSchema,
    TextBlockSchema,
    ButtonBlockSchema,
    ImageBlockSchema,
    FlexBlockSchema,
  ],
  max_blocks: 8,
}
