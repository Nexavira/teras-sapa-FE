import { ColorPicker } from '#/components/ui/primitives/ColorPicker'

import { ColorSchemePicker } from './ColorSchemePicker'
import {
  CheckboxInput,
  CheckboxLabel,
  FieldInfo,
  FieldLabel,
  FieldLabelRow,
  FieldValueBadge,
  FormField,
  HeaderField,
  ParagraphField,
  RangeInput,
  RangeSliderWrapper,
  Select,
  SpacingGrid,
  SpacingInputGroup,
  SpacingInputLabel,
  TextArea,
  TextInput,
} from './inspectorStyles'
import type { SettingDefinition, SpacingValue } from '#themes/types/theme'

interface DynamicSettingFieldProps {
  setting: SettingDefinition
  value: any
  onChange: (id: string, value: any) => void
}

export const DynamicSettingField = ({
  setting,
  value,
  onChange,
}: DynamicSettingFieldProps) => {
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
            onChange={(event) => onChange(id, event.target.value)}
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
            onChange={(event) => onChange(id, event.target.value)}
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
            onChange={(event) => onChange(id, Number(event.target.value))}
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
              onChange={(event) => onChange(id, Number(event.target.value))}
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
              onChange={(event) => onChange(id, event.target.checked)}
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
            onChange={(event) => onChange(id, event.target.value)}
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
            allowGradient
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
      const spacing: SpacingValue = currentValue || {
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
                value={spacing.top}
                onChange={(event) =>
                  onChange(id, {
                    ...spacing,
                    top: Number(event.target.value),
                  })
                }
              />
            </SpacingInputGroup>
            <SpacingInputGroup>
              <SpacingInputLabel>Right (px)</SpacingInputLabel>
              <TextInput
                type="number"
                value={spacing.right}
                onChange={(event) =>
                  onChange(id, {
                    ...spacing,
                    right: Number(event.target.value),
                  })
                }
              />
            </SpacingInputGroup>
            <SpacingInputGroup>
              <SpacingInputLabel>Bottom (px)</SpacingInputLabel>
              <TextInput
                type="number"
                value={spacing.bottom}
                onChange={(event) =>
                  onChange(id, {
                    ...spacing,
                    bottom: Number(event.target.value),
                  })
                }
              />
            </SpacingInputGroup>
            <SpacingInputGroup>
              <SpacingInputLabel>Left (px)</SpacingInputLabel>
              <TextInput
                type="number"
                value={spacing.left}
                onChange={(event) =>
                  onChange(id, {
                    ...spacing,
                    left: Number(event.target.value),
                  })
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
            onChange={(event) => onChange(id, event.target.value)}
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

const contentOrLabel = (setting: SettingDefinition): string =>
  setting.content || setting.label || ''
