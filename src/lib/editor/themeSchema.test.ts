import { describe, expect, it } from 'vitest'

import {
  canDuplicateSection,
  getBlockAvailability,
  getSchemaDefaults,
} from './themeSchema'
import type {
  BlockSchema,
  SectionInstance,
  SectionSchema,
} from '#themes/types/theme'

const textBlock: BlockSchema = {
  type: 'text',
  name: 'Text',
  limit: 2,
  settings: [],
}

const sectionSchema: SectionSchema = {
  type: 'hero',
  name: 'Hero',
  settings: [],
  blocks: [textBlock],
  max_blocks: 3,
}

const createSection = (types: string[]): SectionInstance => ({
  type: 'hero',
  settings: {},
  block_order: types.map((_, index) => `block-${index}`),
  blocks: Object.fromEntries(
    types.map((type, index) => [`block-${index}`, { type, settings: {} }]),
  ),
})

describe('theme schema editor helpers', () => {
  it('creates independent values from block setting defaults', () => {
    const defaults = getSchemaDefaults([
      { id: 'label', type: 'text', default: 'Read more' },
      { id: 'style', type: 'group', default: { color: 'red' } },
      { id: 'note', type: 'paragraph' },
    ])

    expect(defaults).toEqual({
      label: 'Read more',
      style: { color: 'red' },
    })
  })

  it('enforces limits per block type', () => {
    const result = getBlockAvailability(
      createSection(['text', 'text']),
      sectionSchema,
      textBlock,
    )

    expect(result.canAdd).toBe(false)
    expect(result.reason).toContain('2 Text')
  })

  it('enforces the total block limit for a section', () => {
    const result = getBlockAvailability(
      createSection(['heading', 'button', 'text']),
      sectionSchema,
      textBlock,
    )

    expect(result.canAdd).toBe(false)
    expect(result.reason).toContain('up to 3 blocks')
  })

  it('allows section duplication only below the schema limit', () => {
    expect(canDuplicateSection(0, { ...sectionSchema, limit: 1 })).toBe(true)
    expect(canDuplicateSection(1, { ...sectionSchema, limit: 1 })).toBe(false)
    expect(canDuplicateSection(4, sectionSchema)).toBe(true)
  })
})
