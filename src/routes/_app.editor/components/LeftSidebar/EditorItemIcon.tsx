import React from 'react'

import {
  CursorPointer01Icon,
  Heading01Icon,
  Layers01Icon,
  LayoutTwoColumnIcon,
  Megaphone01Icon,
  Package01Icon,
  PaintBoardIcon,
  Store01Icon,
  TextIcon,
} from 'hugeicons-react'

interface EditorItemIconProps {
  type: string
  kind: 'section' | 'block'
  size?: number
}

export const EditorItemIcon: React.FC<EditorItemIconProps> = ({
  type,
  kind,
  size = 16,
}) => {
  if (kind === 'block') {
    switch (type) {
      case 'announcement':
        return <Megaphone01Icon size={size} />
      case 'heading':
        return <Heading01Icon size={size} />
      case 'text':
        return <TextIcon size={size} />
      case 'button':
        return <CursorPointer01Icon size={size} />
      case 'flex':
        return <LayoutTwoColumnIcon size={size} />
      default:
        return <Layers01Icon size={size} />
    }
  }

  switch (type) {
    case 'header':
      return <Store01Icon size={size} />
    case 'hero_banner':
      return <PaintBoardIcon size={size} />
    case 'featured_collection':
      return <Package01Icon size={size} />
    default:
      return <Layers01Icon size={size} />
  }
}
