import { useSelector } from '@tanstack/react-store'
import { Store } from '@tanstack/store'

import defaultSettingsData from '#themes/config/settings_data.json'
import defaultTemplateData from '#themes/templates/index.json'
import type {
  BlockInstance,
  ColorSchemeSettings,
  GlobalSettingsData,
  SectionInstance,
  TemplateData,
} from '#themes/types/theme'

export interface SelectedItem {
  type: 'section' | 'block' | 'global_settings_category'
  id?: string // sectionId or blockId
  sectionId?: string // parent section ID when type is 'block'
  category?: string // category name when type is 'global_settings_category'
}

export interface EditorHistorySnapshot {
  template: TemplateData
  globalSettings: GlobalSettingsData
}

export interface EditorState {
  template: TemplateData
  globalSettings: GlobalSettingsData
  selectedItem: SelectedItem | null
  activeTab: 'sections' | 'settings'
  viewport: 'desktop' | 'mobile'
  isSaving: boolean
  lastSavedAt: string | null
  history: {
    past: EditorHistorySnapshot[]
    future: EditorHistorySnapshot[]
  }
}

const MAX_HISTORY_LENGTH = 30

const initialTemplate: TemplateData = defaultTemplateData
const initialSettings: GlobalSettingsData = defaultSettingsData

export const editorStore = new Store<EditorState>({
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
  past: EditorHistorySnapshot[]
  future: EditorHistorySnapshot[]
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

// ============================================================================
// Store Actions
// ============================================================================

export const editorActions = {
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

  /** Update entire template data */
  setTemplate(template: TemplateData) {
    editorStore.setState((state) => ({
      ...state,
      history: pushHistorySnapshot(state),
      template,
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
      if (!currentSection.blocks?.[blockId]) return state

      const currentBlock = currentSection.blocks[blockId]

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
                [blockId]: {
                  ...currentBlock,
                  settings: {
                    ...currentBlock.settings,
                    ...settings,
                  },
                },
              },
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
    presetBlocks?: Array<{ type: string; settings?: Record<string, any> }>,
    atIndex?: number,
  ) {
    const newSectionId = generateId(sectionType)
    const blocksMap: Record<string, BlockInstance> = {}
    const blockOrder: string[] = []

    if (presetBlocks && presetBlocks.length > 0) {
      presetBlocks.forEach((b) => {
        const bId = generateId(b.type)
        blockOrder.push(bId)
        blocksMap[bId] = {
          id: bId,
          type: b.type,
          settings: b.settings || {},
        }
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
  reorderSections(newOrder: string[]) {
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

  /** Add a child block to a section */
  addBlock(
    sectionId: string,
    blockType: string,
    presetSettings: Record<string, any> = {},
  ) {
    const newBlockId = generateId(blockType)
    const newBlock: BlockInstance = {
      id: newBlockId,
      type: blockType,
      settings: presetSettings,
    }

    editorStore.setState((state) => {
      const currentSection = state.template.sections[sectionId]

      const updatedBlocks = {
        ...(currentSection.blocks || {}),
        [newBlockId]: newBlock,
      }
      const updatedBlockOrder = [
        ...(currentSection.block_order || []),
        newBlockId,
      ]

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
        },
      }
    })

    return newBlockId
  },

  /** Remove a child block from a section */
  removeBlock(sectionId: string, blockId: string) {
    editorStore.setState((state) => {
      const currentSection = state.template.sections[sectionId]
      if (!currentSection.blocks?.[blockId]) return state

      const newBlocks = { ...currentSection.blocks }
      delete newBlocks[blockId]
      const newBlockOrder = (currentSection.block_order || []).filter(
        (id) => id !== blockId,
      )

      let nextSelectedItem = state.selectedItem
      if (
        nextSelectedItem?.type === 'block' &&
        nextSelectedItem.id === blockId
      ) {
        nextSelectedItem = {
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
              blocks: newBlocks,
              block_order: newBlockOrder,
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

  /** Save template (hardcoded mock save with visual state) */
  async save() {
    editorStore.setState((state) => ({ ...state, isSaving: true }))

    console.log('saving data...', JSON.stringify(editorStore.get(), null, 2))

    // Simulate brief API delay
    await new Promise((resolve) => setTimeout(resolve, 600))
    editorStore.setState((state) => ({
      ...state,
      isSaving: false,
      lastSavedAt: new Date().toLocaleTimeString(),
    }))
  },

  /** Reset state to default JSON configurations */
  resetToDefault() {
    editorStore.setState((state) => ({
      ...state,
      history: pushHistorySnapshot(state),
      template: JSON.parse(JSON.stringify(initialTemplate)),
      globalSettings: JSON.parse(JSON.stringify(initialSettings)),
      selectedItem: {
        type: 'section',
        id: initialTemplate.order[0] || 'header_main',
      },
    }))
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
