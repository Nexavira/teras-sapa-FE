import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PageRenderer } from '#/routes/preview/-components/PageRenderer'
import { editorActions, editorStore } from '#/store/editorStore'

import { getTemplate, templateCatalog } from '#themes'

const originalState = structuredClone(editorStore.state)
afterEach(() => {
  cleanup()
  editorStore.setState(() => structuredClone(originalState))
})

describe('theme page templates', () => {
  it('preserves independent drafts and prevents undo from crossing pages', () => {
    editorActions.updateSectionSettings('header_main', {
      logo_text: 'Home draft',
    })
    editorActions.switchTemplate('about')
    editorActions.updateSectionSettings('header_main', {
      logo_text: 'About draft',
    })
    editorActions.switchTemplate('index')
    expect(
      editorStore.state.template.sections.header_main.settings.logo_text,
    ).toBe('Home draft')
    editorActions.undo()
    expect(editorStore.state.activeTemplateId).toBe('index')
    expect(
      editorStore.state.template.sections.header_main.settings.logo_text,
    ).toBe('Home draft')
    editorActions.switchTemplate('about')
    expect(
      editorStore.state.template.sections.header_main.settings.logo_text,
    ).toBe('About draft')
    expect(editorStore.state.selectedItem).toBeNull()
  })

  it('ignores invalid page switches and falls back to Home for unknown previews', () => {
    editorActions.switchTemplate('missing')
    expect(editorStore.state.activeTemplateId).toBe('index')
    expect(getTemplate('missing')).toEqual(getTemplate('index'))
    expect(getTemplate('__proto__')).toEqual(getTemplate('index'))
  })

  it.each(Object.keys(templateCatalog))('renders the %s template', (id) => {
    const { container, unmount } = render(<PageRenderer templateId={id} />)
    expect(container.querySelector('h1')).not.toBeNull()
    expect(container.textContent).not.toContain('Unknown section type')
    unmount()
  })

  it('keeps FAQ answers collapsed in preview and expanded for editing', () => {
    const { container, rerender } = render(<PageRenderer templateId="faq" />)
    expect(container.querySelectorAll('details').length).toBe(3)
    expect(container.querySelectorAll('details[open]').length).toBe(0)
    rerender(<PageRenderer templateId="faq" mode="editor" />)
    expect(container.querySelectorAll('details[open]').length).toBe(3)
  })

  it('updates the preview when the selected template changes', () => {
    const { rerender } = render(<PageRenderer templateId="about" />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Our story',
    )
    rerender(<PageRenderer templateId="faq" />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Frequently asked questions',
    )
  })
})
