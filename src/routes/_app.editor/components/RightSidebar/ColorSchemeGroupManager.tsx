import React, { useState } from 'react'

import styled from '@emotion/styled'
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Copy01Icon,
  Delete02Icon,
  PaintBoardIcon,
  PlusSignIcon,
} from 'hugeicons-react'

import { Button, IconButton, theme } from '#/components/ui'
import { ColorPicker } from '#/components/ui/primitives/ColorPicker'
import { editorActions, useEditorGlobalSettings } from '#/store/editorStore'

import type { ColorSchemeSettings } from '#themes/types/theme'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`

const Description = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
`

const SchemeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const SchemeCard = styled.div<{ $expanded: boolean }>`
  border: 1px solid ${({ $expanded }) => ($expanded ? '#2563eb' : '#e5e7eb')};
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
  box-shadow: ${({ $expanded }) =>
    $expanded
      ? '0 4px 12px rgba(37, 99, 235, 0.08)'
      : '0 1px 2px rgba(0, 0, 0, 0.04)'};
  transition: all 0.2s ease;
`

const SchemeHeader = styled.div`
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background-color: #fafafa;
  user-select: none;

  &:hover {
    background-color: #f3f4f6;
  }
`

const SchemeHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

const MiniSwatch = styled.div<{
  bg: string
  gradient?: string
  text: string
  btn: string
}>`
  width: 28px;
  height: 22px;
  border-radius: 4px;
  background: ${({ gradient, bg }) => gradient || bg || '#ffffff'};
  border: 1px solid rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: ${({ text }) => text || '#121212'};
  position: relative;
  overflow: hidden;
`

const SchemeName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  text-transform: capitalize;
`

const SchemeHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const SchemeBody = styled.div`
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-top: 1px solid #e5e7eb;
`

/* Live Interactive Preview inside expanded accordion */
const LivePreviewBox = styled.div<{
  bg: string
  gradient?: string
  text: string
  btnBg: string
  btnText: string
  secBtn: string
}>`
  padding: 14px;
  border-radius: 6px;
  background: ${({ gradient, bg }) => gradient || bg || '#ffffff'};
  color: ${({ text }) => text || '#121212'};
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
`

const LivePreviewTitle = styled.div<{ color: string }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ color }) => color || '#121212'};
`

const LivePreviewText = styled.div<{ color: string }>`
  font-size: 11px;
  color: ${({ color }) => color || '#121212'};
  opacity: 0.8;
  line-height: 1.4;
`

const LivePreviewButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`

const LivePrimaryBtn = styled.div<{ bg: string; color: string }>`
  padding: 4px 10px;
  border-radius: 4px;
  background-color: ${({ bg }) => bg || '#121212'};
  color: ${({ color }) => color || '#ffffff'};
  font-size: 10px;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
`

const LiveSecondaryBtn = styled.div<{ color: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid ${({ color }) => color || '#121212'};
  color: ${({ color }) => color || '#121212'};
  background-color: transparent;
  font-size: 10px;
  font-weight: 600;
`

