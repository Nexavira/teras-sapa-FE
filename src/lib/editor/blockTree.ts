import type { BlockInstance } from '#themes/types/theme'

export interface BlockCollection {
  block_order?: string[]
  blocks?: Record<string, BlockInstance>
}

export interface BlockLocation {
  block: BlockInstance
  parentBlockId?: string
}

export function findBlockLocation(
  blocks: Record<string, BlockInstance> | undefined,
  blockId: string,
  parentBlockId?: string,
): BlockLocation | undefined {
  if (!blocks) return undefined

  const directBlock = Object.hasOwn(blocks, blockId)
    ? blocks[blockId]
    : undefined
  if (directBlock) return { block: directBlock, parentBlockId }

  for (const block of Object.values(blocks)) {
    const location = findBlockLocation(block.blocks, blockId, block.id)
    if (location) return location
  }

  return undefined
}

export function updateBlockInTree(
  blocks: Record<string, BlockInstance> | undefined,
  blockId: string,
  update: (block: BlockInstance) => BlockInstance,
): Record<string, BlockInstance> | undefined {
  if (!blocks) return blocks

  if (Object.hasOwn(blocks, blockId)) {
    return {
      ...blocks,
      [blockId]: update(blocks[blockId]),
    }
  }

  for (const [candidateId, candidate] of Object.entries(blocks)) {
    const updatedChildren = updateBlockInTree(candidate.blocks, blockId, update)
    if (updatedChildren !== candidate.blocks) {
      return {
        ...blocks,
        [candidateId]: {
          ...candidate,
          blocks: updatedChildren,
        },
      }
    }
  }

  return blocks
}

export function removeBlockFromCollection(
  collection: BlockCollection,
  blockId: string,
): BlockCollection {
  if (collection.blocks?.[blockId]) {
    const blocks = { ...collection.blocks }
    delete blocks[blockId]

    return {
      ...collection,
      blocks,
      block_order: (collection.block_order || []).filter(
        (candidateId) => candidateId !== blockId,
      ),
    }
  }

  if (!collection.blocks) return collection

  for (const [candidateId, candidate] of Object.entries(collection.blocks)) {
    const updatedCandidate = removeBlockFromCollection(candidate, blockId)
    if (updatedCandidate !== candidate) {
      return {
        ...collection,
        blocks: {
          ...collection.blocks,
          [candidateId]: {
            ...candidate,
            ...updatedCandidate,
          },
        },
      }
    }
  }

  return collection
}

export function getDescendantBlockIds(block: BlockInstance): string[] {
  return Object.entries(block.blocks || {}).flatMap(([childId, child]) => [
    childId,
    ...getDescendantBlockIds(child),
  ])
}

export function reorderItems(
  order: string[],
  fromIndex: number,
  toIndex: number,
): string[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= order.length ||
    toIndex >= order.length
  ) {
    return order
  }

  const nextOrder = [...order]
  const [item] = nextOrder.splice(fromIndex, 1)
  nextOrder.splice(toIndex, 0, item)
  return nextOrder
}
