import styled from '@emotion/styled'

export const InspectorContainer = styled.div`
  width: 320px;
  background-color: #ffffff;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
`

export const InspectorHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  z-index: 10;
`

export const HeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

export const BackButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`

export const HeaderTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const HeaderSubtitle = styled.span`
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const ActionIconButton = styled.button<{ danger?: boolean }>`
  background: none;
  border: none;
  padding: 6px;
  border-radius: 6px;
  color: ${({ danger }) => (danger ? '#ef4444' : '#6b7280')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ danger }) => (danger ? '#fee2e2' : '#f3f4f6')};
    color: ${({ danger }) => (danger ? '#dc2626' : '#111827')};
  }
`

export const InspectorBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const EmptyStateContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FieldLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
`

export const FieldValueBadge = styled.span`
  font-size: 11px;
  font-family: monospace;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
`

export const FieldInfo = styled.p`
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.4;
`

export const TextInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background-color: #ffffff;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
`

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background-color: #ffffff;
  outline: none;
  resize: vertical;
  min-height: 72px;
  font-family: inherit;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
`

export const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #2563eb;
  }
`

export const RangeSliderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const RangeInput = styled.input`
  flex: 1;
  accent-color: #2563eb;
  cursor: pointer;
`

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  user-select: none;
`

export const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #2563eb;
  cursor: pointer;
`

export const HeaderField = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
  margin-top: 4px;
`

export const ParagraphField = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
`

export const SpacingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`

export const SpacingInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const SpacingInputLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: #9ca3af;
`
