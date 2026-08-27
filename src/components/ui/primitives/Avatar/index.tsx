import type { HTMLAttributes } from 'react'

import styled from '@emotion/styled'

import { theme } from '../../theme'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape = 'circle' | 'rounded' | 'square'
export type AvatarColor =
  'primary' | 'secondary' | 'green' | 'dark' | 'purple' | 'neutral'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  name?: string
  initials?: string
  size?: AvatarSize
  shape?: AvatarShape
  color?: AvatarColor
}

const getInitials = (name?: string) => {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const StyledAvatar = styled.div<{
  $size: AvatarSize
  $shape: AvatarShape
  $color: AvatarColor
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.weights.bold};
  flex-shrink: 0;
  user-select: none;
  overflow: hidden;

  /* Shapes */
  border-radius: ${({ $shape }) => {
    switch ($shape) {
      case 'circle':
        return theme.radius.full
      case 'rounded':
        return '6px'
      case 'square':
      default:
        return '4px'
    }
  }};

  /* Sizes */
  ${({ $size }) => {
    switch ($size) {
      case 'xs':
        return `
          width: 20px;
          height: 20px;
          font-size: 0.65rem;
        `
      case 'sm':
        return `
          width: 26px;
          height: 26px;
          font-size: 0.725rem;
        `
      case 'lg':
        return `
          width: 40px;
          height: 40px;
          font-size: 1rem;
        `
      case 'xl':
        return `
          width: 48px;
          height: 48px;
          font-size: 1.25rem;
        `
      case 'md':
      default:
        return `
          width: 32px;
          height: 32px;
          font-size: 0.85rem;
        `
    }
  }}

  /* Colors */
  ${({ $color }) => {
    switch ($color) {
      case 'green':
        return `
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: #FFFFFF;
        `
      case 'secondary':
        return `
          background: linear-gradient(135deg, #00A699 0%, #008489 100%);
          color: #FFFFFF;
        `
      case 'purple':
        return `
          background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
          color: #FFFFFF;
        `
      case 'dark':
        return `
          background: #303030;
          color: #E5E5E5;
        `
      case 'neutral':
        return `
          background: #E5E7EB;
          color: #374151;
        `
      case 'primary':
      default:
        return `
          background: linear-gradient(135deg, #FF5A5F 0%, #FF385C 100%);
          color: #FFFFFF;
        `
    }
  }}
`

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const Avatar = ({
  src,
  name,
  initials,
  size = 'md',
  shape = 'circle',
  color = 'primary',
  ...props
}: AvatarProps) => {
  const displayInitials = initials || getInitials(name)

  return (
    <StyledAvatar
      $size={size}
      $shape={shape}
      $color={color}
      title={name}
      {...props}
    >
      {src ? <AvatarImage src={src} alt={name || 'Avatar'} /> : displayInitials}
    </StyledAvatar>
  )
}
