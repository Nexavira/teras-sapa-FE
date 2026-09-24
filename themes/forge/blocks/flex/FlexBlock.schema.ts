import { ButtonBlockSchema } from '../button/ButtonBlock.schema'
import { HeadingBlockSchema } from '../heading/HeadingBlock.schema'
import { TextBlockSchema } from '../text/TextBlock.schema'
import type { BlockSchema } from '#themes/shared/types/theme'

export const FlexBlockSchema: BlockSchema = {
  type: 'flex',
  name: 'Flex group',
  description:
    'Arrange child blocks (e.g. multiple buttons or tags) in a row or column.',
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
      default: 'center',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Start', value: 'flex-start' },
        { label: 'End', value: 'flex-end' },
        { label: 'Stretch', value: 'stretch' },
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
      label: 'Wrap items',
      default: true,
    },
  ],
  blocks: [ButtonBlockSchema, HeadingBlockSchema, TextBlockSchema],
  max_blocks: 8,
}
