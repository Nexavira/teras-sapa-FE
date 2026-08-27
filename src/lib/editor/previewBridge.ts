import type { GlobalSettingsData, TemplateData } from '#themes/types/theme'

/**
 * ============================================================================
 * Teras Sapa Theme Customizer <-> Preview Iframe Message Protocol
 * ============================================================================
 * Type-safe bidirectional postMessage event contracts between the
 * Theme Editor Shell (Parent) and the Storefront Page Renderer (Iframe Canvas).
 */

export interface PreviewSelectedItem {
  type: 'section' | 'block' | 'global_settings_category'
  id?: string // sectionId or blockId
  sectionId?: string // parent section ID when type is 'block'
  category?: string // category name when type is 'global_settings_category'
}

export const PREVIEW_MESSAGE_TYPES = {
  // Iframe -> Parent
  IFRAME_READY: 'TERAS_SAPA_PREVIEW:READY',
  ITEM_CLICKED: 'TERAS_SAPA_PREVIEW:ITEM_CLICKED',
  ITEM_HOVERED: 'TERAS_SAPA_PREVIEW:ITEM_HOVERED',

  // Parent -> Iframe
  SYNC_STATE: 'TERAS_SAPA_EDITOR:SYNC_STATE',
  SELECT_ITEM: 'TERAS_SAPA_EDITOR:SELECT_ITEM',
  HOVER_ITEM: 'TERAS_SAPA_EDITOR:HOVER_ITEM',
  SCROLL_TO_SECTION: 'TERAS_SAPA_EDITOR:SCROLL_TO_SECTION',
} as const

export type PreviewMessageType =
  (typeof PREVIEW_MESSAGE_TYPES)[keyof typeof PREVIEW_MESSAGE_TYPES]

export interface IframeReadyMessage {
  type: typeof PREVIEW_MESSAGE_TYPES.IFRAME_READY
}

export interface ItemClickedMessage {
  type: typeof PREVIEW_MESSAGE_TYPES.ITEM_CLICKED
  payload: {
    type: 'section' | 'block'
    id: string
    sectionId?: string
  }
}

export interface ItemHoveredMessage {
  type: typeof PREVIEW_MESSAGE_TYPES.ITEM_HOVERED
  payload: {
    type: 'section' | 'block'
    id: string
    sectionId?: string
  } | null
}

export interface SyncStateMessage {
  type: typeof PREVIEW_MESSAGE_TYPES.SYNC_STATE
  payload: {
    template: TemplateData
    globalSettings: GlobalSettingsData
  }
}

export interface SelectItemMessage {
  type: typeof PREVIEW_MESSAGE_TYPES.SELECT_ITEM
  payload: PreviewSelectedItem | null
}

export interface HoverItemMessage {
  type: typeof PREVIEW_MESSAGE_TYPES.HOVER_ITEM
  payload: PreviewSelectedItem | null
}

export interface ScrollToSectionMessage {
  type: typeof PREVIEW_MESSAGE_TYPES.SCROLL_TO_SECTION
  payload: {
    sectionId: string
  }
}

export type EditorToPreviewMessage =
  | SyncStateMessage
  | SelectItemMessage
  | HoverItemMessage
  | ScrollToSectionMessage

export type PreviewToEditorMessage =
  IframeReadyMessage | ItemClickedMessage | ItemHoveredMessage
