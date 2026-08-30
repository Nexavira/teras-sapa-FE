/**
 * ============================================================================
 * Teras Sapa Theme Engine — Global Type Definitions
 * ============================================================================
 * Strict TypeScript types for Sections, Blocks, Settings, Schemas, Templates,
 * and the Theme Customizer Inspector.
 */

import type { ReactNode } from 'react'

// ============================================================================
// 1. Setting Types Taxonomy
// ============================================================================

export type SettingType =
  // Tier 1: Primitives & Basic Controls
  | 'text'
  | 'textarea'
  | 'number'
  | 'range'
  | 'checkbox'
  | 'switch'
  | 'select'
  | 'radio'
  | 'button_group'
  // Tier 2: Rich Media & Assets
  | 'image_picker'
  | 'video'
  | 'video_url'
  | 'icon_picker'
  | 'file_picker'
  // Tier 3: Rich Content & Typography
  | 'inline_richtext'
  | 'richtext'
  | 'html'
  | 'liquid'
  // Tier 4: Design System & Styling
  | 'color'
  | 'color_scheme'
  | 'color_scheme_group'
  | 'color_background'
  | 'font_picker'
  | 'spacing'
  | 'alignment'
  | 'aspect_ratio'
  | 'border_radius'
  | 'shadow'
  // Tier 5: Headless Commerce & Dynamic Pickers
  | 'product'
  | 'product_list'
  | 'collection'
  | 'collection_list'
  | 'page'
  | 'article'
  | 'blog'
  | 'menu'
  | 'url'
  | 'data_binding'
  // Tier 6: UI Organization & Repeater
  | 'header'
  | 'paragraph'
  | 'divider'
  | 'group'
  | 'tabs'
  | 'repeater'

// ============================================================================
// 2. Rich Value & Complex Setting Data Types
// ============================================================================

/** Image object value produced by image_picker */
export interface ImageValue {
  id?: string
  url: string
  altText?: string
  width?: number
  height?: number
  focalPoint?: {
    x: number
    y: number
  }
}

/** Direct video object value produced by video picker */
export interface VideoValue {
  id?: string
  url: string
  posterUrl?: string
  duration?: number
}

/** Video URL embed value produced by video_url */
export interface VideoUrlValue {
  url: string
  provider?: 'youtube' | 'vimeo' | 'custom'
  id?: string
}

/** File object value produced by file_picker */
export interface FileValue {
  id?: string
  url: string
  filename?: string
  sizeBytes?: number
}

/** Typography object value produced by font_picker */
export interface FontValue {
  family: string
  weight?: number
  style?: 'normal' | 'italic'
}

/** 4-side spacing box model value produced by spacing */
export interface SpacingValue {
  top: number
  right: number
  bottom: number
  left: number
  unit?: string
}

/** Link / Omnibox URL object value produced by url */
export interface UrlValue {
  url: string
  target?: '_self' | '_blank'
  title?: string
}

/** Responsive wrapper for settings with responsive: true */
export interface ResponsiveValue<T = any> {
  desktop: T
  tablet?: T
  mobile?: T
}

// ============================================================================
// 3. Conditional Visibility Engine Types
// ============================================================================

export type ConditionOperator =
  '==' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'contains'

export interface SimpleCondition {
  setting: string
  operator: ConditionOperator
  value: any
}

export interface CompoundCondition {
  operator: 'and' | 'or'
  conditions: (SimpleCondition | CompoundCondition)[]
}

export type VisibilityRule = SimpleCondition | CompoundCondition

// ============================================================================
// 4. Setting Option & Tab Definitions
// ============================================================================

export interface SettingOption<T = string | number> {
  label: string
  value: T
  icon?: string
  group?: string
}

export interface SettingTabDefinition {
  label: string
  id?: string
  settings: SettingDefinition[]
}

// ============================================================================
// 5. Setting Definition (Form Controls for Sidebar Inspector)
// ============================================================================

export interface SettingDefinition {
  /** Unique setting key within the section or block settings object */
  id: string
  /** The input widget type */
  type: SettingType
  /** User-facing label displayed in the inspector sidebar */
  label?: string
  /** Informational or heading content for header / paragraph types */
  content?: string
  /** Tooltip or helper text rendered beneath the input */
  info?: string
  /** Default fallback value if not specified */
  default?: any
  /** Input placeholder string */
  placeholder?: string

  // Numerical & Range constraints
  min?: number
  max?: number
  step?: number
  unit?: string

  // Selection choices (select, radio, button_group, aspect_ratio)
  options?: SettingOption[]

  // Media constraints (image_picker, video, file_picker)
  allowed_types?: string[]
  accept?: string | string[]

