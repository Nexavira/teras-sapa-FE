/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '#/-components/ui/ThemeProvider'
import { editorActions, editorStore } from '#/store/editorStore'

import { EditorHeader } from '../Header/EditorHeader'
import { editorSensors } from './editorDnd'
import { EditorLeftSidebar } from './EditorLeftSidebar'
import { ActionIconButton, TreeItem } from './TreeItem'

vi.hoisted(() => {
  if (typeof globalThis !== 'undefined') {
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    className,
  }: {
    children: ReactNode
    className?: string
  }) => <a className={className}>{children}</a>,
}))

afterEach(cleanup)

describe('Editor Left Sidebar & Header Navigation', () => {
  beforeEach(() => {
    editorActions.setActiveTab('sections')
  })

  it('renders section / settings switcher buttons in EditorHeader', () => {
    render(
      <ThemeProvider>
        <EditorHeader />
      </ThemeProvider>,
    )

    const sectionsBtn = screen.getByRole('button', { name: /sections/i })
    const settingsBtn = screen.getByRole('button', { name: /theme settings/i })

    expect(sectionsBtn).toBeDefined()
    expect(settingsBtn).toBeDefined()

    // Sections is initially active
    expect(sectionsBtn.getAttribute('data-active')).toBe('true')
    expect(settingsBtn.getAttribute('data-active')).toBe('false')

    // Clicking switches tab
    fireEvent.click(settingsBtn)
    expect(editorStore.state.activeTab).toBe('settings')
    expect(settingsBtn.getAttribute('data-active')).toBe('true')
  })

  it('renders TreeItem with AdminLayout navigation button styling and collapsible chevron in startIcon on the left', () => {
    const handleToggle = vi.fn()
    const handleClick = vi.fn()
    const mockButtonRef = vi.fn()

    render(
      <ThemeProvider>
        <TreeItem
          active={true}
          icon={<span data-testid="test-icon">Icon</span>}
          hasChildren={true}
          isOpen={true}
          buttonRef={mockButtonRef}
          onToggleOpen={handleToggle}
          onClick={handleClick}
        >
          Sample Section
        </TreeItem>
      </ThemeProvider>,
    )

    const itemBtn = screen.getByRole('button', { name: /sample section/i })
    expect(itemBtn).toBeDefined()
    expect(itemBtn.getAttribute('data-active')).toBe('true')

    // buttonRef was called with the button element for full-button drag reorder
    expect(mockButtonRef).toHaveBeenCalled()

    // Label with data-nav-label
    expect(itemBtn.querySelector('[data-nav-label]')?.textContent).toBe(
      'Sample Section',
    )

    // startIcon rendered
    const testIcon = screen.getByTestId('test-icon')
    expect(testIcon).toBeDefined()

    // collapsible toggle chevron rendered in startIcon before the item icon
    const chevron = screen.getByRole('button', { name: /collapse/i })
    expect(chevron).toBeDefined()
    expect(chevron.getAttribute('data-action-button')).toBe('chevron')
    expect(chevron.getAttribute('data-no-dnd')).toBe('true')

    const startIconSlot = itemBtn.querySelector('[data-slot="start-icon"]')
    expect(startIconSlot).toBeDefined()
    expect(startIconSlot?.contains(chevron)).toBe(true)
    expect(startIconSlot?.contains(testIcon)).toBe(true)

    // Clicking chevron toggles open without triggering main button click
    fireEvent.click(chevron)
    expect(handleToggle).toHaveBeenCalledTimes(1)
    expect(handleClick).not.toHaveBeenCalled()

    // Clicking button triggers main onClick
    fireEvent.click(itemBtn)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('prioritizes ActionIconButton click and prevents parent selection or drag', () => {
    const handleItemClick = vi.fn()
    const handleActionClick = vi.fn()

    render(
      <ThemeProvider>
        <TreeItem
          onClick={handleItemClick}
          actions={
            <ActionIconButton
              aria-label="Remove section"
              onClick={handleActionClick}
            >
              Delete
            </ActionIconButton>
          }
        >
          Section Item
        </TreeItem>
      </ThemeProvider>,
    )

    const deleteBtn = screen.getByRole('button', { name: /remove section/i })
    expect(deleteBtn).toBeDefined()
    expect(deleteBtn.getAttribute('data-action-button')).toBe('action')
    expect(deleteBtn.getAttribute('data-no-dnd')).toBe('true')

    // Clicking ActionIconButton fires its own handler, not parent onClick
    fireEvent.click(deleteBtn)
    expect(handleActionClick).toHaveBeenCalledTimes(1)
    expect(handleItemClick).not.toHaveBeenCalled()

    // PointerDown on ActionIconButton stops propagation
    const pointerDownEvent = new MouseEvent('pointerdown', { bubbles: true })
    const stopPropagationSpy = vi.spyOn(pointerDownEvent, 'stopPropagation')
    deleteBtn.dispatchEvent(pointerDownEvent)
    expect(stopPropagationSpy).toHaveBeenCalled()
  })

  it('configures editorSensors with hold-to-drag activation and action button exclusion', () => {
    expect(editorSensors).toBeDefined()
    expect(editorSensors.length).toBeGreaterThanOrEqual(1)

    // Check pointer sensor configuration
    const pointerSensorConfig = editorSensors[0]
    expect(pointerSensorConfig).toBeDefined()

    const options = (pointerSensorConfig as any).options
    expect(options).toBeDefined()

    // activationConstraints provides Delay constraint for hold-to-drag
    const constraints = options.activationConstraints?.(
      { pointerType: 'mouse' } as any,
      {} as any,
    )
    expect(constraints).toBeDefined()
    expect(constraints[0]).toBeDefined()

    // preventActivation returns true for action buttons / chevrons / data-no-dnd
    const actionEl = document.createElement('span')
    actionEl.setAttribute('data-action-button', 'action')
    expect(
      options.preventActivation?.({ target: actionEl } as any, {} as any),
    ).toBe(true)

    const chevronEl = document.createElement('span')
    chevronEl.setAttribute('data-no-dnd', 'true')
    expect(
      options.preventActivation?.({ target: chevronEl } as any, {} as any),
    ).toBe(true)

    // Standard nav button click is allowed to activate hold-to-drag
    const normalEl = document.createElement('button')
    normalEl.setAttribute('data-nav-item', 'true')
    expect(
      options.preventActivation?.({ target: normalEl } as any, {} as any),
    ).toBe(false)
  })

  it('renders SectionTree when activeTab is sections and SettingsList when activeTab is settings', () => {
    const { rerender } = render(
      <ThemeProvider>
        <EditorLeftSidebar />
      </ThemeProvider>,
    )

    // Sections view shows sections groups
    expect(screen.getByText(/Template sections/i)).toBeDefined()

    // Switch to settings
    editorActions.setActiveTab('settings')
    rerender(
      <ThemeProvider>
        <EditorLeftSidebar />
      </ThemeProvider>,
    )

    expect(screen.getByText(/Global Theme Settings/i)).toBeDefined()
  })

  it('renders PageSelector in EditorLeftSidebar with store pages and triggers onPageChange on select', () => {
    const handlePageChange = vi.fn()
    const mockPages = [
      {
        id: 1,
        uuid: 'page-home',
        tenant_template_uuid: 'tpl-1',
        title: 'Home Page',
        slug: 'home',
        is_active: 1,
        template_data: null,
        created_at: '',
        updated_at: '',
      },
      {
        id: 2,
        uuid: 'page-about',
        tenant_template_uuid: 'tpl-1',
        title: 'Tentang Kami',
        slug: 'tentang-kami',
        is_active: 1,
        template_data: null,
        created_at: '',
        updated_at: '',
      },
    ]

    render(
      <ThemeProvider>
        <EditorLeftSidebar
          tenantTemplateUuid="tpl-1"
          tenantPages={mockPages}
          onPageChange={handlePageChange}
        />
      </ThemeProvider>,
    )

    // Check that Halaman label and select are rendered
    expect(screen.getByText(/halaman/i)).toBeDefined()
    const select = screen.getByRole('combobox', { name: /pilih halaman/i })
    expect(select).toBeDefined()

    // Options for store pages exist
    expect(
      screen.getByRole('option', { name: /Home Page \(\/home\)/i }),
    ).toBeDefined()
    expect(
      screen.getByRole('option', { name: /Tentang Kami \(\/tentang-kami\)/i }),
    ).toBeDefined()

    // Select second page
    fireEvent.change(select, { target: { value: 'tentang-kami' } })
    expect(handlePageChange).toHaveBeenCalledWith('tentang-kami')
  })

  it('renders action buttons in PageSelector for editing and creating pages', () => {
    editorActions.setActivePageData({
      uuid: 'page-current',
      title: 'Current Page',
      slug: 'current-slug',
      is_active: 1,
    })

    render(
      <ThemeProvider>
        <EditorLeftSidebar tenantTemplateUuid="tpl-1" />
      </ThemeProvider>,
    )

    const editBtn = screen.getByRole('button', { name: /edit data halaman/i })
    const createBtn = screen.getByRole('button', { name: /buat halaman baru/i })

    expect(editBtn).toBeDefined()
    expect(createBtn).toBeDefined()
    expect(screen.getByText('/current-slug')).toBeDefined()
  })
})
