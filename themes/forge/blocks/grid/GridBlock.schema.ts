import { BentoCardSchema } from '../bento-card/BentoCard.schema'
import { ButtonBlockSchema } from '../button/ButtonBlock.schema'
import { HeadingBlockSchema } from '../heading/HeadingBlock.schema'
import { ImageBlockSchema } from '../image/ImageBlock.schema'
import { MetricItemSchema } from '../metric-item/MetricItem.schema'
import { TextBlockSchema } from '../text/TextBlock.schema'
import type { BlockSchema } from '#themes/shared/types/theme'

export const GridBlockSchema: BlockSchema = {
  type: 'grid',
  name: 'Grid container',
  description:
    'Responsive grid layout container for organizing bento cards, metric items, media, and text blocks.',
  settings: [
    {
      type: 'range',
      id: 'columns',
      label: 'Columns',
      min: 1,
      max: 12,
      step: 1,
      unit: ' cols',
      default: 3,
    },
    {
      type: 'range',
      id: 'gap',
      label: 'Grid gap',
      min: 0,
      max: 64,
      step: 4,
      unit: 'px',
      default: 24,
    },
  ],
  blocks: [
    MetricItemSchema,
    BentoCardSchema,
    ImageBlockSchema,
    TextBlockSchema,
    HeadingBlockSchema,
    ButtonBlockSchema,
  ],
  max_blocks: 12,
}
