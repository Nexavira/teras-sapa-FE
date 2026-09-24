import { createContext, useContext } from 'react'

import type { RegisteredBlock } from './types/theme'

export interface ThemeEditorBlockSelection {
  type: 'block'
  id: string
  sectionId: string
  parentBlockId?: string
}

export interface ThemeEditorContextValue {
  selectedItem: {
    type: string
    id?: string
    sectionId?: string
    parentBlockId?: string
  } | null
  selectBlock: (selection: ThemeEditorBlockSelection) => void
  blockRegistry?: Record<string, RegisteredBlock>
}

const ThemeEditorContext = createContext<ThemeEditorContextValue | null>(null)

export const ThemeEditorProvider = ThemeEditorContext.Provider

export function useThemeEditor(): ThemeEditorContextValue | null {
  return useContext(ThemeEditorContext)
}
