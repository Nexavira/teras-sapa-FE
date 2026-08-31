import styled from '@emotion/styled'

import { Button } from '#/components/ui'

export const AddSectionButton = styled(Button)`
  width: 100%;
  margin-top: 6px;
`

export const AddBlockButton = styled(Button)`
  width: calc(100% - 32px);
  margin: 3px 0 4px 32px;
  justify-content: flex-start;
`

export const SortableEntry = styled.div<{ $isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
`

export const NestedBlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
