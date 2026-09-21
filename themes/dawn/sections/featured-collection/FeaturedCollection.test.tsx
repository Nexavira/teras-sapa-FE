import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { editorActions, editorStore } from '#/store/editorStore'

import { FeaturedCollection } from './FeaturedCollection'
import { FeaturedCollectionSchema } from './FeaturedCollection.schema'
import { normalizeFeaturedCollections } from './featuredCollectionBlocks'
import { ThemeEditorProvider } from '#themes/shared/editor-context'
import type { TemplateData } from '#themes/shared/types/theme'

const legacy: TemplateData = {
  order: ['featured'],
  sections: {
    featured: {
      type: 'featured_collection',
      settings: {
        title: 'My collection',
        description: 'My subtitle',
        products_to_show: 2,
        show_quick_add: false,
      },
      blocks: {
        custom: { type: 'text', settings: { text: 'Existing custom block' } },
      },
      block_order: ['custom'],
    },
  },
}

afterEach(cleanup)

describe('featured collection editor blocks', () => {
  it('preserves legacy content and custom blocks without mutating the source', () => {
    const template = normalizeFeaturedCollections(legacy)
    const section = template.sections.featured
    const blocks = section.block_order!.map((id) => section.blocks![id])
    expect(blocks.map((block) => block.type)).toEqual([
      'heading',
      'text',
      'text',
      'featured_product',
      'button',
    ])
    expect(blocks[0].settings.heading).toBe('My collection')
    expect(
      blocks[3].block_order!.map((childId) => blocks[3].blocks![childId].type),
    ).toEqual([
      'product_image',
      'product_badge',
      'product_category',
      'product_title',
      'product_price',
    ])
    expect(legacy.sections.featured.block_order).toEqual(['custom'])
    expect(normalizeFeaturedCollections(template)).toEqual(template)
  })

  it('selects the same block from every card and applies shared edits to the entire product list', () => {
    editorActions.setTemplate(legacy)
    const draw = () => {
      const section = editorStore.state.template.sections.featured
      return (
        <ThemeEditorProvider
          value={{
            selectedItem: editorStore.state.selectedItem,
            selectBlock: editorActions.selectItem,
          }}
        >
          <FeaturedCollection
            id="featured"
            settings={section.settings}
            blocks={section.blocks}
            blockOrder={section.block_order}
            isEditor
          />
        </ThemeEditorProvider>
      )
    }
    const view = render(draw())
    fireEvent.click(screen.getByText('Washed Linen Overshirt'))
    const selected = editorStore.state.selectedItem!
    expect(selected).toMatchObject({
      type: 'block',
      sectionId: 'featured',
      parentBlockId: expect.any(String),
    })
    fireEvent.click(screen.getByText('Everyday Canvas Carryall'))
    expect(editorStore.state.selectedItem).toEqual(selected)
    const section = editorStore.state.template.sections.featured
    const productId = section.block_order!.find(
      (id) => section.blocks![id].type === 'featured_product',
    )!
    const productBlock = section.blocks![productId]
    const childId = (type: string) =>
      productBlock.block_order!.find(
        (id) => productBlock.blocks![id].type === type,
      )!
    editorActions.addBlock(
      'featured',
      'product_quick_add',
      { label: 'Add to bag' },
      productId,
    )
    for (const type of ['product_category', 'product_price', 'product_badge']) {
      editorActions.removeBlock('featured', childId(type))
    }
    view.rerender(draw())
    expect(screen.getByText('Washed Linen Overshirt')).toBeTruthy()
    expect(screen.getByText('Everyday Canvas Carryall')).toBeTruthy()
    expect(screen.getAllByText('Add to bag')).toHaveLength(2)
    expect(screen.queryByText('Serein Studio')).toBeNull()
    expect(screen.queryByText('$94.00')).toBeNull()
    expect(screen.queryByText('$68.00')).toBeNull()
    expect(screen.queryByText('Sale')).toBeNull()
    editorActions.removeBlock('featured', selected.id!)
    const saved = JSON.parse(JSON.stringify(editorStore.state.template))
    editorActions.setTemplate(saved)
    view.rerender(draw())
    expect(screen.queryByText('Everyday Canvas Carryall')).toBeNull()
    expect(screen.queryByText('Washed Linen Overshirt')).toBeNull()
  })

  it('merges previously separate cards while preserving product data and the first shared settings', () => {
    const old: TemplateData = {
      order: ['featured'],
      sections: {
        featured: {
          type: 'featured_collection',
          settings: { content_blocks_version: 1 },
          block_order: ['first', 'second'],
          blocks: {
            first: {
              type: 'featured_product',
              settings: {
                title: 'Custom first',
                price: 17,
                show_quick_add: false,
              },
            },
            second: {
              type: 'featured_product',
              settings: { title: 'Custom second', price: 25 },
            },
          },
        },
      },
    }
    const updated = normalizeFeaturedCollections(old)
    const section = updated.sections.featured
    expect(section.block_order).toEqual(['first'])
    expect(Object.keys(section.blocks!)).toEqual(['first'])
    expect(
      section.blocks!.first.block_order!.map(
        (id) => section.blocks!.first.blocks![id].type,
      ),
    ).not.toContain('product_quick_add')
    expect(section.blocks!.first.settings.title).toBeUndefined()
    expect(
      section.settings.product_data.map(
        (product: { title: string }) => product.title,
      ),
    ).toEqual(['Custom first', 'Custom second'])
    expect(normalizeFeaturedCollections(updated)).toEqual(updated)
    expect(old.sections.featured.block_order).toEqual(['first', 'second'])
  })

  it('starts newly added sections with editable content and respects removed legacy content', () => {
    const preset = FeaturedCollectionSchema.presets![0]
    expect(
      preset.blocks!.filter((block) => block.type === 'featured_product'),
    ).toHaveLength(1)
    expect(preset.settings!.content_blocks_version).toBe(3)
    expect(
      preset.blocks!.find((block) => block.type === 'featured_product')!.blocks,
    ).toHaveLength(6)
    const template = normalizeFeaturedCollections({
      order: ['featured'],
      sections: {
        featured: {
          type: 'featured_collection',
          settings: {
            title: '',
            description: '',
            show_view_all: false,
            products_to_show: 2,
          },
        },
      },
    })
    expect(
      Object.values(template.sections.featured.blocks!).map(
        (block) => block.type,
      ),
    ).toEqual(['featured_product'])
  })
})