/* Color Role Input Controls */
const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const RoleHeading = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-top: 4px;
`

export const ColorSchemeGroupManager: React.FC = () => {
  const globalSettings = useEditorGlobalSettings()
  const colorSchemes = globalSettings.current.color_schemes || {}
  const schemeKeys = Object.keys(colorSchemes)

  const [expandedKey, setExpandedKey] = useState<string | null>(
    schemeKeys[0] || null,
  )

  const formatSchemeLabel = (key: string): string => {
    return key.replace('-', ' ').replace('_', ' ')
  }

  const handleUpdate = (
    schemeKey: string,
    partial: Partial<ColorSchemeSettings>,
  ) => {
    editorActions.updateColorScheme(schemeKey, partial)
  }

  return (
    <Container>
      <HeaderSection>
        <Title>
          <PaintBoardIcon size={16} /> Color Schemes
        </Title>
        <Description>
          Color schemes define reusable palette combinations (background, text,
          buttons, shadow) used across sections and blocks.
        </Description>
      </HeaderSection>

      <SchemeList>
        {schemeKeys.map((key) => {
          const scheme = colorSchemes[key]
          const s: ColorSchemeSettings = scheme.settings

          const isExpanded = expandedKey === key

          return (
            <SchemeCard key={key} $expanded={isExpanded}>
              <SchemeHeader
                onClick={() => setExpandedKey(isExpanded ? null : key)}
              >
                <SchemeHeaderLeft>
                  <MiniSwatch
                    bg={s.background}
                    gradient={s.background_gradient}
                    text={s.text}
                    btn={s.button}
                  >
                    Aa
                  </MiniSwatch>
                  <SchemeName>{formatSchemeLabel(key)}</SchemeName>
                </SchemeHeaderLeft>

                <SchemeHeaderActions onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    title="Duplicate Scheme"
                    onClick={() => {
                      const newId = editorActions.duplicateColorScheme(key)
                      setExpandedKey(newId)
                    }}
                  >
                    <Copy01Icon size={14} />
                  </IconButton>

                  {schemeKeys.length > 1 && (
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      title="Delete Scheme"
                      style={{ color: theme.colors.error }}
                      onClick={() => {
                        editorActions.removeColorScheme(key)
                        if (expandedKey === key) {
                          setExpandedKey(
                            schemeKeys.find((k) => k !== key) || null,
                          )
                        }
                      }}
                    >
                      <Delete02Icon size={14} />
                    </IconButton>
                  )}

                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedKey(isExpanded ? null : key)}
                  >
                    {isExpanded ? (
                      <ArrowUp01Icon size={14} />
                    ) : (
                      <ArrowDown01Icon size={14} />
                    )}
                  </IconButton>
                </SchemeHeaderActions>
              </SchemeHeader>

              {isExpanded && (
                <SchemeBody>
                  {/* Live Preview Box */}
                  <LivePreviewBox
                    bg={s.background}
                    gradient={s.background_gradient}
                    text={s.text}
                    btnBg={s.button}
                    btnText={s.button_label}
                    secBtn={s.secondary_button_label}
                  >
                    <LivePreviewTitle color={s.text}>
                      Sample Heading
                    </LivePreviewTitle>
                    <LivePreviewText color={s.text}>
                      Live preview of how background, text, and buttons render
                      together in this color scheme.
                    </LivePreviewText>
                    <LivePreviewButtons>
                      <LivePrimaryBtn bg={s.button} color={s.button_label}>
                        Solid Button
                      </LivePrimaryBtn>
                      <LiveSecondaryBtn color={s.secondary_button_label}>
                        Outline
                      </LiveSecondaryBtn>
                    </LivePreviewButtons>
                  </LivePreviewBox>

                  {/* Form Controls */}
                  <ControlGroup>
                    <RoleHeading>Background</RoleHeading>
                    <ColorPicker
                      label="Background color"
                      value={s.background || '#FFFFFF'}
                      allowGradient={false}
                      onChange={(val) => handleUpdate(key, { background: val })}
                    />

                    <ColorPicker
                      label="Background gradient (Optional)"
                      value={s.background_gradient || ''}
                      allowGradient={true}
                      onChange={(val) =>
                        handleUpdate(key, { background_gradient: val })
                      }
                    />

                    <RoleHeading>Text</RoleHeading>
                    <ColorPicker
                      label="Text & Headings"
                      value={s.text || '#121212'}
                      allowGradient={false}
                      onChange={(val) => handleUpdate(key, { text: val })}
                    />

                    <RoleHeading>Solid Button</RoleHeading>
                    <ColorPicker
                      label="Button background"
                      value={s.button || '#121212'}
                      allowGradient={false}
                      onChange={(val) => handleUpdate(key, { button: val })}
                    />
                    <ColorPicker
                      label="Button label"
                      value={s.button_label || '#FFFFFF'}
                      allowGradient={false}
                      onChange={(val) =>
                        handleUpdate(key, { button_label: val })
                      }
                    />

                    <RoleHeading>Outline Button</RoleHeading>
                    <ColorPicker
                      label="Outline button"
                      value={s.secondary_button_label || '#121212'}
                      allowGradient={false}
                      onChange={(val) =>
                        handleUpdate(key, { secondary_button_label: val })
                      }
                    />

                    <RoleHeading>Shadow</RoleHeading>
                    <ColorPicker
                      label="Shadow"
                      value={s.shadow || '#121212'}
                      allowGradient={false}
                      onChange={(val) => handleUpdate(key, { shadow: val })}
                    />
                  </ControlGroup>
                </SchemeBody>
              )}
            </SchemeCard>
          )
        })}
      </SchemeList>

      <Button
        type="button"
        variant="outline"
        size="md"
        style={{ width: '100%', gap: '6px' }}
        onClick={() => {
          const newId = editorActions.addColorScheme()
          setExpandedKey(newId)
        }}
      >
        <PlusSignIcon size={14} /> Add Color Scheme
      </Button>
    </Container>
  )
}
