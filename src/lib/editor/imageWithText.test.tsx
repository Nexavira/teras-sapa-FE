import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { editorActions, editorStore } from '#/store/editorStore'

import { ImageWithText } from '#themes/sections/image-with-text/ImageWithText'
import { ImageWithTextSchema } from '#themes/sections/image-with-text/ImageWithText.schema'
import { normalizeImageWithText } from '#themes/sections/image-with-text/imageWithTextBlocks'
import type { TemplateData } from '#themes/types/theme'

const legacy: TemplateData = {
  order: ['editorial'],
  sections: {
    editorial: {
      type: 'image_with_text',
      settings: {
        heading: 'Our story',
        eyebrow: '',
        image: '/custom.webp',
        button_link: '/story',
      },
    },
  },
}
afterEach(cleanup)

describe('image with text blocks', () => {
  it('preserves legacy content and blank fields, and migrates only once', () => {
    const migrated = normalizeImageWithText(legacy)
    const blocks = Object.values(migrated.sections.editorial.blocks!)
    expect(blocks.map((block) => block.type)).toEqual([
      'editorial_image',
      'editorial_heading',
      'editorial_text',
      'editorial_link',
    ])
    expect(blocks[0].settings.image).toBe('/custom.webp')
    expect(blocks[1].settings.heading).toBe('Our story')
    expect(blocks[3].settings.button_link).toBe('/story')
    expect(legacy.sections.editorial.blocks).toBeUndefined()
    expect(normalizeImageWithText(migrated)).toEqual(migrated)
    expect(ImageWithTextSchema.presets![0].blocks).toHaveLength(5)
  })

  it('selects individual content and preserves deletions when saved and reloaded', () => {
    editorActions.setTemplate(legacy)
    const draw = () => {
      const section = editorStore.state.template.sections.editorial
      return (
        <ImageWithText
          id="editorial"
          settings={section.settings}
          blocks={section.blocks}
          blockOrder={section.block_order}
          isEditor
        />
      )
    }
    const view = render(draw())
    fireEvent.click(screen.getByText('Our story'))
    expect(editorStore.state.selectedItem).toMatchObject({
      type: 'block',
      sectionId: 'editorial',
    })
    editorActions.removeBlock('editorial', editorStore.state.selectedItem!.id!)
    editorActions.setTemplate(
      JSON.parse(JSON.stringify(editorStore.state.template)),
    )
    view.rerender(draw())
    expect(screen.queryByText('Our story')).toBeNull()
    expect(screen.getByText('Our approach').getAttribute('href')).toBe('/story')
  })
})
