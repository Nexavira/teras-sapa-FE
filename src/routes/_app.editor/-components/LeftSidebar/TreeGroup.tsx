import type { ReactNode } from 'react'

import { SectionWrapper } from '#/-components/ui/layout/AdminLayout/-components/SectionWrapper'

export interface TreeGroupProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export const TreeGroup = ({
  title,
  children,
  defaultOpen = true,
  className,
}: TreeGroupProps) => (
  <SectionWrapper label={title} defaultOpen={defaultOpen} className={className}>
    {children}
  </SectionWrapper>
)
