---
trigger: model_decision
description: Strict rules and architectural guidelines for developing themes, sections, blocks, snippets, layouts, and customizer components.
---

<RULE[theme]>

# Theme Development Rules & Guidelines

All theme development in this project MUST strictly follow the React-based Shopify Dawn architectural model, with strict separation between data, schema, and presentation.

---

## 1. Core Architectural Distinctions: Sections vs. Snippets vs. Blocks

Developers MUST adhere to the following strict distinctions when organizing code in `themes/`:

### A. Sections (`themes/sections/`)

- **Definition:** High-level, modular layout components that form the backbone of pages (e.g., `Header`, `HeroBanner`, `FeaturedCollection`, `Footer`).
- **Merchant-Facing & Schema-Driven:** Every section MUST have an accompanying `.schema.ts` file exporting its `SectionSchema`.
- **Theme Customizer Visibility:** Sections are directly visible, editable, reorderable, addable, and removable by merchants in the visual customizer.
- **Data Persistence:** Section instances, their settings, and their block orders are saved in page template JSON (`themes/templates/*.json`).
- **Registration:** Every section MUST be registered in `themes/registry.ts` (`SectionRegistry`).

### B. Snippets (`themes/snippets/`)

- **Definition:** Purely developer-facing, reusable UI elements, icons, or rendering helpers (e.g., `PriceDisplay`, `Icon`, `ProductCard`, `RatingStars`, `QuantitySelector`).
- **NO Schemas:** Snippets MUST NOT have a `.schema.ts` file and MUST NOT appear as standalone items in the Theme Customizer.
- **Props-Driven:** Snippets receive data strictly via standard React props passed by parent Sections, Blocks, or Layouts.
- **Purpose:** Used to keep code DRY (Don't Repeat Yourself) and break down large section components into clean, reusable pieces across multiple sections.

### C. Blocks (`themes/blocks/`)

- **Definition:** Nested, reorderable child components that live _inside_ a parent Section (e.g., `Announcement`, `Slide`, `HeadingBlock`, `ButtonBlock`).
- **Schema-Driven:** Blocks have their own `BlockSchema` with editable settings.
- **Section Scope:** Blocks only render within sections that explicitly declare support for that block type in `SectionSchema.blocks`.

### D. Master Layout (`themes/layout/`)

- **Definition:** Top-level master page wrapper (`ThemeLayout.tsx`), equivalent to Shopify's `layout/theme.liquid`.
- **Global Injections:** Reads `themes/config/settings_data.json` and injects global CSS variables into `:root` (`--color-bg`, `--font-heading`, etc.).
- **Structure:** Encapsulates the Header Section Group, dynamic page content (`children` / `content_for_layout`), and Footer Section Group.

---

## 2. Summary Comparison Matrix

| Aspect                  | Section (`themes/sections/`)                  | Snippet (`themes/snippets/`)              | Block (`themes/blocks/`)                    |
| :---------------------- | :-------------------------------------------- | :---------------------------------------- | :------------------------------------------ |
| **Target Audience**     | Merchants (via visual editor)                 | Developers (code reuse)                   | Merchants (nested in section)               |
| **Has Schema?**         | **YES** (`[Name].schema.ts`)                  | **NO** (Strictly prohibited)              | **YES** (`[Name].schema.ts`)                |
| **Customizer Visible?** | **YES** (Listed in layer tree)                | **NO** (Not listed)                       | **YES** (Under parent section)              |
| **How It's Rendered**   | Template JSON + `ThemeRenderer`               | Standard React `<SnippetName />`          | Iterated via `section.blockOrder`           |
| **Settings Storage**    | `templates/*.json` -> `sections[id].settings` | Passed as React props                     | `templates/*.json` -> `blocks[id].settings` |
| **Example Use Cases**   | `Header`, `ImageBanner`, `ProductGrid`        | `Price`, `Badge`, `Icon`, `QuantityInput` | `Announcement`, `Slide`, `Button`           |

---

## 3. Strict Development Standards

1. **Styling Standards:**
   - ALL component styling inside `themes/` MUST use Emotion (`@emotion/styled` and `@emotion/react`).
   - Global styling tokens MUST use CSS variables injected into `:root` from `themes/config/settings_data.json`.
   - Hardcoded hex codes for primary backgrounds or typography MUST be avoided in favor of theme settings or CSS variables.

2. **TypeScript & Type-Only Imports:**
   - All theme files MUST use strict TypeScript typing referencing `themes/types/theme.ts`.
   - With `verbatimModuleSyntax` enabled, all type imports MUST use `import type { ... }`.

3. **Template & Data Integrity:**
   - Templates in `themes/templates/` MUST remain pure JSON data objects (`sections`, `order`, `blocks`, `block_order`).
   - Hardcoded presentation markup inside template JSON is strictly prohibited.

4. **Colocation & Modularity:**
   - Sections must be colocated in their own folder: `themes/sections/[section-name]/` containing `[Section].tsx`, `[Section].schema.ts`, and `index.ts`.
   - Blocks must be colocated in `themes/blocks/[block-name]/`.
   - Snippets must reside in `themes/snippets/[snippet-name]/` or `themes/snippets/`.

</RULE[theme]>
