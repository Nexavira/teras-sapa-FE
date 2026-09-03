import * as React from 'react'

import styled from '@emotion/styled'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The orientation of the divider.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}

const StyledDivider = styled.div<DividerProps>`
  background-color: ${({ theme }) => theme.colors.border};
  flex-shrink: 0;

  ${({ orientation }) =>
    orientation === 'horizontal'
      ? `
        width: 100%;
        height: 1px;
      `
      : `
        height: auto;
        min-height: 100%;
        width: 1px;
        align-self: stretch;
      `}
`

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', ...props }, ref) => {
    return (
      <StyledDivider
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        orientation={orientation}
        {...props}
      />
    )
  },
)

Divider.displayName = 'Divider'
