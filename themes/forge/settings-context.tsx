import { createContext, useContext } from 'react'

import type { GlobalSettingsData } from '#themes/shared/types/theme'

const ForgeSettingsContext = createContext<GlobalSettingsData['current']>({})

export const ForgeSettingsProvider = ForgeSettingsContext.Provider

export function useForgeSettings(): GlobalSettingsData['current'] {
  return useContext(ForgeSettingsContext)
}
