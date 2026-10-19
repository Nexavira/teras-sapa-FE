/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from '@tanstack/react-store'
import { Store } from '@tanstack/store'

import {
  findBlockLocation,
  getDescendantBlockIds,
  removeBlockFromCollection,
  updateBlockInTree,
} from '#/lib/editor/blockTree'
import { fetchHelper } from '#/utils/fetchHelper'

import type {
  BlockInstance,
  BlockPreset,
  ColorSchemeSettings,
  GlobalSettingsData,
  SectionInstance,
  TemplateData,
  ThemeDefinition,
} from '#themes'
import { getTheme } from '#themes'

export interface SelectedItem {
  type: 'section' | 'block' | 'global_settings_category'
  id?: string // sectionId or blockId
  sectionId?: string // parent section ID when type is 'block'
  parentBlockId?: string // direct parent when a block is nested
  category?: string // category name when type is 'global_settings_category'
}

export interface EditorHistorySnapshot {
  template: TemplateData
  globalSettings: GlobalSettingsData
}

export interface EditorPageData {
  uuid?: string
  title: string
  slug: string
  is_active: number | boolean
}

export interface EditorThemeData {
  uuid?: string
  title: string
  isActive: boolean
  isPublished: boolean
}

export interface EditorState {
  themeId: string
  activeTemplateId: string
  tenantTemplateUuid?: string | null
  activePageUuid?: string | null
  themeData: EditorThemeData | null
  activePageData: EditorPageData | null
  templateDrafts: Record<string, TemplateData>
  template: TemplateData
  globalSettings: GlobalSettingsData
  selectedItem: SelectedItem | null
  activeTab: 'sections' | 'settings'
  viewport: 'desktop' | 'mobile'
  isSaving: boolean
  lastSavedAt: string | null
  history: {
    past: Array<EditorHistorySnapshot>
    future: Array<EditorHistorySnapshot>
  }
}

const MAX_HISTORY_LENGTH = 30

const initialTheme = getTheme()
const initialTemplate: TemplateData = initialTheme.normalizeTemplate(
  initialTheme.getTemplate(),
)
const initialSettings: GlobalSettingsData = initialTheme.defaultSettingsData

export const editorStore = new Store<EditorState>({
  themeId: initialTheme.id,
  activeTemplateId: 'index',
  tenantTemplateUuid: null,
  activePageUuid: null,
  themeData: {
    title: initialTheme.name,
    isActive: true,
    isPublished: false,
  },
  activePageData: {
    title: 'Home',
    slug: 'home',
    is_active: 1,
  },
  templateDrafts: {},
  template: initialTemplate,
  globalSettings: initialSettings,
  selectedItem: {
    type: 'section',
    id: initialTemplate.order[0] || 'header_main',
  },
  activeTab: 'sections',
  viewport: 'desktop',
  isSaving: false,
  lastSavedAt: null,
  history: {
    past: [],
    future: [],
  },
})

// ============================================================================
// Helper Functions
// ============================================================================

