# Managing Sections & Blocks

> **A Comprehensive Specification for Schema-Driven, Type-Safe React Theme Components in Shopiti.**  
> Inspired by **Shopify Liquid Sections & Blocks (Dawn 2.0)**, engineered for **React 19, TypeScript, and Emotion**.

---

## 1. Core Architectural Distinctions

Every visual UI component in a Shopiti theme strictly belongs to one of three categories:

```
Theme Component Taxonomy
├── 1. Sections  (themes/[theme]/sections/[name]/) -> High-level page modules with .schema.ts
├── 2. Blocks    (themes/[theme]/blocks/[name]/)   -> Nested, reorderable children with .schema.ts
└── 3. Snippets  (themes/[theme]/snippets/[name]/) -> Developer UI helpers with NO schema
```

| Trait | Section | Block | Snippet |
| :--- | :--- | :--- | :--- |
| **Location** | `themes/[theme]/sections/[name]/` | `themes/[theme]/blocks/[name]/` | `themes/[theme]/snippets/[name]/` |
| **Has Schema?** | **YES** (`[Name].schema.ts`) | **YES** (`[Name].schema.ts`) | **NO** (Strictly forbidden) |
| **Theme Customizer** | Top-level item in page layer tree | Nested item under parent section | Invisible in customizer |
| **Reorderable?** | Yes, anywhere in page body | Yes, inside parent section | Rendered statically in code |
| **Props Contract** | `SectionComponentProps<T>` | `BlockComponentProps<T>` | Custom React Props interface |
| **Persistence** | `templates/*.json` -> `sections[id]` | `templates/*.json` -> `blocks[id]` | No direct persistence |
| **Example Use Cases**| `HeroBanner`, `FeaturedCollection`, `ImageWithText` | `Heading`, `Button`, `Slide`, `AccordionItem` | `PriceDisplay`, `Badge`, `Icon`, `QuantityInput` |

---

## 2. Directory Colocation Standard

Every Section and Block MUST be organized in its own self-contained folder:

```text
themes/dawn/sections/hero-banner/
├── HeroBanner.tsx            # Pure React component receiving settings & blocks
├── HeroBanner.schema.ts      # SectionSchema definition with controls & presets
└── index.ts                  # Public re-export for the theme registry
```

```text
themes/dawn/blocks/button/
├── ButtonBlock.tsx           # Pure React component receiving settings
├── ButtonBlock.schema.ts     # BlockSchema definition
└── index.ts                  # Public re-export
```

---

## 3. Section Schema Specification

A Section Schema defines how the visual inspector renders controls in the Theme Customizer and sets limits on where and how the section can be used.

```ts
import type { SectionSchema } from '#themes/shared/types/theme'

export const HeroBannerSchema: SectionSchema = {
  // 1. Identification
  type: 'hero-banner',
  name: 'Hero Banner',
  category: 'Hero',
  description: 'An immersive full-width banner with background image, headings, and CTAs.',
  icon: 'lucide:layout-template',

  // 2. HTML Semantics & Layout
  tag: 'section',
  class: 'hero-banner-section',
  limit: 2, // Maximum 2 instances of this section per template

  // 3. Template Restrictions (Shopify enabled_on / disabled_on)
  enabled_on: {
    templates: ['index', 'page', 'product'], // Only selectable on these templates
  },
  disabled_on: {
    templates: ['password', 'cart'], // Prohibited on password or cart
  },

  // 4. Section-Level Editable Settings
  settings: [
    {
      type: 'header',
      content: 'Background & Media',
    },
    {
      type: 'image_picker',
      id: 'image',
      label: 'Desktop Background Image',
      info: 'Recommended size: 2880 x 1200px',
    },
    {
      type: 'image_picker',
      id: 'image_mobile',
      label: 'Mobile Background Image',
      info: 'Optional mobile override: 750 x 1000px',
    },
    {
      type: 'range',
      id: 'image_overlay_opacity',
      label: 'Image Overlay Opacity',
      min: 0,
      max: 90,
      step: 5,
      unit: '%',
      default: 20,
    },
    {
      type: 'header',
      content: 'Color Scheme & Alignment',
    },
    {
      type: 'color_scheme',
      id: 'color_scheme',
      label: 'Color Scheme',
      default: 'scheme-1',
    },
    {
      type: 'select',
      id: 'content_alignment',
      label: 'Desktop Content Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      default: 'center',
    },
    {
      type: 'header',
      content: 'Section Spacing',
    },
    {
      type: 'spacing',
      id: 'padding',
      label: 'Section Padding',
      default: { top: 60, right: 0, bottom: 60, left: 0 },
    },
  ],

  // 5. Allowed Child Blocks
  blocks: [
    {
      type: 'heading',
      name: 'Heading',
      limit: 1, // Only 1 heading block allowed
      settings: [/* ... */],
    },
    {
      type: 'text',
      name: 'Subheading / Text',
      limit: 2,
      settings: [/* ... */],
    },
    {
      type: 'button',
      name: 'Action Button',
      limit: 2,
      settings: [/* ... */],
    },
  ],
  max_blocks: 5, // Total child blocks limit

  // 6. Section Presets (1-Click Insertion Templates)
  presets: [
    {
      name: 'Standard Hero Banner',
      category: 'Hero',
      settings: {
        color_scheme: 'scheme-3',
        content_alignment: 'center',
      },
      blocks: [
        {
          type: 'heading',
          settings: { text: 'Elevate Your Everyday Style', size: 'h1' },
        },
        {
          type: 'text',
          settings: { text: 'Explore our latest arrivals crafted from sustainably sourced materials.' },
        },
        {
          type: 'button',
          settings: { label: 'Shop New Arrivals', link: '/collections/new', style: 'primary' },
        },
      ],
    },
  ],
}
```

