import { DragDropProvider } from '@dnd-kit/react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '#/-components/ui/ThemeProvider'

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
})
