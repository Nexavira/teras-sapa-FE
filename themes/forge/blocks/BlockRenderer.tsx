import type { FC } from 'react'

import { BlockRegistry } from '#themes/forge/registry'
import type { BlockRendererProps } from '#themes/shared/components/BlockRenderer'
import { BlockRenderer as SharedBlockRenderer } from '#themes/shared/components/BlockRenderer'

export type { BlockRendererProps }

export const BlockRenderer: FC<BlockRendererProps> = (props) => {
  return <SharedBlockRenderer defaultBlockRegistry={BlockRegistry} {...props} />
}
