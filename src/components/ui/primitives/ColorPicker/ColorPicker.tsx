import React, { useCallback, useEffect, useRef, useState } from 'react'

import styled from '@emotion/styled'
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  PaintBoardIcon,
  Tick02Icon,
} from 'hugeicons-react'

import { theme } from '../../theme'
import { Button } from '../Button'
import { Card } from '../Card'
import { IconButton } from '../IconButton'
import { Input } from '../Input'
import { Typography } from '../Typography'
import type { HSV, RGBA } from './color-utils'
import {
  hslToRgb,
  hsvToRgb,
  isGradient,
  parseColorToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from './color-utils'

// ============================================================================
// Internal Canvas & Slider Specialized Elements (Using Theme Tokens)
// ============================================================================

const RootContainer = styled.div`
  position: relative;
  width: 100%;
`

/* Swatch Trigger Chip */
const SwatchChip = styled.button<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.colors.border};
  padding: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  background-image:
    linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
    linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
    linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
  background-size: 6px 6px;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ color }) => color || '#ffffff'};
  }
`

/* Popover Wrapper */
const PopoverCard = styled(Card)`
  position: absolute;
  top: calc(100% + ${theme.spacing.xs});
  left: 0;
  z-index: 1000;
  width: 270px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  user-select: none;
  box-shadow: ${theme.shadows.lg};
  border: 1px solid ${theme.colors.border};
  animation: popoverFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes popoverFadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`

const TabsRow = styled.div`
  display: flex;
  background-color: ${theme.colors.muted};
  padding: 2px;
  border-radius: ${theme.radius.sm};
  gap: 2px;
`

/* 2D Saturation / Brightness Drag Canvas */
const SaturationBox = styled.div<{ hue: number }>`
  width: 100%;
  height: 140px;
  position: relative;
  border-radius: ${theme.radius.md};
  background-color: hsl(${({ hue }) => hue}, 100%, 50%);
  overflow: hidden;
  cursor: crosshair;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, #ffffff, transparent);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #000000, transparent);
  }
`

const SaturationHandle = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${({ x }) => x}%;
  top: ${({ y }) => y}%;
  width: 14px;
  height: 14px;
  border-radius: ${theme.radius.full};
  border: 2px solid #ffffff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
`

/* Hue & Alpha Sliders */
const SliderTrack = styled.div`
  width: 100%;
  height: 12px;
  border-radius: ${theme.radius.sm};
  position: relative;
  cursor: pointer;
`

const HueTrack = styled(SliderTrack)`
  background: linear-gradient(
    to right,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
`

const AlphaTrack = styled(SliderTrack)<{ color: string }>`
  background-image:
    linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
    linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
    linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
  background-size: 6px 6px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: ${theme.radius.sm};
    background: linear-gradient(to right, transparent, ${({ color }) => color});
  }
`

const SliderHandle = styled.div<{ pos: number }>`
  position: absolute;
  left: ${({ pos }) => pos}%;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: ${theme.radius.full};
  border: 2px solid #ffffff;
  background-color: #ffffff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -50%);
  pointer-events: none;
`

/* Format Row */
const FormatRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`

const ChannelGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`

const ChannelBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`

const MiniInput = styled.input`
  width: 100%;
  padding: 4px 2px;
  font-size: 11px;
  font-family: monospace;
  text-align: center;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.background};
  outline: none;

  &:focus {
    border-color: ${theme.colors.secondary.DEFAULT};
  }
`

/* Presets Grid */
const PresetsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: ${theme.spacing.xs};
  border-top: 1px solid ${theme.colors.border};
`

const PresetChip = styled.button<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: ${theme.radius.sm};
  background: ${({ color }) => color};
  border: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.15);
  }
`

/* Gradient Angle Grid */
const GradientAngleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
`

const DEFAULT_PRESETS = [
  '#000000',
  '#FFFFFF',
  '#F3F4F6',
  '#6B7280',
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
]

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
  'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
]

