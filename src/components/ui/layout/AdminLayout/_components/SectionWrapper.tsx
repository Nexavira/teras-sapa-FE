import type { ReactNode } from 'react'
import { useId, useState } from 'react'

import styled from '@emotion/styled'
import { ArrowDown01Icon } from 'hugeicons-react'

import { Button } from '#/components/ui/primitives/Button'
import { Typography } from '#/components/ui/primitives/Typography'

const Container = styled.section`
  display: flex;
  flex-direction: column;
`

const Label = styled(Typography)`
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-size: 0.6875rem;
`

const ChevronIcon = styled(ArrowDown01Icon)<{ $isOpen: boolean }>`
  flex-shrink: 0;
  width: 0px;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(-90deg)')};
  transition:
    width 0.15s ease,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
`

const Content = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? '1fr' : '0fr')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition:
    grid-template-rows 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.2s ease;
`

const ContentInner = styled.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
  flex-direction: column;
  gap: 3px;
`

export interface SectionWrapperProps {
  label: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  isOpen?: boolean
  onToggle?: (open: boolean) => void
  className?: string
}

export const SectionWrapper = ({
  label,
  children,
  defaultOpen = true,
  isOpen: controlledIsOpen,
  onToggle,
  className,
}: SectionWrapperProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen)
  const contentId = useId()
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const handleToggle = () => {
    const nextOpen = !isOpen
    if (!isControlled) {
      setInternalIsOpen(nextOpen)
    }
    onToggle?.(nextOpen)
  }

  return (
    <Container className={className}>
      <Button
        variant="ghost"
        color="neutral"
        size="sm"
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        data-section-heading
        css={{
          justifyContent: 'space-between',
          width: '100%',
          marginTop: '4px',
          padding: '10px 8px 4px',
          color: 'inherit',
          background: 'transparent',
          borderColor: 'transparent',
          '&:hover:not(:disabled)': { background: 'transparent' },
          '&:hover svg, &:focus-visible svg': { width: '14px' },
        }}
      >
        <Label variant="caption" weight="bold" color="secondary">
          {label}
        </Label>
        <ChevronIcon size={14} $isOpen={isOpen} aria-hidden="true" />
      </Button>

      <Content
        id={contentId}
        $isOpen={isOpen}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <ContentInner>{children}</ContentInner>
      </Content>
    </Container>
  )
}
