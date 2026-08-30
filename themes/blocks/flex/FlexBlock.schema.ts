import { ButtonBlockSchema } from '../button/ButtonBlock.schema'
import { HeadingBlockSchema } from '../heading/HeadingBlock.schema'
import { TextBlockSchema } from '../text/TextBlock.schema'
import type { BlockSchema } from '#themes/types/theme'

export const FlexBlockSchema: BlockSchema = {
  type: 'flex',
  name: 'Flex container',
  description: 'Arrange child blocks in a configurable row or column.',
  settings: [
    {
      type: 'select',
      id: 'direction',
      label: 'Direction',
      default: 'row',
      options: [
        { label: 'Row', value: 'row' },
        { label: 'Column', value: 'column' },
      ],
    },
    {
      type: 'select',
      id: 'justify_content',
      label: 'Horizontal distribution',
      default: 'flex-start',
      options: [
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
        { label: 'Space between', value: 'space-between' },
      ],
    },
    {
      type: 'select',
      id: 'align_items',
      label: 'Cross-axis alignment',
      default: 'stretch',
      options: [
        { label: 'Stretch', value: 'stretch' },
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
      ],
    },
    {
      type: 'range',
      id: 'gap',
      label: 'Gap',
      min: 0,
      max: 64,
      step: 4,
      unit: 'px',
      default: 16,
    },
    {
      type: 'checkbox',
      id: 'wrap',
      label: 'Wrap children',
      default: true,
    },
  ],
  blocks: [HeadingBlockSchema, TextBlockSchema, ButtonBlockSchema],
  max_blocks: 12,
}