// ============================================================================
// Props
// ============================================================================

export interface ColorPickerProps {
  label?: string
  value?: string
  defaultValue?: string
  helperText?: string
  error?: string
  allowGradient?: boolean
  allowAlpha?: boolean
  presets?: string[]
  onChange?: (color: string) => void
  onLiveChange?: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  defaultValue = '#000000',
  helperText,
  error,
  allowGradient = true,
  allowAlpha = true,
  presets = DEFAULT_PRESETS,
  onChange,
  onLiveChange,
}) => {
  const currentColor = value !== undefined ? value : defaultValue

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'solid' | 'gradient'>(
    isGradient(currentColor) ? 'gradient' : 'solid',
  )
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex')

  // Local text value in the trigger input (committed on blur or Enter)
  const [localText, setLocalText] = useState(currentColor)

  // Internal HSV representation for solid color
  const initialRgb = parseColorToRgb(
    isGradient(currentColor) ? '#3B82F6' : currentColor,
  )
  const [hsv, setHsv] = useState<HSV>(
    rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b, initialRgb.a),
  )

  // Keep a synchronous ref of current HSV for drag operations
  const latestHsvRef = useRef<HSV>(hsv)
  latestHsvRef.current = hsv

  // Gradient state
  const [gradientAngle, setGradientAngle] = useState('135deg')
  const [gradientStart, setGradientStart] = useState('#3B82F6')
  const [gradientEnd, setGradientEnd] = useState('#1D4ED8')

  const containerRef = useRef<HTMLDivElement>(null)
  const satBoxRef = useRef<HTMLDivElement>(null)
  const hueTrackRef = useRef<HTMLDivElement>(null)
  const alphaTrackRef = useRef<HTMLDivElement>(null)

  // Sync external value changes
  useEffect(() => {
    setLocalText(currentColor)
    if (!isGradient(currentColor)) {
      const rgb = parseColorToRgb(currentColor)
      const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b, rgb.a)
      setHsv(nextHsv)
      latestHsvRef.current = nextHsv
    }
  }, [currentColor])

  // Close on outside click and commit any pending edits
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  // Helper to compute hex from HSV
  const getHexFromHsv = (targetHsv: HSV): string => {
    const rgb = hsvToRgb(targetHsv.h, targetHsv.s, targetHsv.v, targetHsv.a)
    return rgbToHex(rgb.r, rgb.g, rgb.b, targetHsv.a)
  }

  // Commit value to onChange (fires only on mouseup, blur, enter, or preset click)
  const commitHsv = useCallback(
    (targetHsv: HSV) => {
      const hex = getHexFromHsv(targetHsv)
      setLocalText(hex)
      onChange?.(hex)
    },
    [onChange],
  )

  const commitValue = useCallback(
    (val: string) => {
      setLocalText(val)
      onChange?.(val)
    },
    [onChange],
  )

  // 1. Saturation / Brightness drag
  // During drag: updates local UI state only (no heavy store / canvas re-render)
  // On mouseup: commits once to onChange
  const handleSatMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const updateSatVal = (event: MouseEvent | React.MouseEvent) => {
      if (!satBoxRef.current) return
      const rect = satBoxRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
      const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top))

      const s = Math.round((x / rect.width) * 100)
      const v = Math.round((1 - y / rect.height) * 100)

      const nextHsv = { ...latestHsvRef.current, s, v }
      latestHsvRef.current = nextHsv
      setHsv(nextHsv)
      setLocalText(getHexFromHsv(nextHsv))
      onLiveChange?.(getHexFromHsv(nextHsv))
    }

    updateSatVal(e)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateSatVal(moveEvent)
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      // Commit once when sliding hold button is released
      commitHsv(latestHsvRef.current)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // 2. Hue Rainbow Slider drag
  // During drag: updates local UI state only
  // On mouseup: commits once to onChange
  const handleHueMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const updateHue = (event: MouseEvent | React.MouseEvent) => {
      if (!hueTrackRef.current) return
      const rect = hueTrackRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
      const h = Math.round((x / rect.width) * 360)

      const nextHsv = { ...latestHsvRef.current, h: h >= 360 ? 0 : h }
      latestHsvRef.current = nextHsv
      setHsv(nextHsv)
      setLocalText(getHexFromHsv(nextHsv))
      onLiveChange?.(getHexFromHsv(nextHsv))
    }

    updateHue(e)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateHue(moveEvent)
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      // Commit once when sliding hold button is released
      commitHsv(latestHsvRef.current)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // 3. Alpha Opacity Slider drag
  // During drag: updates local UI state only
  // On mouseup: commits once to onChange
  const handleAlphaMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const updateAlpha = (event: MouseEvent | React.MouseEvent) => {
      if (!alphaTrackRef.current) return
      const rect = alphaTrackRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
      const a = Math.round((x / rect.width) * 100) / 100

      const nextHsv = { ...latestHsvRef.current, a }
      latestHsvRef.current = nextHsv
      setHsv(nextHsv)
      setLocalText(getHexFromHsv(nextHsv))
      onLiveChange?.(getHexFromHsv(nextHsv))
    }

    updateAlpha(e)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateAlpha(moveEvent)
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      // Commit once when sliding hold button is released
      commitHsv(latestHsvRef.current)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // Native EyeDropper API
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper()
        const result = await eyeDropper.open()
        if (result?.sRGBHex) {
          const rgb = parseColorToRgb(result.sRGBHex)
          const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b, 1)
          setHsv(nextHsv)
          latestHsvRef.current = nextHsv
          commitHsv(nextHsv)
        }
      } catch (err) {
        // user dismissed
      }
    }
  }

  // Trigger input typing
  const handleTriggerInputChange = (val: string) => {
    setLocalText(val)
    if (!isGradient(val)) {
      const rgb = parseColorToRgb(val)
      const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b, rgb.a)
      setHsv(nextHsv)
      latestHsvRef.current = nextHsv
    }
  }

  const handleTriggerInputBlur = () => {
    if (localText !== currentColor) {
      commitValue(localText)
    }
  }

  const handleTriggerInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      commitValue(localText)
      setIsOpen(false)
    }
  }

  const currentRgb = hsvToRgb(hsv.h, hsv.s, hsv.v, hsv.a)
  const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b, hsv.a)
  const currentHsl = rgbToHsl(currentRgb.r, currentRgb.g, currentRgb.b, hsv.a)
  const pureHueHex = rgbToHex(
    ...(Object.values(hsvToRgb(hsv.h, 100, 100, 1)).slice(0, 3) as [
      number,
      number,
      number,
    ]),
  )

  const handleGradientAngleChange = (angle: string) => {
    setGradientAngle(angle)
    const gradStr = `linear-gradient(${angle}, ${gradientStart} 0%, ${gradientEnd} 100%)`
    commitValue(gradStr)
  }

  return (
    <RootContainer ref={containerRef}>
      {/* 1. Reusable Primitive Input Component as Trigger */}
      <Input
        label={label}
        variant="default"
        value={localText}
        error={error}
        helperText={helperText}
        placeholder="#000000"
        onChange={(e: any) =>
          handleTriggerInputChange((e.target as HTMLInputElement).value)
        }
        onBlur={handleTriggerInputBlur}
        onKeyDown={handleTriggerInputKeyDown}
        onFocus={() => setIsOpen(true)}
        startAdornment={
          <SwatchChip
            type="button"
            color={localText}
            title="Open color picker"
            onClick={() => setIsOpen(!isOpen)}
          />
        }
        endAdornment={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {'EyeDropper' in window && (
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                title="Sample color from screen"
                onClick={handleEyeDropper}
              >
                <PaintBoardIcon size={14} />
              </IconButton>
            )}
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              title={isOpen ? 'Close' : 'Open'}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <ArrowUp01Icon size={14} />
              ) : (
                <ArrowDown01Icon size={14} />
              )}
            </IconButton>
          </div>
        }
      />

      {/* 2. Reusable Card Component as Popover */}
      {isOpen && (
        <PopoverCard variant="default" padding="sm">
          {allowGradient && (
            <TabsRow>
              <Button
                type="button"
                size="sm"
                variant={activeTab === 'solid' ? 'solid' : 'ghost'}
                color="secondary"
                style={{ flex: 1, padding: '4px' }}
                onClick={() => {
                  setActiveTab('solid')
                  commitHsv(latestHsvRef.current)
                }}
              >
                Solid
              </Button>
              <Button
                type="button"
                size="sm"
                variant={activeTab === 'gradient' ? 'solid' : 'ghost'}
                color="secondary"
                style={{ flex: 1, padding: '4px' }}
                onClick={() => {
                  setActiveTab('gradient')
                  const gradStr = `linear-gradient(${gradientAngle}, ${gradientStart} 0%, ${gradientEnd} 100%)`
                  commitValue(gradStr)
                }}
              >
                Gradient
              </Button>
            </TabsRow>
          )}

          {activeTab === 'solid' ? (
            <>
              {/* 2D Saturation / Brightness Box */}
              <SaturationBox
                ref={satBoxRef}
                hue={hsv.h}
                onMouseDown={handleSatMouseDown}
              >
                <SaturationHandle x={hsv.s} y={100 - hsv.v} />
              </SaturationBox>

              {/* Hue Rainbow Slider */}
              <HueTrack ref={hueTrackRef} onMouseDown={handleHueMouseDown}>
                <SliderHandle pos={(hsv.h / 360) * 100} />
              </HueTrack>

              {/* Alpha Opacity Slider */}
              {allowAlpha && (
                <AlphaTrack
                  ref={alphaTrackRef}
                  color={pureHueHex}
                  onMouseDown={handleAlphaMouseDown}
                >
                  <SliderHandle pos={hsv.a * 100} />
                </AlphaTrack>
              )}

              {/* Format Switcher & Numeric Inputs */}
              <FormatRow>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  style={{ padding: '2px 6px', fontSize: '10px' }}
                  onClick={() => {
                    setFormat(
                      format === 'hex'
                        ? 'rgb'
                        : format === 'rgb'
                          ? 'hsl'
                          : 'hex',
                    )
                  }}
                >
                  {format.toUpperCase()}
                </Button>

                {format === 'hex' && (
                  <ChannelGrid>
                    <ChannelBox>
                      <MiniInput
                        type="text"
                        value={currentHex}
                        onChange={(e) => {
                          const rgb = parseColorToRgb(e.target.value)
                          const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b, rgb.a)
                          setHsv(nextHsv)
                          latestHsvRef.current = nextHsv
                        }}
                        onBlur={() => commitHsv(latestHsvRef.current)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitHsv(latestHsvRef.current)
                        }}
                      />
                      <Typography variant="caption" color="secondary">
                        HEX
                      </Typography>
                    </ChannelBox>
                  </ChannelGrid>
                )}

                {format === 'rgb' && (
                  <ChannelGrid>
                    <ChannelBox>
                      <MiniInput
                        type="number"
                        min={0}
                        max={255}
                        value={currentRgb.r}
                        onChange={(e) => {
                          const r = parseInt(e.target.value, 10) || 0
                          const nextHsv = rgbToHsv(
                            r,
                            currentRgb.g,
                            currentRgb.b,
                            hsv.a,
                          )
                          setHsv(nextHsv)
                          latestHsvRef.current = nextHsv
                        }}
                        onBlur={() => commitHsv(latestHsvRef.current)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitHsv(latestHsvRef.current)
                        }}
                      />
                      <Typography variant="caption" color="secondary">
                        R
                      </Typography>
                    </ChannelBox>
                    <ChannelBox>
                      <MiniInput
                        type="number"
                        min={0}
                        max={255}
                        value={currentRgb.g}
                        onChange={(e) => {
                          const g = parseInt(e.target.value, 10) || 0
                          const nextHsv = rgbToHsv(
                            currentRgb.r,
                            g,
                            currentRgb.b,
                            hsv.a,
                          )
                          setHsv(nextHsv)
                          latestHsvRef.current = nextHsv
                        }}
                        onBlur={() => commitHsv(latestHsvRef.current)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitHsv(latestHsvRef.current)
                        }}
                      />
                      <Typography variant="caption" color="secondary">
                        G
                      </Typography>
                    </ChannelBox>
                    <ChannelBox>
                      <MiniInput
                        type="number"
                        min={0}
                        max={255}
                        value={currentRgb.b}
                        onChange={(e) => {
                          const b = parseInt(e.target.value, 10) || 0
                          const nextHsv = rgbToHsv(
                            currentRgb.r,
                            currentRgb.g,
                            b,
                            hsv.a,
                          )
                          setHsv(nextHsv)
                          latestHsvRef.current = nextHsv
                        }}
                        onBlur={() => commitHsv(latestHsvRef.current)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitHsv(latestHsvRef.current)
                        }}
                      />
                      <Typography variant="caption" color="secondary">
                        B
                      </Typography>
                    </ChannelBox>
                    {allowAlpha && (
                      <ChannelBox>
                        <MiniInput
                          type="number"
                          min={0}
                          max={100}
                          value={Math.round(hsv.a * 100)}
                          onChange={(e) => {
                            const a = (parseInt(e.target.value, 10) || 0) / 100
                            const nextHsv = { ...latestHsvRef.current, a }
                            setHsv(nextHsv)
                            latestHsvRef.current = nextHsv
                          }}
                          onBlur={() => commitHsv(latestHsvRef.current)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter')
                              commitHsv(latestHsvRef.current)
                          }}
                        />
                        <Typography variant="caption" color="secondary">
                          A%
                        </Typography>
                      </ChannelBox>
                    )}
                  </ChannelGrid>
                )}

                {format === 'hsl' && (
                  <ChannelGrid>
                    <ChannelBox>
                      <MiniInput
                        type="number"
                        min={0}
                        max={360}
                        value={currentHsl.h}
                        onChange={(e) => {
                          const h = parseInt(e.target.value, 10) || 0
                          const rgb = hslToRgb(
                            h,
                            currentHsl.s,
                            currentHsl.l,
                            hsv.a,
                          )
                          const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b, hsv.a)
                          setHsv(nextHsv)
                          latestHsvRef.current = nextHsv
                        }}
                        onBlur={() => commitHsv(latestHsvRef.current)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitHsv(latestHsvRef.current)
                        }}
                      />
                      <Typography variant="caption" color="secondary">
                        H
                      </Typography>
                    </ChannelBox>
                    <ChannelBox>
                      <MiniInput
                        type="number"
                        min={0}
                        max={100}
                        value={currentHsl.s}
                        onChange={(e) => {
                          const s = parseInt(e.target.value, 10) || 0
                          const rgb = hslToRgb(
                            currentHsl.h,
                            s,
                            currentHsl.l,
                            hsv.a,
                          )
                          const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b, hsv.a)
                          setHsv(nextHsv)
                          latestHsvRef.current = nextHsv
                        }}
                        onBlur={() => commitHsv(latestHsvRef.current)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitHsv(latestHsvRef.current)
                        }}
                      />
                      <Typography variant="caption" color="secondary">
                        S%
                      </Typography>
                    </ChannelBox>
                    <ChannelBox>
                      <MiniInput
                        type="number"
                        min={0}
                        max={100}
                        value={currentHsl.l}
                        onChange={(e) => {
                          const l = parseInt(e.target.value, 10) || 0
                          const rgb = hslToRgb(
                            currentHsl.h,
                            currentHsl.s,
                            l,
                            hsv.a,
                          )
                          const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b, hsv.a)
                          setHsv(nextHsv)
                          latestHsvRef.current = nextHsv
                        }}
                        onBlur={() => commitHsv(latestHsvRef.current)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitHsv(latestHsvRef.current)
                        }}
                      />
                      <Typography variant="caption" color="secondary">
                        L%
                      </Typography>
                    </ChannelBox>
                  </ChannelGrid>
                )}
              </FormatRow>

              {/* Presets Grid */}
              {presets.length > 0 && (
                <PresetsGrid>
                  {presets.map((color, idx) => (
                    <PresetChip
                      key={idx}
                      type="button"
                      color={color}
                      title={color}
                      onClick={() => {
                        const rgb = parseColorToRgb(color)
                        const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b, rgb.a)
                        setHsv(nextHsv)
                        latestHsvRef.current = nextHsv
                        commitHsv(nextHsv)
                      }}
                    />
                  ))}
                </PresetsGrid>
              )}
            </>
          ) : (
            /* Gradient Controls */
            <>
              <div
                style={{
                  height: '48px',
                  borderRadius: theme.radius.sm,
                  background: `linear-gradient(${gradientAngle}, ${gradientStart} 0%, ${gradientEnd} 100%)`,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.xs,
                }}
              >
                <Typography variant="caption" weight="medium">
                  Angle
                </Typography>
                <GradientAngleGrid>
                  {[
                    '0deg',
                    '45deg',
                    '90deg',
                    '135deg',
                    '180deg',
                    '225deg',
                    '270deg',
                    '315deg',
                  ].map((ang) => (
                    <Button
                      key={ang}
                      type="button"
                      size="sm"
                      variant={gradientAngle === ang ? 'solid' : 'outline'}
                      color="secondary"
                      style={{ padding: '4px', fontSize: '10px' }}
                      onClick={() => handleGradientAngleChange(ang)}
                    >
                      {ang}
                    </Button>
                  ))}
                </GradientAngleGrid>
              </div>

              <div style={{ display: 'flex', gap: theme.spacing.xs }}>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <Typography variant="caption" color="secondary">
                    Start Color
                  </Typography>
                  <MiniInput
                    type="text"
                    value={gradientStart}
                    onChange={(e) => setGradientStart(e.target.value)}
                    onBlur={() => {
                      commitValue(
                        `linear-gradient(${gradientAngle}, ${gradientStart} 0%, ${gradientEnd} 100%)`,
                      )
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        commitValue(
                          `linear-gradient(${gradientAngle}, ${gradientStart} 0%, ${gradientEnd} 100%)`,
                        )
                      }
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <Typography variant="caption" color="secondary">
                    End Color
                  </Typography>
                  <MiniInput
                    type="text"
                    value={gradientEnd}
                    onChange={(e) => setGradientEnd(e.target.value)}
                    onBlur={() => {
                      commitValue(
                        `linear-gradient(${gradientAngle}, ${gradientStart} 0%, ${gradientEnd} 100%)`,
                      )
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        commitValue(
                          `linear-gradient(${gradientAngle}, ${gradientStart} 0%, ${gradientEnd} 100%)`,
                        )
                      }
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.xs,
                }}
              >
                <Typography variant="caption" weight="medium">
                  Presets
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {GRADIENT_PRESETS.map((grad, idx) => (
                    <button
                      key={idx}
                      type="button"
                      style={{
                        height: '24px',
                        borderRadius: theme.radius.sm,
                        border: `1px solid ${theme.colors.border}`,
                        background: grad,
                        cursor: 'pointer',
                      }}
                      onClick={() => commitValue(grad)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </PopoverCard>
      )}
    </RootContainer>
  )
}