function pushHistorySnapshot(state: EditorState): {
  past: Array<EditorHistorySnapshot>
  future: Array<EditorHistorySnapshot>
} {
  const currentSnapshot: EditorHistorySnapshot = {
    template: JSON.parse(JSON.stringify(state.template)),
    globalSettings: JSON.parse(JSON.stringify(state.globalSettings)),
  }

  const newPast = [...state.history.past, currentSnapshot]
  if (newPast.length > MAX_HISTORY_LENGTH) {
    newPast.shift()
  }

  return {
    past: newPast,
    future: [],
  }
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`
}

function createBlockFromPreset(preset: BlockPreset): BlockInstance {
  const blockId = generateId(preset.type)
  const childBlocks: Record<string, BlockInstance> = {}
  const childOrder: Array<string> = []

  for (const childPreset of preset.blocks || []) {
    const child = createBlockFromPreset(childPreset)
    const childId = child.id!
    childBlocks[childId] = child
    childOrder.push(childId)
  }

  return {
    id: blockId,
    type: preset.type,
    settings: preset.settings || {},
    ...(childOrder.length > 0
      ? { blocks: childBlocks, block_order: childOrder }
      : {}),
  }
}

// ============================================================================
// Store Actions
// ============================================================================

export const editorActions = {
  /** Load a registered theme into a fresh editor session. */
  setTheme(themeId: string) {
    const nextTheme = getTheme(themeId)
    editorStore.setState((state) => {
      if (state.themeId === nextTheme.id) return state

      const template = nextTheme.normalizeTemplate(nextTheme.getTemplate())
      return {
        ...state,
        themeId: nextTheme.id,
        activeTemplateId: 'index',
        templateDrafts: {},
        template,
        globalSettings: structuredClone(nextTheme.defaultSettingsData),
        selectedItem: template.order[0]
          ? { type: 'section', id: template.order[0] }
          : null,
        lastSavedAt: null,
        history: { past: [], future: [] },
      }
    })
  },

  /** Select an item (section, block, or global settings category) in the inspector */
  selectItem(item: SelectedItem | null) {
    editorStore.setState((state) => ({
      ...state,
      selectedItem: item,
    }))
  },

  /** Switch between 'sections' and 'settings' tabs */
  setActiveTab(tab: 'sections' | 'settings') {
    editorStore.setState((state) => {
      let nextSelectedItem = state.selectedItem
      if (
        tab === 'settings' &&
        (!nextSelectedItem ||
          nextSelectedItem.type !== 'global_settings_category')
      ) {
        nextSelectedItem = {
          type: 'global_settings_category',
          category: 'Colors',
        }
      } else if (
        tab === 'sections' &&
        nextSelectedItem?.type === 'global_settings_category'
      ) {
        const firstSectionId = state.template.order[0]
        nextSelectedItem = firstSectionId
          ? { type: 'section', id: firstSectionId }
          : null
      }

      return {
        ...state,
        activeTab: tab,
        selectedItem: nextSelectedItem,
      }
    })
  },

  /** Switch viewport between 'desktop' and 'mobile' */
  setViewport(viewport: 'desktop' | 'mobile') {
    editorStore.setState((state) => ({
      ...state,
      viewport,
    }))
  },

  switchTemplate(templateId: string) {
    editorStore.setState((state) => {
      const activeTheme = getTheme(state.themeId)
      if (!Object.hasOwn(activeTheme.templateCatalog, templateId)) return state
      if (state.activeTemplateId === templateId) return state
      const template =
        state.templateDrafts[templateId] ??
        activeTheme.normalizeTemplate(activeTheme.getTemplate(templateId))
      return {
        ...state,
        activeTemplateId: templateId,
        templateDrafts: {
          ...state.templateDrafts,
          [state.activeTemplateId]: state.template,
        },
        template,
        selectedItem: null,
        lastSavedAt: null,
        history: { past: [], future: [] },
      }
    })
  },

  /** Update entire template data */
  setTemplate(template: TemplateData) {
    editorStore.setState((state) => ({
      ...state,
      history: pushHistorySnapshot(state),
      template: getTheme(state.themeId).normalizeTemplate(template),
    }))
  },

  /** Update specific section settings */
  updateSectionSettings(sectionId: string, settings: Record<string, any>) {
    editorStore.setState((state) => {
      const currentSection = state.template.sections[sectionId]

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          sections: {
            ...state.template.sections,
            [sectionId]: {
              ...currentSection,
              settings: {
                ...currentSection.settings,
                ...settings,
              },
            },
          },
        },
      }
    })
  },

  /** Update specific block settings */
  updateBlockSettings(
    sectionId: string,
    blockId: string,
    settings: Record<string, any>,
  ) {
    editorStore.setState((state) => {
      const currentSection = state.template.sections[sectionId]
      const currentBlock = findBlockLocation(
        currentSection.blocks,
        blockId,
      )?.block
      if (!currentBlock) return state

      const blocks = updateBlockInTree(
        currentSection.blocks,
        blockId,
        (block) => ({
          ...block,
          settings: {
            ...block.settings,
            ...settings,
          },
        }),
      )

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          sections: {
            ...state.template.sections,
            [sectionId]: {
              ...currentSection,
              blocks,
            },
          },
        },
      }
    })
  },

  /** Add a new section from a schema or preset */
  addSection(
    sectionType: string,
    presetSettings: Record<string, any> = {},
    presetBlocks?: Array<BlockPreset>,
    atIndex?: number,
  ) {
    const newSectionId = generateId(sectionType)
    const blocksMap: Record<string, BlockInstance> = {}
    const blockOrder: Array<string> = []

    if (presetBlocks && presetBlocks.length > 0) {
      presetBlocks.forEach((preset) => {
        const block = createBlockFromPreset(preset)
        const blockId = block.id!
        blockOrder.push(blockId)
        blocksMap[blockId] = block
      })
    }

    const newSection: SectionInstance = {
      id: newSectionId,
      type: sectionType,
      settings: presetSettings,
      block_order: blockOrder,
      blocks: blocksMap,
    }

    editorStore.setState((state) => {
      const newOrder = [...state.template.order]
      if (
        typeof atIndex === 'number' &&
        atIndex >= 0 &&
        atIndex <= newOrder.length
      ) {
        newOrder.splice(atIndex, 0, newSectionId)
      } else {
        newOrder.push(newSectionId)
      }

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          sections: {
            ...state.template.sections,
            [newSectionId]: newSection,
          },
          order: newOrder,
        },
        selectedItem: {
          type: 'section',
          id: newSectionId,
        },
      }
    })

    return newSectionId
  },

  /** Remove a section from the template */
  removeSection(sectionId: string) {
    editorStore.setState((state) => {
      const newSections = { ...state.template.sections }
      delete newSections[sectionId]
      const newOrder = state.template.order.filter((id) => id !== sectionId)

      let nextSelectedItem = state.selectedItem
      if (
        nextSelectedItem?.type === 'section' &&
        nextSelectedItem.id === sectionId
      ) {
        nextSelectedItem =
          newOrder.length > 0 ? { type: 'section', id: newOrder[0] } : null
      } else if (
        nextSelectedItem?.type === 'block' &&
        nextSelectedItem.sectionId === sectionId
      ) {
        nextSelectedItem =
          newOrder.length > 0 ? { type: 'section', id: newOrder[0] } : null
      }

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          sections: newSections,
          order: newOrder,
        },
        selectedItem: nextSelectedItem,
      }
    })
  },

  /** Reorder entire sections array */
  reorderSections(newOrder: Array<string>) {
    editorStore.setState((state) => ({
      ...state,
      history: pushHistorySnapshot(state),
      template: {
        ...state.template,
        order: newOrder,
      },
    }))
  },

  /** Move a section up or down in the order list */
  moveSection(sectionId: string, direction: 'up' | 'down') {
    editorStore.setState((state) => {
      const order = [...state.template.order]
      const currentIndex = order.indexOf(sectionId)
      if (currentIndex === -1) return state

      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (targetIndex < 0 || targetIndex >= order.length) return state

      const [removed] = order.splice(currentIndex, 1)
      order.splice(targetIndex, 0, removed)

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          order,
        },
      }
    })
  },

  /** Duplicate a section and all of its child blocks directly after the source */
  duplicateSection(sectionId: string) {
    let newSectionId = ''

    editorStore.setState((state) => {
      const sourceSection = state.template.sections[sectionId]
      const sourceIndex = state.template.order.indexOf(sectionId)
      if (sourceIndex === -1) return state

      newSectionId = generateId(sourceSection.type)
      const duplicatedBlocks: Record<string, BlockInstance> = {}
      const duplicatedBlockOrder = (sourceSection.block_order || []).flatMap(
        (sourceBlockId) => {
          const sourceBlock = sourceSection.blocks?.[sourceBlockId]
          if (!sourceBlock) return []

          const newBlockId = generateId(sourceBlock.type)
          duplicatedBlocks[newBlockId] = {
            ...sourceBlock,
            id: newBlockId,
            settings: structuredClone(sourceBlock.settings),
          }
          return [newBlockId]
        },
      )

      const duplicatedSection: SectionInstance = {
        ...sourceSection,
        id: newSectionId,
        settings: structuredClone(sourceSection.settings),
        blocks: duplicatedBlocks,
        block_order: duplicatedBlockOrder,
      }
      const order = [...state.template.order]
      order.splice(sourceIndex + 1, 0, newSectionId)

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          sections: {
            ...state.template.sections,
            [newSectionId]: duplicatedSection,
          },
          order,
        },
        selectedItem: { type: 'section', id: newSectionId },
      }
    })

    return newSectionId
  },

  /** Add a child block to a section */
  addBlock(
    sectionId: string,
    blockType: string,
    presetSettings: Record<string, any> = {},
    parentBlockId?: string,
  ) {
    const newBlockId = generateId(blockType)
    const newBlock: BlockInstance = {
      id: newBlockId,
      type: blockType,
      settings: presetSettings,
    }

    editorStore.setState((state) => {
      const currentSection = state.template.sections[sectionId]
      const updatedBlocks = parentBlockId
        ? updateBlockInTree(currentSection.blocks, parentBlockId, (parent) => ({
            ...parent,
            blocks: {
              ...(parent.blocks || {}),
              [newBlockId]: newBlock,
            },
            block_order: [...(parent.block_order || []), newBlockId],
          }))
        : {
            ...(currentSection.blocks || {}),
            [newBlockId]: newBlock,
          }
      const updatedBlockOrder = parentBlockId
        ? currentSection.block_order
        : [...(currentSection.block_order || []), newBlockId]

      if (parentBlockId && updatedBlocks === currentSection.blocks) return state

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          sections: {
            ...state.template.sections,
            [sectionId]: {
              ...currentSection,
              blocks: updatedBlocks,
              block_order: updatedBlockOrder,
            },
          },
        },
        selectedItem: {
          type: 'block',
          id: newBlockId,
          sectionId,
          ...(parentBlockId ? { parentBlockId } : {}),
        },
      }
    })

    return newBlockId
  },

  /** Duplicate a child block directly after the source block */
  duplicateBlock(sectionId: string, blockId: string) {
    let newBlockId = ''

    editorStore.setState((state) => {
      const currentSection = state.template.sections[sectionId]
      const sourceBlock = currentSection.blocks?.[blockId]
      const sourceIndex = currentSection.block_order?.indexOf(blockId) ?? -1
      if (!sourceBlock || sourceIndex === -1) return state

      newBlockId = generateId(sourceBlock.type)
      const blockOrder = [...(currentSection.block_order || [])]
      blockOrder.splice(sourceIndex + 1, 0, newBlockId)

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          sections: {
            ...state.template.sections,
            [sectionId]: {
              ...currentSection,
              blocks: {
                ...currentSection.blocks,
                [newBlockId]: {
                  ...sourceBlock,
                  id: newBlockId,
                  settings: structuredClone(sourceBlock.settings),
                },
              },
              block_order: blockOrder,
            },
          },
        },
        selectedItem: {
          type: 'block',
          id: newBlockId,
          sectionId,
        },
      }
    })

    return newBlockId
  },

  /** Remove a child block from a section */
  removeBlock(sectionId: string, blockId: string) {
    editorStore.setState((state) => {
      const currentSection = state.template.sections[sectionId]
      const location = findBlockLocation(currentSection.blocks, blockId)
      if (!location) return state

      const removedIds = new Set([
        blockId,
        ...getDescendantBlockIds(location.block),
      ])
      const updatedSection = removeBlockFromCollection(currentSection, blockId)

      let nextSelectedItem = state.selectedItem
      if (
        nextSelectedItem?.type === 'block' &&
        nextSelectedItem.id &&
        removedIds.has(nextSelectedItem.id)
      ) {
        const parentLocation = location.parentBlockId
          ? findBlockLocation(currentSection.blocks, location.parentBlockId)
          : undefined
        nextSelectedItem = location.parentBlockId
          ? {
              type: 'block',
              id: location.parentBlockId,
              sectionId,
              ...(parentLocation?.parentBlockId
                ? { parentBlockId: parentLocation.parentBlockId }
                : {}),
            }
          : {
              type: 'section',
              id: sectionId,
            }
      }

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          sections: {
            ...state.template.sections,
            [sectionId]: {
              ...currentSection,
              ...updatedSection,
            },
          },
        },
        selectedItem: nextSelectedItem,
      }
    })
  },

  /** Move a child block up or down */
  moveBlock(sectionId: string, blockId: string, direction: 'up' | 'down') {
    editorStore.setState((state) => {
      const currentSection = state.template.sections[sectionId]
      if (!currentSection.block_order) return state

      const blockOrder = [...currentSection.block_order]
      const currentIndex = blockOrder.indexOf(blockId)
      if (currentIndex === -1) return state

      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (targetIndex < 0 || targetIndex >= blockOrder.length) return state

      const [removed] = blockOrder.splice(currentIndex, 1)
      blockOrder.splice(targetIndex, 0, removed)

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          sections: {
            ...state.template.sections,
            [sectionId]: {
              ...currentSection,
              block_order: blockOrder,
            },
          },
        },
      }
    })
  },

  /** Reorder the direct children of a section or container block. */
  reorderBlocks(
    sectionId: string,
    newOrder: Array<string>,
    parentBlockId?: string,
  ) {
    editorStore.setState((state) => {
      const currentSection = state.template.sections[sectionId]
      const blocks = parentBlockId
        ? updateBlockInTree(currentSection.blocks, parentBlockId, (parent) => ({
            ...parent,
            block_order: newOrder,
          }))
        : currentSection.blocks

      if (parentBlockId && blocks === currentSection.blocks) return state

      return {
        ...state,
        history: pushHistorySnapshot(state),
        template: {
          ...state.template,
          sections: {
            ...state.template.sections,
            [sectionId]: {
              ...currentSection,
              blocks,
              block_order: parentBlockId
                ? currentSection.block_order
                : newOrder,
            },
          },
        },
      }
    })
  },

  /** Update a single global theme setting token */
  updateGlobalSetting(key: string, value: any) {
    editorStore.setState((state) => ({
      ...state,
      history: pushHistorySnapshot(state),
      globalSettings: {
        ...state.globalSettings,
        current: {
          ...state.globalSettings.current,
          [key]: value,
        },
      },
    }))
  },

  /** Update multiple global theme settings */
  updateGlobalCategorySettings(settings: Record<string, any>) {
    editorStore.setState((state) => ({
      ...state,
      history: pushHistorySnapshot(state),
      globalSettings: {
        ...state.globalSettings,
        current: {
          ...state.globalSettings.current,
          ...settings,
        },
      },
    }))
  },

  /** Update specific color scheme settings (Shopify color_schemes) */
  updateColorScheme(schemeId: string, settings: Partial<ColorSchemeSettings>) {
    editorStore.setState((state) => {
      const existingSchemes = state.globalSettings.current.color_schemes || {}
      const existingScheme = existingSchemes[schemeId]

      const updatedSchemes = {
        ...existingSchemes,
        [schemeId]: {
          ...existingScheme,
          settings: {
            ...existingScheme.settings,
            ...settings,
          },
        },
      }

      return {
        ...state,
        history: pushHistorySnapshot(state),
        globalSettings: {
          ...state.globalSettings,
          current: {
            ...state.globalSettings.current,
            color_schemes: updatedSchemes,
          },
        },
      }
    })
  },

  /** Add a new color scheme to the theme */
  addColorScheme(initialSettings?: Partial<ColorSchemeSettings>): string {
    let newSchemeId = ''
    editorStore.setState((state) => {
      const existingSchemes = state.globalSettings.current.color_schemes || {}
      const existingCount = Object.keys(existingSchemes).length
      newSchemeId = `scheme-${existingCount + 1}`
      // if (existingSchemes[newSchemeId]) {
      //   newSchemeId = `scheme-${Date.now().toString(36)}`
      // }

      const defaultSchemeSettings: ColorSchemeSettings = {
        background: '#FFFFFF',
        background_gradient: '',
        text: '#121212',
        button: '#121212',
        button_label: '#FFFFFF',
        secondary_button_label: '#121212',
        shadow: '#121212',
        ...initialSettings,
      }

      const updatedSchemes = {
        ...existingSchemes,
        [newSchemeId]: {
          id: newSchemeId,
          settings: defaultSchemeSettings,
        },
      }

      return {
        ...state,
        history: pushHistorySnapshot(state),
        globalSettings: {
          ...state.globalSettings,
          current: {
            ...state.globalSettings.current,
            color_schemes: updatedSchemes,
          },
        },
      }
    })
    return newSchemeId
  },

  /** Duplicate an existing color scheme */
  duplicateColorScheme(schemeId: string): string {
    let newSchemeId = ''
    editorStore.setState((state) => {
      const existingSchemes = state.globalSettings.current.color_schemes || {}
      const source = existingSchemes[schemeId]

      const existingCount = Object.keys(existingSchemes).length
      newSchemeId = `scheme-${existingCount + 1}`
      // if (existingSchemes[newSchemeId]) {
      //   newSchemeId = `scheme-${Date.now().toString(36)}`
      // }

      const updatedSchemes = {
        ...existingSchemes,
        [newSchemeId]: {
          id: newSchemeId,
          settings: { ...source.settings },
        },
      }

      return {
        ...state,
        history: pushHistorySnapshot(state),
        globalSettings: {
          ...state.globalSettings,
          current: {
            ...state.globalSettings.current,
            color_schemes: updatedSchemes,
          },
        },
      }
    })
    return newSchemeId
  },

  /** Remove a color scheme */
  removeColorScheme(schemeId: string) {
    editorStore.setState((state) => {
      const existingSchemes = state.globalSettings.current.color_schemes || {}
      const keys = Object.keys(existingSchemes)
      if (keys.length <= 1) return state

      const updatedSchemes = { ...existingSchemes }
      delete updatedSchemes[schemeId]

      return {
        ...state,
        history: pushHistorySnapshot(state),
        globalSettings: {
          ...state.globalSettings,
          current: {
            ...state.globalSettings.current,
            color_schemes: updatedSchemes,
          },
        },
      }
    })
  },

  /** Undo last change */
  undo() {
    editorStore.setState((state) => {
      if (state.history.past.length === 0) return state

      const newPast = [...state.history.past]
      const previousSnapshot = newPast.pop()!

      const currentSnapshot: EditorHistorySnapshot = {
        template: JSON.parse(JSON.stringify(state.template)),
        globalSettings: JSON.parse(JSON.stringify(state.globalSettings)),
      }

      return {
        ...state,
        template: previousSnapshot.template,
        globalSettings: previousSnapshot.globalSettings,
        history: {
          past: newPast,
          future: [currentSnapshot, ...state.history.future],
        },
      }
    })
  },

  /** Redo previously undone change */
  redo() {
    editorStore.setState((state) => {
      if (state.history.future.length === 0) return state

      const newFuture = [...state.history.future]
      const nextSnapshot = newFuture.shift()!

      const currentSnapshot: EditorHistorySnapshot = {
        template: JSON.parse(JSON.stringify(state.template)),
        globalSettings: JSON.parse(JSON.stringify(state.globalSettings)),
      }

      return {
        ...state,
        template: nextSnapshot.template,
        globalSettings: nextSnapshot.globalSettings,
        history: {
          past: [...state.history.past, currentSnapshot],
          future: newFuture,
        },
      }
    })
  },

  /** Set theme metadata (title, active/published status) */
  setThemeData(data: Partial<EditorThemeData>) {
    editorStore.setState((state) => ({
      ...state,
      themeData: state.themeData
        ? { ...state.themeData, ...data }
        : {
            title: data.title ?? getTheme(state.themeId).name,
            isActive: data.isActive ?? true,
            isPublished: data.isPublished ?? false,
            uuid: data.uuid,
            ...data,
          },
    }))
  },

  /** Set active page metadata (title, slug, active status) */
  setActivePageData(data: Partial<EditorPageData>) {
    editorStore.setState((state) => ({
      ...state,
      activePageData: state.activePageData
        ? { ...state.activePageData, ...data }
        : {
            title: data.title ?? 'Home',
            slug: data.slug ?? 'home',
            is_active: data.is_active ?? 1,
            uuid: data.uuid,
            ...data,
          },
    }))
  },

  /** Set backend tenant template and active page context */
  setBackendContext(
    tenantTemplateUuid?: string | null,
    pageUuid?: string | null,
    pageData?: EditorPageData | null,
    themeData?: EditorThemeData | null,
  ) {
    editorStore.setState((state) => ({
      ...state,
      tenantTemplateUuid:
        tenantTemplateUuid !== undefined
          ? tenantTemplateUuid
          : state.tenantTemplateUuid,
      activePageUuid: pageUuid !== undefined ? pageUuid : state.activePageUuid,
      activePageData: pageData !== undefined ? pageData : state.activePageData,
      themeData: themeData !== undefined ? themeData : state.themeData,
    }))
  },

  /** Hydrate editor template and settings from backend */
  hydrateFromBackend(
    templateData: TemplateData,
    globalSettings?: GlobalSettingsData | null,
    pageUuid?: string | null,
    pageData?: EditorPageData | null,
    themeData?: EditorThemeData | null,
  ) {
    editorStore.setState((state) => ({
      ...state,
      template: templateData,
      globalSettings: globalSettings ?? state.globalSettings,
      activePageUuid: pageUuid !== undefined ? pageUuid : state.activePageUuid,
      activePageData: pageData !== undefined ? pageData : state.activePageData,
      themeData: themeData !== undefined ? themeData : state.themeData,
      history: {
        past: [],
        future: [],
      },
    }))
  },

  /** Save template and global settings to backend if context exists */
  async save() {
    editorStore.setState((state) => ({ ...state, isSaving: true }))
    const state = editorStore.state

    try {
      if (state.activePageUuid) {
        await fetchHelper('/api/v1/dashboard/cms/tenant-template-page/update', {
          method: 'PATCH',
          body: {
            tenant_template_page_uuid: state.activePageUuid,
            template_data: state.template,
            ...(state.activePageData
              ? {
                  title: state.activePageData.title,
                  slug: state.activePageData.slug,
                  is_active: Number(state.activePageData.is_active),
                }
              : {}),
          },
        })
      }

      if (state.tenantTemplateUuid) {
        await fetchHelper('/api/v1/dashboard/cms/tenant-template/update', {
          method: 'PATCH',
          body: {
            tenant_template_uuid: state.tenantTemplateUuid,
            template_settings: {
              ...state.globalSettings,
              theme_title:
                state.themeData?.title || getTheme(state.themeId).name,
              theme_id: state.themeId,
            },
            ...(state.themeData
              ? {
                  active_template: state.themeData.isPublished,
                  is_active: state.themeData.isActive ? 1 : 0,
                }
              : {}),
          },
        })
      }
    } catch (err) {
      console.warn(
        'Backend save encountered an error, keeping visual state:',
        err,
      )
    }

    editorStore.setState((state) => ({
      ...state,
      isSaving: false,
      lastSavedAt: new Date().toLocaleTimeString(),
    }))
  },

  /** Reset state to default JSON configurations */
  resetToDefault() {
    editorStore.setState((state) => {
      const activeTheme = getTheme(state.themeId)
      const template = activeTheme.normalizeTemplate(
        activeTheme.getTemplate(state.activeTemplateId),
      )
      return {
        ...state,
        history: pushHistorySnapshot(state),
        template,
        globalSettings: structuredClone(activeTheme.defaultSettingsData),
        selectedItem: template.order[0]
          ? { type: 'section', id: template.order[0] }
          : null,
      }
    })
  },
}

// ============================================================================
// Custom Reactive React Hooks
// ============================================================================

export function useEditorStore<T>(selector: (state: EditorState) => T): T {
  return useSelector(editorStore, selector)
}

export function useEditorTemplate(): TemplateData {
  return useSelector(editorStore, (s) => s.template)
}

export function useEditorTheme(): ThemeDefinition {
  const themeId = useSelector(editorStore, (s) => s.themeId)
  return getTheme(themeId)
}

export function useEditorGlobalSettings(): GlobalSettingsData {
  return useSelector(editorStore, (s) => s.globalSettings)
}

export function useEditorSelectedItem(): SelectedItem | null {
  return useSelector(editorStore, (s) => s.selectedItem)
}

export function useEditorViewport(): 'desktop' | 'mobile' {
  return useSelector(editorStore, (s) => s.viewport)
}

export function useEditorActiveTab(): 'sections' | 'settings' {
  return useSelector(editorStore, (s) => s.activeTab)
}

export function useEditorCanUndoRedo(): {
  canUndo: boolean
  canRedo: boolean
  isSaving: boolean
  lastSavedAt: string | null
} {
  return useSelector(editorStore, (s) => ({
    canUndo: s.history.past.length > 0,
    canRedo: s.history.future.length > 0,
    isSaving: s.isSaving,
    lastSavedAt: s.lastSavedAt,
  }))
}

export function useEditorThemeData(): EditorThemeData | null {
  return useSelector(editorStore, (s) => s.themeData)
}

export function useEditorPageData(): EditorPageData | null {
  return useSelector(editorStore, (s) => s.activePageData)
}
