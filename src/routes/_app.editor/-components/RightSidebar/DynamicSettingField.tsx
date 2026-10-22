import { ImagePickerInput } from '#/-components/ui/form/image-picker-input'
import { ColorPicker } from '#/-components/ui/primitives/ColorPicker'
import { useGetCollections } from '#/services/collection/useGetCollections'

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
import type { SettingDefinition, SpacingValue } from '#themes'

interface DynamicSettingFieldProps {
  setting: SettingDefinition
  value: any
  onChange: (id: string, value: any) => void
}

const CollectionPickerField = ({
  id,
  label,
  info,
  value,
  onChange,
}: {
  id: string
  label?: string
  info?: string
  value: string
  onChange: (value: string) => void
}) => {
  const { data: collections = [] } = useGetCollections()

  return (
    <FormField key={id}>
      <FieldLabel htmlFor={id}>{label || 'Collection'}</FieldLabel>
      <Select
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Default (Bestsellers Preset)</option>
        {collections.map((col) => (
          <option key={col.uuid} value={col.uuid}>
            {col.title} ({col.productUuids?.length || 0} products)
          </option>
        ))}
      </Select>
      {info && <FieldInfo>{info}</FieldInfo>}
    </FormField>
  )
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
    case 'url': {
      const inputValue =
        typeof currentValue === 'string'
          ? currentValue
          : currentValue?.url || ''

      return (
        <FormField key={id}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <TextInput
            id={id}
            type={type === 'url' ? 'url' : 'text'}
            placeholder={
              setting.placeholder || (type === 'url' ? 'https://...' : '')
            }
            value={inputValue}
            onChange={(event) => onChange(id, event.target.value)}
          />
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )
    }

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

    case 'collection':
      return (
        <CollectionPickerField
          key={id}
          id={id}
          label={label}
          info={info}
          value={currentValue || ''}
          onChange={(val) => onChange(id, val)}
        />
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
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
              <SpacingInputGroup key={side}>
                <SpacingInputLabel htmlFor={`${id}-${side}`}>
                  {side.charAt(0).toUpperCase() + side.slice(1)} (px)
                </SpacingInputLabel>
                <TextInput
                  id={`${id}-${side}`}
                  type="number"
                  min={setting.min}
                  max={setting.max}
                  step={setting.step ?? 1}
                  value={spacing[side]}
                  onChange={(event) => {
                    const nextValue = event.target.valueAsNumber
                    if (!Number.isFinite(nextValue)) return
                    onChange(id, {
                      ...spacing,
                      [side]: Math.min(
                        setting.max ?? Infinity,
                        Math.max(setting.min ?? -Infinity, nextValue),
                      ),
                    })
                  }}
                />
              </SpacingInputGroup>
            ))}
          </SpacingGrid>
          {info && <FieldInfo>{info}</FieldInfo>}
        </FormField>
      )
    }

    case 'image_picker': {
      const imageUrl =
        typeof currentValue === 'string'
          ? currentValue
          : (currentValue?.url as string) || ''

      return (
        <FormField key={id}>
          <ImagePickerInput
            id={id}
            label={label}
            placeholder={
              setting.placeholder || 'Pilih gambar dari pustaka media...'
            }
            value={imageUrl}
            onChange={(url) => {
              if (typeof currentValue === 'object' && currentValue !== null) {
                onChange(id, { ...currentValue, url })
              } else {
                onChange(id, url)
              }
            }}
            helperText={info}
          />
        </FormField>
      )
    }

    default:
      return null
  }
}

const contentOrLabel = (setting: SettingDefinition): string =>
  setting.content || setting.label || ''