  // Rich text & WYSIWYG options
  allowed_tags?: string[]
  toolbar?: string[]

  // Repeater / Group / Tabs sub-fields
  fields?: SettingDefinition[]
  tabs?: SettingTabDefinition[]
  min_items?: number
  max_items?: number
  item_label?: string
  default_open?: boolean

  // Color Scheme Group Definition (Shopify color_scheme_group)
  name?: string
  definition?: SettingDefinition[]
  role?: Record<string, any>

  // Advanced Customizer Ergonomics
  responsive?: boolean
  visible_if?: VisibilityRule
}

// ============================================================================
// 6. Block Schema & Section Schema Specifications
// ============================================================================

export interface BlockSchema {
  type: string
  name: string
  description?: string
  icon?: string
  limit?: number
  settings: SettingDefinition[]
  /** Supported child blocks when this block acts as a layout container. */
  blocks?: BlockSchema[]
  /** Maximum number of direct child blocks allowed in this block. */
  max_blocks?: number
}

export interface BlockPreset {
  type: string
  settings?: Record<string, any>
  blocks?: BlockPreset[]
}

export interface SectionPreset {
  name: string
  category?: string
  settings?: Record<string, any>
  blocks?: BlockPreset[]
}

export type SectionCategory =
  | 'Header'
  | 'Hero'
  | 'Product'
  | 'Collection'
  | 'Promotional'
  | 'Editorial'
  | 'Layout'
  | 'Footer'
  | 'Custom'

export type SectionHtmlTag =
  'header' | 'footer' | 'section' | 'article' | 'aside' | 'div' | 'nav' | 'main'

export interface SectionSchema {
  /** Unique section type identifier (e.g. 'header', 'hero_banner', 'featured_collection') */
  type: string
  /** Human-readable section name in the Customizer */
  name: string
  /** Category grouping in the 'Add Section' modal */
  category?: SectionCategory
  /** Description shown in inspector or section picker */
  description?: string
  /** Optional icon identifier for the section (e.g. 'lucide:layout-template') */
  icon?: string
  /** Semantic HTML wrapper tag (defaults to 'section') */
  tag?: SectionHtmlTag
  /** Default CSS class attached to the root container */
  class?: string
  /** Maximum number of times this section can appear on a page (e.g. 1 for header/footer) */
  limit?: number
  /** Template whitelist (e.g. { templates: ['product', 'collection'] }) */
  enabled_on?: {
    templates?: string[]
  }
  /** Template blacklist (e.g. { templates: ['password', 'cart'] }) */
  disabled_on?: {
    templates?: string[]
  }
  /** Array of setting controls */
  settings: SettingDefinition[]
  /** Supported child block schemas */
  blocks?: BlockSchema[]
  /** Maximum total child blocks allowed in this section */
  max_blocks?: number
  /** Starter presets for adding this section from the library */
  presets?: SectionPreset[]
}

// ============================================================================
// 7. Active State Instances & Template Persistence Models
// ============================================================================

export interface BlockInstance {
  id?: string
  type: string
  settings: Record<string, any>
  block_order?: string[]
  blocks?: Record<string, BlockInstance>
}

export interface SectionInstance {
  id?: string
  type: string
  settings: Record<string, any>
  block_order?: string[]
  blocks?: Record<string, BlockInstance>
}

export interface TemplateData {
  name?: string
  layout?: string
  sections: Record<string, SectionInstance>
  order: string[]
}

// ============================================================================
// 8. Global Theme Settings Schema & Data Models
// ============================================================================

export interface ColorSchemeSettings {
  background: string
  background_gradient?: string
  text: string
  button: string
  button_label: string
  secondary_button_label: string
  shadow: string
  [key: string]: any
}

export interface ColorSchemeInstance {
  id?: string
  settings: ColorSchemeSettings
}

export type ColorSchemesData = Record<string, ColorSchemeInstance>

export interface GlobalSettingsSchemaCategory {
  name: string
  theme_name?: string
  theme_version?: string
  theme_author?: string
  settings?: SettingDefinition[]
}

export type GlobalSettingsSchema = GlobalSettingsSchemaCategory[]

export interface GlobalSettingsData {
  current: {
    color_schemes?: ColorSchemesData
    [key: string]: any
  }
}

// ============================================================================
// 9. React Component Props Contracts
// ============================================================================

export interface SectionComponentProps<TSettings = Record<string, any>> {
  id: string
  settings: TSettings
  blocks?: Record<string, BlockInstance>
  blockOrder?: string[]
  isEditor?: boolean
}

export interface BlockComponentProps<TSettings = Record<string, any>> {
  id: string
  settings: TSettings
  isEditor?: boolean
  children?: ReactNode
}
