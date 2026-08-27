import React from 'react'

import styled from '@emotion/styled'
import { Cancel01Icon } from 'hugeicons-react'

import { ActionBtn } from './TreeItem'
import { SectionRegistry } from '#themes/registry'

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

const ModalCard = styled.div`
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

const SectionPresetCard = styled.div`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #2563eb;
    background-color: #eff6ff;
  }
`

export interface AddSectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSection: (type: string, settings: any, blocks: any[]) => void
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAddSection,
}) => {
  if (!isOpen) return null

  const availableSectionTypes = Object.entries(SectionRegistry).filter(
    ([type]) => type !== 'header',
  )

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
            Add Section to Template
          </h3>
          <ActionBtn type="button" onClick={onClose}>
            <Cancel01Icon size={18} />
          </ActionBtn>
        </ModalHeader>
        <ModalBody>
          {availableSectionTypes.map(([type, registered]) => {
            const schema = registered.schema
            const preset = schema.presets?.[0]

            return (
              <SectionPresetCard
                key={type}
                onClick={() => {
                  onAddSection(
                    type,
                    preset?.settings || {},
                    preset?.blocks || [],
                  )
                  onClose()
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>
                    {schema.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    {schema.description || 'Custom layout section.'}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#2563eb',
                  }}
                >
                  + Add
                </span>
              </SectionPresetCard>
            )
          })}
        </ModalBody>
      </ModalCard>
    </ModalOverlay>
  )
}
