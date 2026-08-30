import type {
  BlockInstance,
  BlockSchema,
  SectionInstance,
  SectionSchema,
  SettingDefinition,
} from '#themes/types/theme'

export interface BlockAvailability {
  canAdd: boolean
  reason?: string
}

/** Build a fresh settings object from schema defaults for a new instance. */
export function getSchemaDefaults(
  definitions: SettingDefinition[],
): Record<string, unknown> {
  return definitions.reduce<Record<string, unknown>>((defaults, definition) => {
    if (definition.default !== undefined) {
      defaults[definition.id] = structuredClone(definition.default)
    }
    return defaults
  }, {})
}

/** Apply both the section-wide and per-type block limits declared by the theme. */
export function getBlockAvailability(
  parent: SectionInstance | BlockInstance,
  parentSchema: SectionSchema | BlockSchema,
  blockSchema: BlockSchema,
): BlockAvailability {
  const blockOrder = parent.block_order || []

  if (
    typeof parentSchema.max_blocks === 'number' &&
    blockOrder.length >= parentSchema.max_blocks
  ) {
    return {
      canAdd: false,
      reason: `This container allows up to ${parentSchema.max_blocks} blocks.`,
    }
  }

  const typeCount = blockOrder.reduce((count, blockId) => {
    return parent.blocks?.[blockId]?.type === blockSchema.type
      ? count + 1
      : count
  }, 0)

  if (typeof blockSchema.limit === 'number' && typeCount >= blockSchema.limit) {
    return {
      canAdd: false,
      reason: `You can add up to ${blockSchema.limit} ${blockSchema.name} blocks.`,
    }
  }

  return { canAdd: true }
}

export function canDuplicateSection(
  sectionTypeCount: number,
  sectionSchema: SectionSchema,
): boolean {
  return (
    typeof sectionSchema.limit !== 'number' ||
    sectionTypeCount < sectionSchema.limit
  )
}
