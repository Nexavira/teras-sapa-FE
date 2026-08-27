import React from 'react'

import styled from '@emotion/styled'
import {
  ArrowLeft01Icon,
  CubeIcon,
  Delete02Icon,
  InformationCircleIcon,
  Layers01Icon,
  Settings02Icon,
} from 'hugeicons-react'

import { ColorPicker } from '#/components/ui/primitives/ColorPicker'
import {
  editorActions,
  useEditorGlobalSettings,
  useEditorSelectedItem,
  useEditorTemplate,
} from '#/store/editorStore'

import { ColorSchemeGroupManager } from './ColorSchemeGroupManager'
import { ColorSchemePicker } from './ColorSchemePicker'
import settingsSchemaData from '#themes/config/settings_schema.json'
import { BlockRegistry, SectionRegistry } from '#themes/registry'
import type { SettingDefinition, SpacingValue } from '#themes/types/theme'

// ============================================================================
// Emotion Styled Components for Inspector UI
// ============================================================================

const InspectorContainer = styled.div`
  width: 320px;
  background-color: #ffffff;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
`

const InspectorHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  z-index: 10;
`

const HeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

const BackButton = styled.button`
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

const HeaderTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const HeaderSubtitle = styled.span`
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const ActionIconButton = styled.button<{ danger?: boolean }>`
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

const InspectorBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const EmptyStateContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
`

const FieldValueBadge = styled.span`
  font-size: 11px;
  font-family: monospace;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
`

const FieldInfo = styled.p`
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.4;
`

const TextInput = styled.input`
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

const TextArea = styled.textarea`
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

const Select = styled.select`
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

const RangeSliderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const RangeInput = styled.input`
  flex: 1;
  accent-color: #2563eb;
  cursor: pointer;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  user-select: none;
`

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #2563eb;
  cursor: pointer;
`

const HeaderField = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
  margin-top: 4px;
`

const ParagraphField = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
`

const SpacingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`

const SpacingInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const SpacingInputLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: #9ca3af;
`

// ============================================================================
// Single Field Dynamic Input Generator
// ============================================================================

interface FieldRendererProps {
  setting: SettingDefinition
  value: any
  onChange: (id: string, value: any) => void
}

const DynamicSettingField: React.FC<FieldRendererProps> = ({
  setting,
  value,
  onChange,
}) => {
  const { id, type, label, info, default: defaultValue } = setting
  const currentValue = value !== undefined ? value : defaultValue

  switch (type) {
    case 'header':
      return <HeaderField key={id}>{contentOrLabel(setting)}</HeaderField>

    case 'paragraph':
      return <ParagraphField key={id}>{contentOrLabel(setting)}</ParagraphField>

    case 'text':
      return (
        <FormField key={id}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <TextInput
            id={id}
            type="text"
            placeholder={setting.placeholder || ''}
            value={currentValue || ''}
            onChange={(e) => onChange(id, e.target.value)}
          />
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )

    case 'textarea':
    case 'richtext':
      return (
        <FormField key={id}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <TextArea
            id={id}
            placeholder={setting.placeholder || ''}
            value={currentValue || ''}
            onChange={(e) => onChange(id, e.target.value)}
          />
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )

    case 'number':
      return (
        <FormField key={id}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <TextInput
            id={id}
            type="number"
            min={setting.min}
            max={setting.max}
            step={setting.step || 1}
            value={currentValue ?? 0}
            onChange={(e) => onChange(id, Number(e.target.value))}
          />
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )

    case 'range': {
      const min = setting.min ?? 0
      const max = setting.max ?? 100
      const step = setting.step ?? 1
      const unit = setting.unit || ''
      const numVal = currentValue !== undefined ? Number(currentValue) : min

      return (
        <FormField key={id}>
          <FieldLabelRow>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <FieldValueBadge>
              {numVal}
              {unit}
            </FieldValueBadge>
          </FieldLabelRow>
          <RangeSliderWrapper>
            <RangeInput
              id={id}
              type="range"
              min={min}
              max={max}
              step={step}
              value={numVal}
              onChange={(e) => onChange(id, Number(e.target.value))}
            />
          </RangeSliderWrapper>
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )
    }

    case 'checkbox':
      return (
        <FormField key={id}>
          <CheckboxLabel>
            <CheckboxInput
              id={id}
              type="checkbox"
              checked={Boolean(currentValue)}
              onChange={(e) => onChange(id, e.target.checked)}
            />
            {label}
          </CheckboxLabel>
          {info && <FieldInfo style={{ marginLeft: 24 }}>{info}</FieldInfo>}
        </FormField>
      )

    case 'select':
      return (
        <FormField key={id}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Select
            id={id}
            value={currentValue || ''}
            onChange={(e) => onChange(id, e.target.value)}
          >
            {setting.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )

    case 'color':
      return (
        <FormField key={id}>
          <ColorPicker
            label={label}
            value={currentValue || '#000000'}
            allowGradient={false}
            onChange={(color) => onChange(id, color)}
          />
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )

    case 'color_background':
      return (
        <FormField key={id}>
          <ColorPicker
            label={label}
            value={currentValue || '#ffffff'}
            allowGradient={true}
            onChange={(color) => onChange(id, color)}
          />
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )

    case 'color_scheme':
      return (
        <FormField key={id}>
          <ColorSchemePicker
            label={label}
            value={currentValue || 'scheme-1'}
            info={info}
            onChange={(schemeKey) => onChange(id, schemeKey)}
          />
        </FormField>
      )

    case 'spacing': {
      const sp: SpacingValue = currentValue || {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }
      return (
        <FormField key={id}>
          <FieldLabel>{label}</FieldLabel>
          <SpacingGrid>
            <SpacingInputGroup>
              <SpacingInputLabel>Top (px)</SpacingInputLabel>
              <TextInput
                type="number"
                value={sp.top}
                onChange={(e) =>
                  onChange(id, { ...sp, top: Number(e.target.value) })
                }
              />
            </SpacingInputGroup>
            <SpacingInputGroup>
              <SpacingInputLabel>Right (px)</SpacingInputLabel>
              <TextInput
                type="number"
                value={sp.right}
                onChange={(e) =>
                  onChange(id, { ...sp, right: Number(e.target.value) })
                }
              />
            </SpacingInputGroup>
            <SpacingInputGroup>
              <SpacingInputLabel>Bottom (px)</SpacingInputLabel>
              <TextInput
                type="number"
                value={sp.bottom}
                onChange={(e) =>
                  onChange(id, { ...sp, bottom: Number(e.target.value) })
                }
              />
            </SpacingInputGroup>
            <SpacingInputGroup>
              <SpacingInputLabel>Left (px)</SpacingInputLabel>
              <TextInput
                type="number"
                value={sp.left}
                onChange={(e) =>
                  onChange(id, { ...sp, left: Number(e.target.value) })
                }
              />
            </SpacingInputGroup>
          </SpacingGrid>
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )
    }

    case 'image_picker':
      return (
        <FormField key={id}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <TextInput
            id={id}
            type="text"
            placeholder="https://..."
            value={currentValue || ''}
            onChange={(e) => onChange(id, e.target.value)}
          />
          {currentValue && (
            <img
              src={currentValue}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: 120,
                objectFit: 'cover',
                borderRadius: 6,
                marginTop: 4,
              }}
            />
          )}
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )

    default:
      return null
  }
}

function contentOrLabel(s: SettingDefinition): string {
  return s.content || s.label || ''
}

// ============================================================================
// Section Inspector View
// ============================================================================

interface SectionInspectorProps {
  sectionId: string
}

const SectionInspector: React.FC<SectionInspectorProps> = ({ sectionId }) => {
  const template = useEditorTemplate()
  const section = template.sections[sectionId]

  if (!section.id) {
    return (
      <EmptyStateContainer>
        <InformationCircleIcon size={32} />
        <div>Section not found: {sectionId}</div>
      </EmptyStateContainer>
    )
  }

  const registered = SectionRegistry[section.type]
  const schema = registered.schema
  const settingsList = schema.settings
  const currentSettings = section.settings

  const handleFieldChange = (key: string, val: any) => {
    editorActions.updateSectionSettings(sectionId, { [key]: val })
  }

  return (
    <>
      <InspectorHeader>
        <HeaderTitleGroup>
          <BackButton
            type="button"
            title="Back to outline"
            onClick={() => editorActions.selectItem(null)}
          >
            <ArrowLeft01Icon size={18} />
          </BackButton>
          <div>
            <HeaderTitle>{schema.name || section.type}</HeaderTitle>
            <HeaderSubtitle>Section Settings</HeaderSubtitle>
          </div>
        </HeaderTitleGroup>

        {section.type !== 'header' && section.type !== 'footer' && (
          <ActionIconButton
            danger
            type="button"
            title="Delete Section"
            onClick={() => editorActions.removeSection(sectionId)}
          >
            <Delete02Icon size={16} />
          </ActionIconButton>
        )}
      </InspectorHeader>

      <InspectorBody>
        {settingsList.length === 0 ? (
          <EmptyStateContainer>
            <Layers01Icon size={28} />
            <div>This section has no configurable settings.</div>
          </EmptyStateContainer>
        ) : (
          settingsList.map((setting, idx) => (
            <DynamicSettingField
              key={setting.id || idx}
              setting={setting}
              value={currentSettings[setting.id]}
              onChange={handleFieldChange}
            />
          ))
        )}
      </InspectorBody>
    </>
  )
}

// ============================================================================
// Block Inspector View
// ============================================================================

interface BlockInspectorProps {
  sectionId: string
  blockId: string
}

const BlockInspector: React.FC<BlockInspectorProps> = ({
  sectionId,
  blockId,
}) => {
  const template = useEditorTemplate()
  const section = template.sections[sectionId]
  const block = section.blocks?.[blockId]

  if (!section.id || !block) {
    return (
      <EmptyStateContainer>
        <InformationCircleIcon size={32} />
        <div>Block not found: {blockId}</div>
      </EmptyStateContainer>
    )
  }

  const registered = BlockRegistry[block.type]
  const schema = registered.schema
  const settingsList = schema.settings
  const currentSettings = block.settings

  const handleFieldChange = (key: string, val: any) => {
    editorActions.updateBlockSettings(sectionId, blockId, { [key]: val })
  }

  return (
    <>
      <InspectorHeader>
        <HeaderTitleGroup>
          <BackButton
            type="button"
            title="Back to parent section"
            onClick={() =>
              editorActions.selectItem({ type: 'section', id: sectionId })
            }
          >
            <ArrowLeft01Icon size={18} />
          </BackButton>
          <div>
            <HeaderTitle>{schema.name || block.type}</HeaderTitle>
            <HeaderSubtitle>Block Settings</HeaderSubtitle>
          </div>
        </HeaderTitleGroup>

        <ActionIconButton
          danger
          type="button"
          title="Delete Block"
          onClick={() => editorActions.removeBlock(sectionId, blockId)}
        >
          <Delete02Icon size={16} />
        </ActionIconButton>
      </InspectorHeader>

      <InspectorBody>
        {settingsList.length === 0 ? (
          <EmptyStateContainer>
            <CubeIcon size={28} />
            <div>This block has no configurable settings.</div>
          </EmptyStateContainer>
        ) : (
          settingsList.map((setting, idx) => (
            <DynamicSettingField
              key={setting.id || idx}
              setting={setting}
              value={currentSettings[setting.id]}
              onChange={handleFieldChange}
            />
          ))
        )}
      </InspectorBody>
    </>
  )
}

// ============================================================================
// Global Theme Settings Inspector View
// ============================================================================

interface GlobalCategoryInspectorProps {
  categoryName: string
}

const GlobalCategoryInspector: React.FC<GlobalCategoryInspectorProps> = ({
  categoryName,
}) => {
  const globalSettings = useEditorGlobalSettings()
  const categories = (settingsSchemaData as any[]).filter(
    (c) => c.name !== 'theme_info',
  )
  const activeCategory = categories.find((c) => c.name === categoryName)

  if (!activeCategory) {
    return (
      <EmptyStateContainer>
        <Settings02Icon size={32} />
        <div>Category not found: {categoryName}</div>
      </EmptyStateContainer>
    )
  }

  const settingsList: SettingDefinition[] = activeCategory.settings
  const currentGlobalValues = globalSettings.current

  const handleFieldChange = (key: string, val: any) => {
    editorActions.updateGlobalSetting(key, val)
  }

  const isColorsCategory = categoryName.toLowerCase() === 'colors'

  return (
    <>
      <InspectorHeader>
        <HeaderTitleGroup>
          <BackButton
            type="button"
            title="Back"
            onClick={() => editorActions.selectItem(null)}
          >
            <ArrowLeft01Icon size={18} />
          </BackButton>
          <div>
            <HeaderTitle>{categoryName}</HeaderTitle>
            <HeaderSubtitle>Theme Settings</HeaderSubtitle>
          </div>
        </HeaderTitleGroup>
      </InspectorHeader>

      <InspectorBody>
        {isColorsCategory && <ColorSchemeGroupManager />}

        {settingsList.map((setting, idx) => (
          <DynamicSettingField
            key={setting.id || idx}
            setting={setting}
            value={currentGlobalValues[setting.id]}
            onChange={handleFieldChange}
          />
        ))}
      </InspectorBody>
    </>
  )
}

// ============================================================================
// Main DynamicFormInspector
// ============================================================================

export interface DynamicFormInspectorProps {
  className?: string
}

export const DynamicFormInspector: React.FC<DynamicFormInspectorProps> = ({
  className,
}) => {
  const selectedItem = useEditorSelectedItem()

  if (!selectedItem) {
    return (
      <InspectorContainer className={className}>
        <InspectorHeader>
          <HeaderTitleGroup>
            <div>
              <HeaderTitle>Theme Inspector</HeaderTitle>
              <HeaderSubtitle>Live Editor</HeaderSubtitle>
            </div>
          </HeaderTitleGroup>
        </InspectorHeader>
        <InspectorBody>
          <EmptyStateContainer>
            <Layers01Icon size={36} color="#9ca3af" />
            <div
              style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}
            >
              No Item Selected
            </div>
            <div
              style={{ fontSize: '12px', color: '#6b7280', maxWidth: '220px' }}
            >
              Select a section or block on the canvas or left sidebar to
              customize its settings in real-time.
            </div>
          </EmptyStateContainer>
        </InspectorBody>
      </InspectorContainer>
    )
  }

  return (
    <InspectorContainer className={className}>
      {selectedItem.type === 'section' && selectedItem.id && (
        <SectionInspector sectionId={selectedItem.id} />
      )}
      {selectedItem.type === 'block' &&
        selectedItem.id &&
        selectedItem.sectionId && (
          <BlockInspector
            sectionId={selectedItem.sectionId}
            blockId={selectedItem.id}
          />
        )}
      {selectedItem.type === 'global_settings_category' &&
        selectedItem.category && (
          <GlobalCategoryInspector categoryName={selectedItem.category} />
        )}
    </InspectorContainer>
  )
}
