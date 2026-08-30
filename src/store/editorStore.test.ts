import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import type { EditorState } from './editorStore'
import { editorActions, editorStore } from './editorStore'
import type { TemplateData } from '#themes/types/theme'

const originalState = structuredClone(editorStore.get())

const templateFixture: TemplateData = {
  sections: {
    hero: {
      id: 'hero',
      type: 'hero_banner',
      settings: { alignment: 'center' },
      blocks: {
        heading: {
          id: 'heading',
          type: 'heading',
          settings: { heading: 'Original heading' },
        },
      },
      block_order: ['heading'],
    },
  },
  order: ['hero'],
}

const setEditorState = (template: TemplateData) => {
  editorStore.setState((state): EditorState => ({
    ...state,
    template: structuredClone(template),
    selectedItem: null,
    history: { past: [], future: [] },
  }))
}

describe('editorStore section and block actions', () => {
  beforeEach(() => setEditorState(templateFixture))

  afterAll(() => {
    editorStore.setState(() => structuredClone(originalState))
  })

  it('adds a block with settings and selects it', () => {
    const blockId = editorActions.addBlock('hero', 'button', {
      button_label: 'Explore',
    })
    const state = editorStore.get()

    expect(state.template.sections.hero.block_order).toEqual([
      'heading',
      blockId,
    ])
    expect(state.template.sections.hero.blocks?.[blockId]).toMatchObject({
      id: blockId,
      type: 'button',
      settings: { button_label: 'Explore' },
    })
    expect(state.selectedItem).toEqual({
      type: 'block',
      id: blockId,
      sectionId: 'hero',
    })
  })

  it('duplicates a block next to its source with independent settings', () => {
    const duplicateId = editorActions.duplicateBlock('hero', 'heading')
    const state = editorStore.get()

    expect(state.template.sections.hero.block_order).toEqual([
      'heading',
      duplicateId,
    ])
    expect(state.template.sections.hero.blocks?.[duplicateId]).toMatchObject({
      id: duplicateId,
      type: 'heading',
      settings: { heading: 'Original heading' },
    })
    expect(duplicateId).not.toBe('heading')
  })

  it('duplicates a section and remaps its child block ids', () => {
    const duplicateSectionId = editorActions.duplicateSection('hero')
    const state = editorStore.get()
    const duplicate = state.template.sections[duplicateSectionId]
    const duplicateBlockId = duplicate.block_order?.[0]

    expect(state.template.order).toEqual(['hero', duplicateSectionId])
    expect(duplicate).toMatchObject({
      id: duplicateSectionId,
      type: 'hero_banner',
      settings: { alignment: 'center' },
    })
    expect(duplicateBlockId).toBeTruthy()
    expect(duplicateBlockId).not.toBe('heading')
    expect(duplicate.blocks?.[duplicateBlockId!]).toMatchObject({
      id: duplicateBlockId,
      type: 'heading',
      settings: { heading: 'Original heading' },
    })
  })

  it('adds, updates, and reorders blocks inside a container block', () => {
    const containerId = editorActions.addBlock('hero', 'flex', {
      direction: 'row',
    })
    const textId = editorActions.addBlock(
      'hero',
      'text',
      { text: 'Nested text' },
      containerId,
    )
    const buttonId = editorActions.addBlock(
      'hero',
      'button',
      { button_label: 'Nested button' },
      containerId,
    )

    editorActions.updateBlockSettings('hero', textId, {
      text: 'Updated nested text',
    })
    editorActions.reorderBlocks('hero', [buttonId, textId], containerId)

    const container =
      editorStore.get().template.sections.hero.blocks?.[containerId]
    expect(container?.block_order).toEqual([buttonId, textId])
    expect(container?.blocks?.[textId].settings).toEqual({
      text: 'Updated nested text',
    })
    expect(editorStore.get().selectedItem).toEqual({
      type: 'block',
      id: buttonId,
      sectionId: 'hero',
      parentBlockId: containerId,
    })
  })

  it('removes a container and all nested children', () => {
    const containerId = editorActions.addBlock('hero', 'flex')
    const childId = editorActions.addBlock('hero', 'heading', {}, containerId)

    editorActions.removeBlock('hero', containerId)

    const section = editorStore.get().template.sections.hero
    expect(section.block_order).not.toContain(containerId)
    expect(section.blocks?.[containerId]).toBeUndefined()
    expect(editorStore.get().selectedItem).not.toMatchObject({ id: childId })
  })
})
