import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { EditorHoverOverlay } from './EditorHoverOverlay'

afterEach(cleanup)

describe('EditorHoverOverlay', () => {
  beforeEach(() => {
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 50,
      left: 20,
      width: 300,
      height: 120,
      right: 320,
      bottom: 170,
      x: 20,
      y: 50,
      toJSON: () => {},
    })

    // Mock requestAnimationFrame and cancelAnimationFrame
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      return setTimeout(() => cb(Date.now()), 16) as unknown as number
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      clearTimeout(id)
    })
  })

  it('renders nothing when hoveredItem is null', () => {
    const { container } = render(<EditorHoverOverlay hoveredItem={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders bounding box and badge over hovered section with correct label and dimensions', () => {
    const sectionEl = document.createElement('div')
    sectionEl.id = 'teras-sapa-section-hero'
    sectionEl.setAttribute('data-section-id', 'hero')
    sectionEl.setAttribute('data-section-name', 'Hero Banner')
    document.body.appendChild(sectionEl)

    render(
      <EditorHoverOverlay
        hoveredItem={{
          type: 'section',
          id: 'hero',
        }}
      />,
    )

    const overlay = screen.getByText('Hero Banner')
    expect(overlay).toBeDefined()
    expect(screen.getByText('300 × 120')).toBeDefined()

    const boundingBox = document.querySelector(
      '[data-editor-bounding-box="true"]',
    )
    expect(boundingBox).not.toBeNull()

    document.body.removeChild(sectionEl)
  })

  it('renders bounding box over hovered block with block label and symbol', () => {
    const blockEl = document.createElement('div')
    blockEl.id = 'teras-sapa-block-btn1'
    blockEl.setAttribute('data-block-id', 'btn1')
    blockEl.setAttribute('data-section-id', 'hero')
    blockEl.setAttribute('data-block-label', 'Shop Button')
    document.body.appendChild(blockEl)

    render(
      <EditorHoverOverlay
        hoveredItem={{
          type: 'block',
          id: 'btn1',
          sectionId: 'hero',
        }}
      />,
    )

    expect(screen.getByText('Shop Button')).toBeDefined()
    expect(screen.getByText('⊞')).toBeDefined()
    expect(screen.getByText('300 × 120')).toBeDefined()

    document.body.removeChild(blockEl)
  })

  it('positions badge inside when element is clipped at top of viewport', () => {
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 10, // < 26 => top clipped
      left: 0,
      width: 400,
      height: 60,
      right: 400,
      bottom: 70,
      x: 0,
      y: 10,
      toJSON: () => {},
    })

    const headerEl = document.createElement('div')
    headerEl.id = 'teras-sapa-section-header'
    headerEl.setAttribute('data-section-id', 'header')
    headerEl.setAttribute('data-section-name', 'Header')
    document.body.appendChild(headerEl)

    render(
      <EditorHoverOverlay
        hoveredItem={{
          type: 'section',
          id: 'header',
        }}
      />,
    )

    const badge = document.querySelector('[data-editor-bounding-badge="true"]')
    expect(badge).not.toBeNull()

    document.body.removeChild(headerEl)
  })

  it('renders selected bounding box over selected element', () => {
    const sectionEl = document.createElement('div')
    sectionEl.id = 'teras-sapa-section-hero'
    sectionEl.setAttribute('data-section-id', 'hero')
    sectionEl.setAttribute('data-section-name', 'Hero Banner')
    document.body.appendChild(sectionEl)

    render(
      <EditorHoverOverlay
        hoveredItem={null}
        selectedItem={{
          type: 'section',
          id: 'hero',
        }}
      />,
    )

    const selectedBox = document.querySelector(
      '[data-editor-selected-bounding-box="true"]',
    )
    expect(selectedBox).not.toBeNull()
    expect(screen.getByText('Hero Banner')).toBeDefined()

    document.body.removeChild(sectionEl)
  })
})
