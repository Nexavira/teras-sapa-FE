import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PreviewSectionWrapper } from './PreviewSectionWrapper'

afterEach(cleanup)

function setup(isEditor = true) {
  const onSelect = vi.fn()
  const onHover = vi.fn()
  const onNavigate = vi.fn()
  const view = render(
    <PreviewSectionWrapper
      id="hero"
      sectionType="hero"
      sectionName="Hero"
      isEditor={isEditor}
      isSelected={false}
      onSelect={onSelect}
      onHover={onHover}
    >
      <div data-block-id="group" data-section-id="hero">
        <div
          data-block-id="nested"
          data-parent-block-id="group"
          data-section-id="hero"
        >
          <div
            data-block-id="button"
            data-parent-block-id="nested"
            data-section-id="hero"
            tabIndex={0}
          >
            <a href="#shop" onClick={onNavigate}>
              Shop
            </a>
          </div>
        </div>
      </div>
      <p>Section background</p>
    </PreviewSectionWrapper>,
  )
  return { ...view, onSelect, onHover, onNavigate }
}

describe('editor canvas interactions', () => {
  it('selects the deepest block and suppresses storefront navigation', () => {
    const { onSelect, onNavigate } = setup()
    expect(fireEvent.click(screen.getByText('Shop'))).toBe(false)
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('hero', 'button', 'nested')
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('selects a section from its background and supports Enter and Space', () => {
    const { onSelect } = setup()
    fireEvent.click(screen.getByText('Section background'))
    expect(onSelect).toHaveBeenLastCalledWith('hero')
    for (const key of ['Enter', ' ']) {
      fireEvent.keyDown(screen.getByText('Shop').parentElement!, { key })
      expect(onSelect).toHaveBeenLastCalledWith('hero', 'button', 'nested')
    }
  })

  it('reports the deepest hovered block, then section, then clears hover', () => {
    const { onHover } = setup()
    fireEvent.mouseOver(screen.getByText('Shop'))
    expect(onHover).toHaveBeenLastCalledWith({
      type: 'block',
      id: 'button',
      sectionId: 'hero',
      parentBlockId: 'nested',
    })
    fireEvent.mouseOver(screen.getByText('Section background'))
    expect(onHover).toHaveBeenLastCalledWith({ type: 'section', id: 'hero' })
    fireEvent.mouseLeave(screen.getByLabelText('Edit Hero'))
    expect(onHover).toHaveBeenLastCalledWith(null)
  })

  it('preserves normal interaction outside editor mode', () => {
    const { onSelect, onNavigate, container } = setup(false)
    expect(fireEvent.click(screen.getByText('Shop'))).toBe(true)
    expect(onNavigate).toHaveBeenCalledOnce()
    expect(onSelect).not.toHaveBeenCalled()
    expect(container.querySelector('[data-editor-surface]')).toBeNull()
  })
})
