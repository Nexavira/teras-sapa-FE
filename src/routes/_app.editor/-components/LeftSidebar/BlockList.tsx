import type { DragEndEvent } from '@dnd-kit/react'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { AlertCircleIcon, Delete02Icon, PlusSignIcon } from 'hugeicons-react'
import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

import { findBlockLocation, reorderItems } from '#/lib/editor/blockTree'
import { editorActions, useEditorTheme } from '#/store/editorStore'

import { editorSensors, getBlockParentIdFromDndGroup } from './editorDnd'
import { AddBlockButton, NestedBlockList, SortableEntry } from './sectionTreeStyles'
import { SortableBlockEntry } from './SortableBlockEntry'
import { ActionIconButton, TreeItem } from './TreeItem'
import type { BlockInstance, BlockSchema, SectionSchema } from '#themes'

interface BlockItemErrorBoundaryProps {
  blockId: string
  children: ReactNode
  index: number
  parentBlockId?: string
  sectionId: string
}

interface BlockItemErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class BlockItemErrorBoundary extends Component<
  BlockItemErrorBoundaryProps,
  BlockItemErrorBoundaryState
> {
  constructor(props: BlockItemErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<BlockItemErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[Block Error] Failed to render block "${this.props.blockId}" in section "${this.props.sectionId}":`,
      error,
      errorInfo,
    )
  }

  componentDidUpdate(prevProps: BlockItemErrorBoundaryProps): void {
    if (this.state.hasError && prevProps.blockId !== this.props.blockId) {
      this.setState({ hasError: false, error: null })
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const { blockId, index, parentBlockId, sectionId } = this.props
      return (
        <BlockErrorEntry
          blockId={blockId}
          errorMessage={this.state.error?.message}
          index={index}
          parentBlockId={parentBlockId}
          sectionId={sectionId}
        />
      )
    }

    return this.props.children
  }
}

interface BlockErrorEntryProps {
  blockId: string
  errorMessage?: string
  index: number
  parentBlockId?: string
  sectionId: string
}

export const BlockErrorEntry = ({
  blockId,
  errorMessage,
  index,
  parentBlockId,
  sectionId,
}: BlockErrorEntryProps) => {
  return (
    <SortableEntry $isDragging={false}>
      <TreeItem
        actions={
          <ActionIconButton
            aria-label={`Delete error block ${blockId}`}
            $variant="danger"
            onClick={(e) => {
              e.stopPropagation()
              editorActions.removeBlock(sectionId, blockId)
            }}
            title="Delete block"
          >
            <Delete02Icon size={13} />
          </ActionIconButton>
        }
        icon={<AlertCircleIcon size={14} style={{ color: '#ef4444' }} />}
        index={index}
        level={parentBlockId ? 2 : 1}
        onClick={() =>
          editorActions.selectItem({
            type: 'block',
            id: blockId,
            sectionId,
            parentBlockId,
          })
        }
      >
        <span
          style={{ color: '#dc2626', fontWeight: 500 }}
          title={errorMessage ? `Error: ${errorMessage}` : `Error in block ${blockId}`}
        >
          {errorMessage ? `Error (${blockId}): ${errorMessage}` : `Error in block (${blockId})`}
        </span>
      </TreeItem>
    </SortableEntry>
  )
}

interface BlockListProps {
  blocks: Record<string, BlockInstance>
  blockOrder: Array<string>
  level?: number
  onAddBlock: (parentBlockId?: string) => void
  parentBlockId?: string
  parentSchema: SectionSchema | BlockSchema
  sectionId: string
}

const BlockListItems = ({
  blocks,
  blockOrder,
  level = 1,
  onAddBlock,
  parentBlockId,
  parentSchema,
  sectionId,
}: BlockListProps) => {
  const { BlockRegistry } = useEditorTheme()
  return (
    <NestedBlockList>
      {blockOrder.map((blockId, index) => {
        try {
          const block = blocks?.[blockId]
          const isMissing = !block || !block.type
          const blockType = block?.type || 'unknown'

          const candidateSchema = parentSchema.blocks?.find(
            (candidate) => candidate.type === blockType,
          )
          const registeredSchema = BlockRegistry?.[blockType]?.schema
          const isUnregistered = !candidateSchema && !registeredSchema
          const isError = isMissing || isUnregistered

          if (isMissing) {
            console.warn(
              `[Block Warning] Block "${blockId}" in section "${sectionId}" is missing from block data (undefined).`,
            )
          } else if (isUnregistered) {
            console.warn(
              `[Block Warning] Block "${blockId}" in section "${sectionId}" has unregistered type "${blockType}".`,
            )
          }

          const blockSchema: BlockSchema = candidateSchema ||
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            registeredSchema || {
              type: blockType,
              name: isMissing
                ? `Missing block (${blockId})`
                : `Unregistered (${blockType})`,
              settings: [],
            }

          const safeBlock: BlockInstance = block?.type
            ? {
                ...block,
                id: block.id || blockId,
                type: blockType,
                settings: block.settings || {},
              }
            : {
                id: blockId,
                type: blockType,
                settings: {},
              }
          const childBlockOrder = safeBlock.block_order || []

          return (
            <BlockItemErrorBoundary
              blockId={blockId}
              index={index}
              key={blockId}
              parentBlockId={parentBlockId}
              sectionId={sectionId}
            >
              <SortableBlockEntry
                block={safeBlock}
                blockId={blockId}
                blockSchema={blockSchema}
                index={index}
                isError={isError}
                parentBlockId={parentBlockId}
                sectionId={sectionId}
              >
                {Boolean(blockSchema.blocks?.length) && (
                  <BlockListItems
                    blocks={safeBlock.blocks || {}}
                    blockOrder={childBlockOrder}
                    level={level + 1}
                    onAddBlock={onAddBlock}
                    parentBlockId={blockId}
                    parentSchema={blockSchema}
                    sectionId={sectionId}
                  />
                )}
              </SortableBlockEntry>
            </BlockItemErrorBoundary>
          )
        } catch (error) {
          console.error(
            `[Block Error] Failed to process block "${blockId}" in section "${sectionId}":`,
            error,
          )
          return (
            <BlockErrorEntry
              blockId={blockId}
              errorMessage={error instanceof Error ? error.message : String(error)}
              index={index}
              key={blockId}
              parentBlockId={parentBlockId}
              sectionId={sectionId}
            />
          )
        }
      })}

      {Boolean(parentSchema.blocks?.length) && (
        <AddBlockButton
          color="neutral"
          level={level}
          onClick={() => onAddBlock(parentBlockId)}
          size="sm"
          startIcon={<PlusSignIcon size={13} />}
          type="button"
          variant="dashed"
        >
          Add block
        </AddBlockButton>
      )}
    </NestedBlockList>
  )
}

export const BlockList = (props: BlockListProps) => {
  const { blocks, blockOrder, sectionId } = props

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return

    const { source } = event.operation
    if (
      !isSortable(source) ||
      source.initialGroup !== source.group ||
      source.initialIndex === source.index
    ) {
      return
    }

    const parentBlockId = getBlockParentIdFromDndGroup(
      source.initialGroup,
      sectionId,
    )
    const sourceOrder = parentBlockId
      ? findBlockLocation(blocks, parentBlockId)?.block.block_order || []
      : blockOrder

    editorActions.reorderBlocks(
      sectionId,
      reorderItems(sourceOrder, source.initialIndex, source.index),
      parentBlockId,
    )
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd} sensors={editorSensors}>
      <BlockListItems {...props} />
    </DragDropProvider>
  )
}
