import React from 'react'

import styled from '@emotion/styled'
import { CheckmarkCircle02Icon, Settings02Icon } from 'hugeicons-react'

import { theme, Typography } from '#/components/ui'
import { editorActions, useEditorGlobalSettings } from '#/store/editorStore'

import type { ColorSchemeSettings } from '#themes/types/theme'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SchemesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`

const SchemeCard = styled.button<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background-color: #ffffff;
  border: 1.5px solid
    ${({ $isSelected }) => ($isSelected ? '#2563eb' : '#e5e7eb')};
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  position: relative;
  transition: all 0.15s ease;
  outline: none;

  ${({ $isSelected }) =>
    $isSelected &&
    `
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    background-color: #f8faff;
  `}

  &:hover {
    border-color: ${({ $isSelected }) => ($isSelected ? '#2563eb' : '#9ca3af')};
    background-color: ${({ $isSelected }) => ($isSelected ? '#f8faff' : '#f9fafb')};
  }
`

const SchemeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const SchemeTitle = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #1f2937;
  text-transform: capitalize;
`

const SelectedBadge = styled.span`
  display: flex;
  align-items: center;
  color: #2563eb;
`

const SwatchPreview = styled.div<{ bg: string; gradient?: string }>`
  width: 100%;
  height: 38px;
  border-radius: 5px;
  background: ${({ gradient, bg }) => gradient || bg || '#ffffff'};
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  position: relative;
  overflow: hidden;
`

const TextChip = styled.span<{ color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ color }) => color || '#121212'};
`

const ButtonChipsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`

const SolidButtonChip = styled.div<{ bg: string; text: string }>`
  width: 20px;
  height: 14px;
  border-radius: 3px;
  background-color: ${({ bg }) => bg || '#121212'};
  color: ${({ text }) => text || '#ffffff'};
  font-size: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
`

const OutlineButtonChip = styled.div<{ color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1.5px solid ${({ color }) => color || '#121212'};
  background-color: transparent;
`

const ManageSchemesLink = styled.button`
  background: none;
  border: none;
  padding: 4px 0;
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  align-self: flex-start;

  &:hover {
    text-decoration: underline;
    color: #1d4ed8;
  }
`

const FieldInfo = styled.p`
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.4;
`

export interface ColorSchemePickerProps {
  label?: string
  value?: string
  info?: string
  onChange: (value: string) => void
}

export const ColorSchemePicker: React.FC<ColorSchemePickerProps> = ({
  label = 'Color scheme',
  value = 'scheme-1',
  info,
  onChange,
}) => {
  const globalSettings = useEditorGlobalSettings()
  const colorSchemes = globalSettings.current.color_schemes || {}
  const schemeKeys = Object.keys(colorSchemes)

  const formatSchemeLabel = (key: string): string => {
    return key.replace('-', ' ').replace('_', ' ')
  }

  const handleGoToThemeColors = () => {
    editorActions.setActiveTab('settings')
    editorActions.selectItem({
      type: 'global_settings_category',
      category: 'Colors',
    })
  }

  return (
    <Container>
      <LabelRow>
        <Typography variant="caption" weight="medium">
          {label}
        </Typography>
      </LabelRow>

      <SchemesGrid>
        {schemeKeys.map((key) => {
          const scheme = colorSchemes[key]
          const s: ColorSchemeSettings = scheme.settings

          const isSelected = value === key

          return (
            <SchemeCard
              key={key}
              type="button"
              $isSelected={isSelected}
              onClick={() => onChange(key)}
            >
              <SchemeHeader>
                <SchemeTitle>{formatSchemeLabel(key)}</SchemeTitle>
                {isSelected && (
                  <SelectedBadge>
                    <CheckmarkCircle02Icon size={14} />
                  </SelectedBadge>
                )}
              </SchemeHeader>

              <SwatchPreview bg={s.background} gradient={s.background_gradient}>
                <TextChip color={s.text}>Aa</TextChip>
                <ButtonChipsGroup>
                  <SolidButtonChip bg={s.button} text={s.button_label}>
                    •
                  </SolidButtonChip>
                  <OutlineButtonChip color={s.secondary_button_label} />
                </ButtonChipsGroup>
              </SwatchPreview>
            </SchemeCard>
          )
        })}
      </SchemesGrid>

      {info && <FieldInfo>{info}</FieldInfo>}

      <ManageSchemesLink type="button" onClick={handleGoToThemeColors}>
        <Settings02Icon size={12} />
        Manage color schemes in Theme settings
      </ManageSchemesLink>
    </Container>
  )
}