---

## 4. Exhaustive Setting Types Taxonomy (6 Tiers)

The customizer inspector renders visual controls dynamically according to the `type` field of each `SettingDefinition`:

### Tier 1: Primitives & Basic Form Controls
- **`text`**: Single-line text input (`placeholder`, `maxlength`).
- **`textarea`**: Multi-line text area (`rows`, `placeholder`).
- **`number`**: Numeric input stepper (`min`, `max`, `step`).
- **`range`**: Visual slider bar with badge indicator (`min`, `max`, `step`, `unit`).
- **`checkbox`**: Standard boolean toggle checkbox.
- **`switch`**: Modern visual on/off switch toggle.
- **`select`**: Dropdown select menu (`options: Array<{ label, value, group? }>`).
- **`radio`**: Radio button choice group.
- **`button_group`**: Segmented pill button group (e.g. alignment: `Left | Center | Right`).

### Tier 2: Rich Media & Assets
- **`image_picker`**: Media Library asset selector with upload, browse, focal point, and alt text.
- **`video`**: Uploaded direct video (MP4/WebM) with poster and autoplay toggles.
- **`video_url`**: External video embed parser (YouTube / Vimeo URL parser).
- **`icon_picker`**: Curated SVG icon selector (Lucide / Phosphor).
- **`file_picker`**: Document download link (PDF, spec sheets, ZIP).

### Tier 3: Rich Content & Typography
- **`inline_richtext`**: Lightweight WYSIWYG for titles allowing bold, italic, and inline links without wrapping `<p>` tags.
- **`richtext`**: Full WYSIWYG editor (Headings, Paragraphs, Lists, Quotes, Links).
- **`html`**: Raw HTML embed code editor with syntax highlighting.
- **`liquid`**: Dynamic template token editor (`{{ product.title }}`).

### Tier 4: Design System & Styling Controls
- **`color`**: Direct HEX/RGBA color picker.
- **`color_scheme`**: Scheme dropdown selecting from global 5-scheme matrix (`scheme-1`, `scheme-2`...).
- **`color_background`**: Gradient or solid background color picker.
- **`font_picker`**: Font family selector with weight and style options.
- **`spacing`**: 4-side box model editor (Top, Right, Bottom, Left in px or rem).
- **`alignment`**: Visual 2D/3D alignment grid (Top-Left, Center, Bottom-Right).
- **`aspect_ratio`**: Media ratio picker (`16:9`, `4:3`, `1:1`, `adapt-to-image`).
- **`border_radius`**: Corner curvature slider or preset selector.
- **`shadow`**: Elevation drop-shadow preset selector (none, sm, md, lg, xl).

### Tier 5: Headless Commerce & Dynamic Pickers
- **`product`**: Single product picker dropdown / modal searching the catalog.
- **`product_list`**: Multi-product selector with drag-and-drop reordering.
- **`collection`**: Collection category picker dropdown / modal.
- **`collection_list`**: Multi-collection selector.
- **`page`**: CMS static page picker.
- **`menu`**: Navigation menu hierarchy picker.
- **`url`**: Omnibox link picker supporting internal routes, products, collections, anchors, and external URLs.

