import { createContext, useContext } from 'react'

export interface ThemeEditorBlockSelection {
  type: 'block'
  id: string
  sectionId: string
  parentBlockId?: string
}

interface ThemeEditorContextValue {
  selectedItem: {
    type: string
    id?: string
    sectionId?: string
    parentBlockId?: string
  } | null
  selectBlock: (selection: ThemeEditorBlockSelection) => void
}

const ThemeEditorContext = createContext<ThemeEditorContextValue | null>(null)

export const ThemeEditorProvider = ThemeEditorContext.Provider

export function useThemeEditor(): ThemeEditorContextValue | null {
  return useContext(ThemeEditorContext)
}
