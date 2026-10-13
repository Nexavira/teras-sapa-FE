import { DragDropProvider } from '@dnd-kit/react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '#/-components/ui/ThemeProvider'
import { editorActions } from '#/store/editorStore'

import { BlockItemErrorBoundary } from './BlockList'
import { editorSensors } from './editorDnd'
import { SectionEntry } from './SectionEntry'

vi.hoisted(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

afterEach(cleanup)

describe('BlockList', () => {
  it('shows the child block picker for an empty flex container', () => {
    const onAddBlock = vi.fn()
    const headingSchema = {
      type: 'heading',
      name: 'Heading',
      settings: [],
    }
    const flexSchema = {
      type: 'flex',
      name: 'Flex container',
      settings: [],
      blocks: [headingSchema],
      max_blocks: 12,
    }
    const heroSchema = {
      type: 'hero_banner',
      name: 'Image Banner',
      settings: [],
      blocks: [flexSchema],
    }

    render(
      <ThemeProvider>
        <DragDropProvider sensors={editorSensors}>
          <SectionEntry
            canRemove={false}
            canReorder={false}
            index={0}
            onAddBlock={onAddBlock}
            schema={heroSchema}
            section={{
              id: 'hero',
              type: 'hero_banner',
              settings: {},
              blocks: {
                actions: {
                  id: 'actions',
                  type: 'flex',
                  settings: { direction: 'row' },
                  blocks: {},
                  block_order: [],
                },
              },
              block_order: ['actions'],
            }}
            sectionId="hero"
          />
        </DragDropProvider>
      </ThemeProvider>,
    )

    const addBlockButtons = screen.getAllByRole('button', {
      name: /add block/i,
    })
    expect(addBlockButtons).toHaveLength(2)
    expect(getComputedStyle(addBlockButtons[0]).marginLeft).toBe('52px')
    expect(getComputedStyle(addBlockButtons[1]).marginLeft).toBe('32px')

    fireEvent.click(addBlockButtons[0])
    expect(onAddBlock).toHaveBeenCalledExactlyOnceWith('actions')
  })

  it('renders nested child blocks when container block lacks explicit id property', () => {
    const onAddBlock = vi.fn()
    const metricSchema = {
      type: 'metric_item',
      name: 'Metric item',
      settings: [],
    }
    const gridSchema = {
      type: 'grid',
      name: 'Grid container',
      settings: [],
      blocks: [metricSchema],
    }
    const metricsSectionSchema = {
      type: 'company_metrics',
      name: 'Metrics & stats',
      settings: [],
      blocks: [gridSchema],
    }

    render(
      <ThemeProvider>
        <DragDropProvider sensors={editorSensors}>
          <SectionEntry
            canRemove={false}
            canReorder={false}
            index={0}
            onAddBlock={onAddBlock}
            schema={metricsSectionSchema}
            section={{
              id: 'metrics',
              type: 'company_metrics',
              settings: {},
              blocks: {
                grid_metrics: {
                  type: 'grid',
                  settings: {},
                  block_order: ['metric_1', 'metric_2'],
                  blocks: {
                    metric_1: {
                      type: 'metric_item',
                      settings: { stat: '38' },
                    },
                    metric_2: {
                      type: 'metric_item',
                      settings: { stat: '0.01' },
                    },
                  },
                },
              },
              block_order: ['grid_metrics'],
            }}
            sectionId="metrics"
          />
        </DragDropProvider>
      </ThemeProvider>,
    )

    expect(screen.getByText('Grid container')).not.toBeNull()
    const metricNavItems = screen.getAllByText('Metric item')
    expect(metricNavItems).toHaveLength(2)
  })

  it('catches missing/undefined blocks and displays which block has an error', () => {
    const onAddBlock = vi.fn()
    const removeBlockSpy = vi
      .spyOn(editorActions, 'removeBlock')
      .mockImplementation(() => {})
    const sectionSchema = {
      type: 'hero_banner',
      name: 'Image Banner',
      settings: [],
      blocks: [
        {
          type: 'heading',
          name: 'Heading',
          settings: [],
        },
      ],
    }

    render(
      <ThemeProvider>
        <DragDropProvider sensors={editorSensors}>
          <SectionEntry
            canRemove={false}
            canReorder={false}
            index={0}
            onAddBlock={onAddBlock}
            schema={sectionSchema}
            section={{
              id: 'hero',
              type: 'hero_banner',
              settings: {},
              blocks: {
                valid_block: {
                  type: 'heading',
                  settings: {},
                },
                // corrupted_block_1 is missing in blocks dictionary
              },
              block_order: ['valid_block', 'corrupted_block_1'],
            }}
            sectionId="hero"
          />
        </DragDropProvider>
      </ThemeProvider>,
    )

    // Should render the valid block normally
    expect(screen.getByText('Heading')).not.toBeNull()
    // Should catch the missing block and tell which block had an error
    expect(screen.getByText('Missing block (corrupted_block_1)')).not.toBeNull()

    // Can delete the broken block
    const deleteButtons = screen.getAllByRole('button', {
      name: /delete block/i,
    })
    expect(deleteButtons.length).toBeGreaterThanOrEqual(1)
    fireEvent.click(deleteButtons[deleteButtons.length - 1])
    expect(removeBlockSpy).toHaveBeenCalledWith('hero', 'corrupted_block_1')

    removeBlockSpy.mockRestore()
  })

  it('catches unregistered block types and displays which block type is unregistered', () => {
    const onAddBlock = vi.fn()
    const sectionSchema = {
      type: 'hero_banner',
      name: 'Image Banner',
      settings: [],
      blocks: [
        {
          type: 'heading',
          name: 'Heading',
          settings: [],
        },
      ],
    }

    render(
      <ThemeProvider>
        <DragDropProvider sensors={editorSensors}>
          <SectionEntry
            canRemove={false}
            canReorder={false}
            index={0}
            onAddBlock={onAddBlock}
            schema={sectionSchema}
            section={{
              id: 'hero',
              type: 'hero_banner',
              settings: {},
              blocks: {
                unregistered_1: {
                  type: 'non_existent_type',
                  settings: {},
                },
              },
              block_order: ['unregistered_1'],
            }}
            sectionId="hero"
          />
        </DragDropProvider>
      </ThemeProvider>,
    )

    expect(screen.getByText('Unregistered (non_existent_type)')).not.toBeNull()
  })

  it('catches runtime render crashes and displays error for that specific block', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const removeBlockSpy = vi
      .spyOn(editorActions, 'removeBlock')
      .mockImplementation(() => {})

    const CrashingComponent = () => {
      throw new Error('Simulated render crash')
    }

    render(
      <ThemeProvider>
        <BlockItemErrorBoundary
          blockId="crash_block_123"
          index={0}
          sectionId="section_test"
        >
          <CrashingComponent />
        </BlockItemErrorBoundary>
      </ThemeProvider>,
    )

    expect(
      screen.getByText('Error (crash_block_123): Simulated render crash'),
    ).not.toBeNull()

    const deleteBtn = screen.getByRole('button', {
      name: /delete error block crash_block_123/i,
    })
    fireEvent.click(deleteBtn)
    expect(removeBlockSpy).toHaveBeenCalledWith(
      'section_test',
      'crash_block_123',
    )

    consoleErrorSpy.mockRestore()
    removeBlockSpy.mockRestore()
  })
})