### Tier 6: UI Organization & Structure
- **`header`**: Visual typography separator dividing settings into distinct logical groups.
- **`paragraph`**: Descriptive instructional text rendering helper in the sidebar.
- **`divider`**: Subtle horizontal rule line separating inspector fields.
- **`group`**: Collapsible accordion grouping related settings together.
- **`tabs`**: Tabbed layout inside the inspector sidebar (e.g. "Layout", "Style", "Advanced").
- **`repeater`**: Inline array repeater for lightweight items without requiring blocks.

---

## 5. Conditional Visibility Engine (`visible_if`)

Prevent clutter in the inspector by showing settings only when relevant preconditions are met:

```ts
// Example: Show 'badge_color' only when 'show_badge' is true
{
  type: 'checkbox',
  id: 'show_badge',
  label: 'Display Discount Badge',
  default: false,
},
{
  type: 'color',
  id: 'badge_color',
  label: 'Badge Background Color',
  default: '#DC2626',
  visible_if: {
    setting: 'show_badge',
    operator: '==',
    value: true,
  },
}
```

The engine also supports compound logic (`and` / `or`):

```ts
visible_if: {
  operator: 'and',
  conditions: [
    { setting: 'enable_custom_styling', operator: '==', value: true },
    { setting: 'banner_type', operator: '!=', value: 'minimal' },
  ],
}
```

---

## 6. Blocks: Purpose, Reordering & Container Blocks

### Why Use Blocks?
Sections are high-level structural containers. Without blocks, adding a button, heading, or accordion item would require hardcoding JSX in the section.

By delegating content to blocks:
1. **Reorderability:** The merchant can drag the "Heading" below the "Button" or above an "Image".
2. **Add / Delete:** The merchant can add 3, 5, or 8 testimonial quotes or FAQ items.
3. **Granular Controls:** Each block has its own isolated settings schema.

### Rendering Blocks Inside a Section:

```tsx
import React from 'react'
import type { SectionComponentProps } from '#themes/shared/types/theme'
import { AnnouncementBlock } from '#themes/dawn/blocks/announcement'
import { ButtonBlock } from '#themes/dawn/blocks/button'
import { HeadingBlock } from '#themes/dawn/blocks/heading'

export const HeroBanner: React.FC<SectionComponentProps<HeroSettings>> = ({
  settings,
  blocks = {},
  blockOrder = [],
  isEditor,
}) => {
  return (
    <section className={`color-${settings.color_scheme}`}>
      <div className="container">
        {/* Render child blocks in dynamic merchant order */}
        {blockOrder.map((blockId) => {
          const block = blocks[blockId]
          if (!block) return null

          switch (block.type) {
            case 'heading':
              return <HeadingBlock key={blockId} id={blockId} settings={block.settings} isEditor={isEditor} />
            case 'button':
              return <ButtonBlock key={blockId} id={blockId} settings={block.settings} isEditor={isEditor} />
            default:
              return null
          }
        })}
      </div>
    </section>
  )
}
```

### Container Blocks (Nested Blocks):
In advanced layouts (such as multi-column bento grids or flex rows), a block can act as a **container** that holds its own nested child blocks.

The `BlockSchema` supports:
```ts
export interface BlockSchema {
  type: string
  name: string
  settings: Array<SettingDefinition>
  /** Supported child blocks when this block acts as a container */
  blocks?: Array<BlockSchema>
  max_blocks?: number
}
```

This unlocks infinite nesting (e.g. `Section` -> `Column Block` -> `Card Block` -> `Button Block`).

---

## 7. Styling Standards with Emotion & CSS Variables

To ensure all sections look cohesive across different merchant stores and themes:

1. **Never hardcode primary colors:** Always use CSS custom properties or color scheme utility classes.
2. **Use Emotion styled components:**
   ```tsx
   import styled from '@emotion/styled'

   const SectionWrapper = styled.section<{ padding?: { top: number; bottom: number } }>`
     width: 100%;
     padding-top: ${({ padding }) => padding?.top ?? 60}px;
     padding-bottom: ${({ padding }) => padding?.bottom ?? 60}px;
     background-color: var(--color-background);
     color: var(--color-foreground);
     font-family: var(--font-body);

     h1, h2, h3 {
       font-family: var(--font-heading);
       letter-spacing: var(--heading-letter-spacing);
     }
   `
   ```
3. **Respect Color Scheme Classes:** Applying `className={`color-${settings.color_scheme}`}` automatically switches all text, background, and button colors within that section to the merchant's configured color scheme tokens!
