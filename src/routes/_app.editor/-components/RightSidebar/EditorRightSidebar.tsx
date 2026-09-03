import React from 'react'

import { DynamicFormInspector } from './DynamicFormInspector'

export interface EditorRightSidebarProps {
  className?: string
}

export const EditorRightSidebar: React.FC<EditorRightSidebarProps> = ({
  className,
}) => {
  return <DynamicFormInspector className={className} />
}
