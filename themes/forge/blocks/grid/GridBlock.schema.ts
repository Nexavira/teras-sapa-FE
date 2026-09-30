import { ButtonBlockSchema } from '../button/ButtonBlock.schema'
import { HeadingBlockSchema } from '../heading/HeadingBlock.schema'
import { MetricItemSchema } from '../metric-item/MetricItem.schema'
import { TextBlockSchema } from '../text/TextBlock.schema'
import type { BlockSchema } from '#themes/shared/types/theme'

export const GridBlockSchema: BlockSchema = {
  type: 'grid',
  name: 'Grid container',
  description:
    'Grid layout container for organizing metric items and text blocks with 1, 2, or 3 grid width.',
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
    TextBlockSchema,
    HeadingBlockSchema,
    ButtonBlockSchema,
  ],
  max_blocks: 12,
}
