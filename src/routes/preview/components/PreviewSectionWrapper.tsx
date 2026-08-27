import React from 'react'

import styled from '@emotion/styled'

import type { SpacingValue } from '#themes/types/theme'

interface SectionWrapperProps {
  id: string
  sectionType: string
  sectionName: string
  isSelected: boolean
  isEditor: boolean
  padding?: SpacingValue
  children: React.ReactNode
  onSelect?: (id: string, blockId?: string) => void
  onHover?: (id: string | null) => void
}

const StyledEditorSectionBox = styled.div<{
  $isSelected: boolean
  $padding?: SpacingValue
}>`
  position: relative;
  transition:
    outline 0.15s ease,
    box-shadow 0.15s ease;
  outline: ${({ $isSelected }) =>
    $isSelected ? '2px solid #2563eb' : '1px dashed transparent'};
  outline-offset: -2px;
  cursor: pointer;

  ${({ $padding }) =>
    $padding
      ? `
    padding-top: ${$padding.top || 0}px;
    padding-right: ${$padding.right || 0}px;
    padding-bottom: ${$padding.bottom || 0}px;
    padding-left: ${$padding.left || 0}px;
  `
      : ''}

  &:hover {
    outline: ${({ $isSelected }) =>
      $isSelected ? '2px solid #2563eb' : '1px dashed #3b82f6'};
    outline-offset: -2px;
  }
`

const SectionBadge = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  top: 6px;
  left: 12px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ $isSelected }) => ($isSelected ? '#2563eb' : '#1e293b')};
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
  transition: opacity 0.15s ease;

  ${StyledEditorSectionBox}:hover & {
    opacity: 1;
  }
`

export const PreviewSectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  sectionType,
  sectionName,
  isSelected,
  isEditor,
  padding,
  children,
  onSelect,
  onHover,
}) => {
  if (!isEditor) {
    if (padding) {
      return (
        <div
          id={`shopify-section-${id}`}
          data-section-id={id}
          data-section-type={sectionType}
          style={{
            paddingTop: `${padding.top || 0}px`,
            paddingRight: `${padding.right || 0}px`,
            paddingBottom: `${padding.bottom || 0}px`,
            paddingLeft: `${padding.left || 0}px`,
          }}
        >
          {children}
        </div>
      )
    }

    return (
      <div
        id={`shopify-section-${id}`}
        data-section-id={id}
        data-section-type={sectionType}
      >
        {children}
      </div>
    )
  }

  const handleClick = (e: React.MouseEvent) => {
    // Prevent links or buttons inside the storefront from triggering real navigation
    e.preventDefault()
    e.stopPropagation()

    // 1. Check if the clicked target (or any ancestor) is a child block
    const target = e.target as HTMLElement
    const blockEl = target.closest('[data-block-id]')

    if (blockEl) {
      const blockId = blockEl.getAttribute('data-block-id')
      const sectionIdFromBlock = blockEl.getAttribute('data-section-id') || id

      if (blockId) {
        onSelect?.(sectionIdFromBlock, blockId)
        return
      }
    }

    // 2. Otherwise select the parent section
    onSelect?.(id)
  }

  return (
    <StyledEditorSectionBox
      id={`shopify-section-${id}`}
      data-section-id={id}
      data-section-type={sectionType}
      $isSelected={isSelected}
      $padding={padding}
      onClickCapture={handleClick}
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <SectionBadge $isSelected={isSelected}>
        <span>🧩</span> {sectionName || sectionType}
      </SectionBadge>
      {children}
    </StyledEditorSectionBox>
  )
}
