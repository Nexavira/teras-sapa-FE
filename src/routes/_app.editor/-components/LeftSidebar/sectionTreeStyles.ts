import styled from '@emotion/styled'

import { Button, theme } from '#/-components/ui'

export const AddSectionButton = styled(Button)`
  width: 100%;
  margin-top: 6px;
`

export const AddBlockButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'level',
})<{ level: number }>`
  width: ${({ level }) => `calc(100% - ${12 + level * 20}px)`};
  margin: ${({ level }) => `3px 0 4px ${12 + level * 20}px`};
  justify-content: flex-start;
`

export const SortableEntry = styled('div', {
  shouldForwardProp: (prop) => prop !== '$isDragging',
})<{ $isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
`

export const NestedBlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const SubNavList = styled('div', {
  shouldForwardProp: (prop) => prop !== '$isOpen',
})<{ $isOpen: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  max-height: ${({ $isOpen }) => ($isOpen ? '2000px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition:
    max-height 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.2s ease,
    padding-top 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0px;
    width: 12px;
    height: calc(100% - 80px);
    box-sizing: border-box;
    border-left: 1px solid ${theme.colors.gray[300]};
    pointer-events: none;
  }
`
