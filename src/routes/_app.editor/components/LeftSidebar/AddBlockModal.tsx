import React from 'react'

import styled from '@emotion/styled'
import { Cancel01Icon, PlusSignIcon } from 'hugeicons-react'

import { Button, Card, IconButton, theme } from '#/components/ui'
import {
  getBlockAvailability,
  getSchemaDefaults,
} from '#/lib/editor/themeSchema'

import { EditorItemIcon } from './EditorItemIcon'
import type {
  BlockInstance,
  BlockSchema,
  SectionInstance,
  SectionSchema,
} from '#themes/types/theme'

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 110;
  display: grid;
  place-items: center;
  padding: 20px;
  background-color: rgba(15, 23, 42, 0.46);
`

const ModalCard = styled(Card)`
  display: flex;
  width: min(480px, 100%);
  max-height: min(640px, 84vh);
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background-color: #ffffff;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.24);
`

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid #e5e7eb;
`

const Title = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 15px;
  font-weight: 700;
`

const Subtitle = styled.p`
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.45;
`

const ModalBody = styled.div`
  display: grid;
  gap: 9px;
  overflow-y: auto;
  padding: 16px 20px 20px;
`

const BlockChoice = styled(Button)`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #111827;
  text-align: left;
  background-color: #ffffff;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background-color 150ms ease;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary.DEFAULT};
    background-color: rgba(255, 90, 95, 0.04);
  }

  &:disabled {
    color: #9ca3af;
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`

const IconBox = styled.span`
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 9px;
  color: ${theme.colors.primary.DEFAULT};
  background-color: rgba(255, 90, 95, 0.09);

  ${BlockChoice}:disabled & {
    color: #9ca3af;
    background-color: #f3f4f6;
  }
`

const BlockName = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 650;
`

const BlockDescription = styled.span`
  display: block;
  margin-top: 3px;
  color: #6b7280;
  font-size: 11px;
  line-height: 1.4;
`

const EmptyState = styled.p`
  margin: 8px 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
`

export interface AddBlockModalProps {
  isOpen: boolean
  onClose: () => void
  onAddBlock: (type: string, settings: Record<string, unknown>) => void
  parent: SectionInstance | BlockInstance
  parentSchema: SectionSchema | BlockSchema
}

export const AddBlockModal: React.FC<AddBlockModalProps> = ({
  isOpen,
  onClose,
  onAddBlock,
  parent,
  parentSchema,
}) => {
  if (!isOpen) return null

  const supportedBlocks = parentSchema.blocks || []
  const currentCount = parent.block_order?.length || 0

  return (
    <ModalOverlay onClick={onClose} role="presentation">
      <ModalCard
        aria-labelledby="add-block-title"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        padding="none"
        role="dialog"
      >
        <ModalHeader>
          <div>
            <Title id="add-block-title">Add block</Title>
            <Subtitle>
              {parentSchema.name} · {currentCount}
              {typeof parentSchema.max_blocks === 'number'
                ? ` of ${parentSchema.max_blocks}`
                : ''}{' '}
              blocks used
            </Subtitle>
          </div>
          <IconButton
            aria-label="Close block picker"
            onClick={onClose}
            size="sm"
            type="button"
          >
            <Cancel01Icon size={18} />
          </IconButton>
        </ModalHeader>

        <ModalBody>
          {supportedBlocks.length === 0 ? (
            <EmptyState>This section does not support child blocks.</EmptyState>
          ) : (
            supportedBlocks.map((blockSchema) => {
              const availability = getBlockAvailability(
                parent,
                parentSchema,
                blockSchema,
              )

              return (
                <BlockChoice
                  color="neutral"
                  key={blockSchema.type}
                  disabled={!availability.canAdd}
                  endIcon={<PlusSignIcon />}
                  onClick={() => {
                    onAddBlock(
                      blockSchema.type,
                      getSchemaDefaults(blockSchema.settings),
                    )
                    onClose()
                  }}
                  title={availability.reason}
                  type="button"
                  variant="outline"
                >
                  <IconBox>
                    <EditorItemIcon
                      kind="block"
                      size={18}
                      type={blockSchema.type}
                    />
                  </IconBox>
                  <span>
                    <BlockName>{blockSchema.name}</BlockName>
                    <BlockDescription>
                      {availability.reason ||
                        blockSchema.description ||
                        'Add this block to the section.'}
                    </BlockDescription>
                  </span>
                </BlockChoice>
              )
            })
          )}
        </ModalBody>
      </ModalCard>
    </ModalOverlay>
  )
}
