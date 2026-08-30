import React from 'react'

import styled from '@emotion/styled'
import { Cancel01Icon, PlusSignIcon } from 'hugeicons-react'

import { Button, Card, IconButton, theme, Typography } from '#/components/ui'
import {
  canDuplicateSection,
  getSchemaDefaults,
} from '#/lib/editor/themeSchema'
import { useEditorTemplate } from '#/store/editorStore'

import { EditorItemIcon } from './EditorItemIcon'
import { SectionRegistry } from '#themes/registry'
import type { SectionPreset } from '#themes/types/theme'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalCard = styled(Card)`
  width: 520px;
  max-width: 90vw;
  max-height: 80vh;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ModalBody = styled.div`
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const SectionPresetCard = styled(Button)`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: ${theme.colors.text.primary};
  text-align: left;
  background-color: ${theme.colors.background};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.colors.primary.DEFAULT};
    background-color: ${theme.colors.primary.LIGHTER};
  }

  &:disabled {
    border-color: #e5e7eb;
    color: #9ca3af;
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`

const SectionIdentity = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
`

const SectionIcon = styled.span`
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 9px;
  color: ${theme.colors.primary.DEFAULT};
  background-color: ${theme.colors.primary.LIGHTER};
`

const SectionName = styled(Typography)`
  display: block;
  font-size: 13px;
`

const SectionDescription = styled(Typography)`
  display: block;
  margin-top: 2px;
  font-size: 12px;
`

export interface AddSectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSection: (
    type: string,
    settings: Record<string, unknown>,
    blocks: NonNullable<SectionPreset['blocks']>,
  ) => void
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAddSection,
}) => {
  const template = useEditorTemplate()
  if (!isOpen) return null

  const sectionTypeCounts = template.order.reduce<Record<string, number>>(
    (counts, sectionId) => {
      const type = template.sections[sectionId].type
      counts[type] = (counts[type] || 0) + 1
      return counts
    },
    {},
  )
  const availableSectionTypes = Object.entries(SectionRegistry).filter(
    ([type, registered]) => type !== 'header' && Boolean(registered),
  )

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard padding="none" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Typography as="h3" variant="body" weight="bold">
            Add Section to Template
          </Typography>
          <IconButton
            aria-label="Close section picker"
            onClick={onClose}
            size="sm"
            type="button"
          >
            <Cancel01Icon size={18} />
          </IconButton>
        </ModalHeader>
        <ModalBody>
          {availableSectionTypes.map(([type, registered]) => {
            if (!registered) return null
            const schema = registered.schema
            const preset = schema.presets?.[0]
            const canAdd = canDuplicateSection(
              sectionTypeCounts[type] || 0,
              schema,
            )

            return (
              <SectionPresetCard
                color="neutral"
                disabled={!canAdd}
                endIcon={<PlusSignIcon />}
                key={type}
                onClick={() => {
                  onAddSection(
                    type,
                    preset?.settings || getSchemaDefaults(schema.settings),
                    preset?.blocks || [],
                  )
                  onClose()
                }}
                title={canAdd ? undefined : `${schema.name} limit reached`}
                type="button"
                variant="outline"
              >
                <SectionIdentity>
                  <SectionIcon>
                    <EditorItemIcon kind="section" type={type} />
                  </SectionIcon>
                  <div>
                    <SectionName color="inherit" weight="medium">
                      {schema.name}
                    </SectionName>
                    <SectionDescription color="secondary" variant="caption">
                      {canAdd
                        ? schema.description || 'Custom layout section.'
                        : `${schema.name} limit reached.`}
                    </SectionDescription>
                  </div>
                </SectionIdentity>
              </SectionPresetCard>
            )
          })}
        </ModalBody>
      </ModalCard>
    </ModalOverlay>
  )
}
