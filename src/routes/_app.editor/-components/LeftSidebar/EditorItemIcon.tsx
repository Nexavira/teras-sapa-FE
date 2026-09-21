import React from 'react'

import {
  CursorPointer01Icon,
  Heading01Icon,
  Image01Icon,
  Layers01Icon,
  LayoutTwoColumnIcon,
  Link01Icon,
  Megaphone01Icon,
  Money03Icon,
  Package01Icon,
  PaintBoardIcon,
  ShoppingCart01Icon,
  Store01Icon,
  Tag01Icon,
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
      case 'editorial_heading':
      case 'product_title':
      case 'heading':
        return <Heading01Icon size={size} />
      case 'editorial_eyebrow':
      case 'editorial_text':
      case 'text':
        return <TextIcon size={size} />
      case 'button':
        return <CursorPointer01Icon size={size} />
      case 'editorial_image':
      case 'product_image':
        return <Image01Icon size={size} />
      case 'editorial_link':
        return <Link01Icon size={size} />
      case 'featured_product':
        return <Package01Icon size={size} />
      case 'product_badge':
      case 'product_category':
        return <Tag01Icon size={size} />
      case 'product_price':
        return <Money03Icon size={size} />
      case 'product_quick_add':
        return <ShoppingCart01Icon size={size} />
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
    case 'image_with_text':
      return <LayoutTwoColumnIcon size={size} />
    case 'featured_collection':
      return <Package01Icon size={size} />
    default:
      return <Layers01Icon size={size} />
  }
}
