# Managing Pages & JSON Templates

> **A Complete Guide to Template Hierarchy, Alternate Templates, Route Resolution, and Contextual Data Injection in Shopiti.**  
> Modeled after **Shopify Online Store 2.0 JSON Templates**, optimized for **React Headless Commerce**.

---

## 1. Overview & Architectural Philosophy

In traditional static site generators, pages are hardcoded files containing mixed markup and copy. In contrast, the Shopiti Theme Engine implements **Shopify's JSON Template Model**:

1. **Pages are pure data:** A template file (`templates/*.json`) contains zero presentation HTML. It simply defines a list of section instances, their custom settings, and their child block order.
2. **Templates are reusable blueprints:** A single template (e.g. `product.json`) can render thousands of individual products. The layout is determined by the template, while the content is hydrated dynamically from the product catalog API.
3. **Merchants control layout without code:** Merchants can add, delete, reorder, and hide sections on any page through the Theme Customizer without writing a single line of React.

```mermaid
graph LR
    subgraph "Headless Route Resolution"
        URL["/products/classic-leather-jacket"] --> ROUTER[TanStack Router]
        ROUTER --> API[Backend Catalog API]
        API -->|Fetches Product Model| DATA[Product Data: { id, title, price, template_suffix }]
    end

    subgraph "Template Selection"
        DATA --> RESOLVE{template_suffix?}
        RESOLVE -->|'preorder'| T_PRE[templates/product.preorder.json]
        RESOLVE -->|null / ''| T_DEF[templates/product.json]
    end

    subgraph "Hydration & Rendering"
        T_DEF --> RENDERER[ThemeRenderer Engine]
        DATA --> CONTEXT[ProductContext Provider]
        CONTEXT --> RENDERER
        RENDERER --> DOM[Interactive Storefront Page]
    end
```

---

## 2. Standard Template Hierarchy

Shopify defines standard template names for every core e-commerce entity. Shopiti follows this taxonomy:

| Template Name      | Target Route            | Purpose                                                   | Context Provided                                     |
| :----------------- | :---------------------- | :-------------------------------------------------------- | :--------------------------------------------------- |
| `index.json`       | `/`                     | Storefront Homepage                                       | Global store metadata, marketing banners             |
| `product.json`     | `/products/:handle`     | Default Product Detail Page (PDP)                         | Active `Product` entity (variants, media, inventory) |
| `collection.json`  | `/collections/:handle`  | Collection / Catalog Listing Page (PLP)                   | Active `Collection` entity, paginated product list   |
| `page.json`        | `/pages/:slug`          | Default Generic Static Page                               | Active `Page` entity (title, body HTML)              |
| `blog.json`        | `/blogs/:blog`          | Blog Index / Post List                                    | Active `Blog` entity, paginated article list         |
| `article.json`     | `/blogs/:blog/:article` | Individual Editorial Article                              | Active `Article` entity (author, content, comments)  |
| `cart.json`        | `/cart`                 | Full Cart Page                                            | Active `Cart` entity (line items, discounts, totals) |
| `search.json`      | `/search`               | Predictive & Keyword Search Results                       | Active search query, filtered products, articles     |
| `404.json`         | `*` (Catch-all)         | Not Found Error Page                                      | Error state, suggested collections / links           |
| `customers/*.json` | `/account/*`            | Customer Portal (Login, Register, Account, Order Details) | Customer authentication session & order history      |

---

## 3. Alternate Templates (`[type].[suffix].json`)

A store often requires different layouts for the same resource type. For example:

- Most products use `product.json`, but high-ticket launch products require `product.launch.json` (with immersive video and interactive feature hotspots).
- Standard pages use `page.json`, but the Contact page requires `page.contact.json` (with contact forms and map sections), and the About page uses `page.about.json` (with company timeline and founder quote).

### How Alternate Templates Work

1. **File Naming Convention:** An alternate template is placed in `themes/[theme]/templates/` with the filename pattern:  
   `[resource_type].[suffix].json`  
   _(e.g., `page.about.json`, `page.contact.json`, `product.preorder.json`, `collection.lookbook.json`)_.
2. **Catalog Registration:** Export the alternate template in `themes/[theme]/templates/catalog.ts`:
   ```ts
   import aboutPage from './page.about.json'
   import contactPage from './page.contact.json'
   import productPreorder from './product.preorder.json'

   export const templateCatalog = {
     index: { label: 'Home page', data: indexTemplate },
     product: { label: 'Default Product', data: productTemplate },
     'product.preorder': { label: 'Pre-order Product', data: productPreorder },
     page: { label: 'Default Page', data: pageTemplate },
     'page.about': { label: 'About Us Page', data: aboutPage },
     'page.contact': { label: 'Contact Us Page', data: contactPage },
   }
   ```
3. **Merchant Assignment in Admin:** When an admin edits a Page or Product in the CMS, a **Theme Template** dropdown displays all registered templates matching that resource type. Setting `template_suffix: "contact"` binds that page to `page.contact.json`.

---

## 4. JSON Template Anatomy

Every template in `templates/*.json` adheres to strict serialization rules:

```json
{
  "name": "About Us Page",
  "layout": "theme",
  "wrapper": "div.about-page-wrapper",
  "sections": {
    "hero_banner": {
      "type": "hero-banner",
      "settings": {
        "heading": "Engineered for Excellence",
        "subheading": "Crafting premium products since 2018",
        "banner_height": "large",
        "color_scheme": "scheme-3",
        "padding_top": 80,
        "padding_bottom": 80
      },
      "block_order": ["heading_block", "button_block"],
      "blocks": {
        "heading_block": {
          "type": "heading",
          "settings": {
            "text": "Our Mission & Vision",
            "size": "h1"
          }
        },
        "button_block": {
          "type": "button",
          "settings": {
            "label": "Read Our Story",
            "link": "#story-timeline",
            "style": "primary"
          }
        }
      }
    },
    "company_metrics": {
      "type": "company-metrics",
      "settings": {
        "color_scheme": "scheme-1",
        "columns": 4
      },
      "block_order": ["metric_1", "metric_2", "metric_3", "metric_4"],
      "blocks": {
        "metric_1": {
          "type": "metric",
          "settings": { "value": "100K+", "label": "Active Customers" }
        },
        "metric_2": {
          "type": "metric",
          "settings": { "value": "99.8%", "label": "Satisfaction Rate" }
        },
        "metric_3": {
          "type": "metric",
          "settings": { "value": "24/7", "label": "Global Support" }
        },
        "metric_4": {
          "type": "metric",
          "settings": { "value": "50+", "label": "Countries Served" }
        }
      }
    }
  },
  "order": ["hero_banner", "company_metrics"]
}
```

### Key Field Descriptions:

- **`name`** _(string)_: Human-readable label displayed in the Theme Customizer top header dropdown.
- **`layout`** _(string, optional)_: Specifies the wrapper layout component (defaults to `"theme"` which maps to `ThemeLayout.tsx`). Can specify `"minimal"` or `"password"`.
- **`wrapper`** _(string, optional)_: Optional HTML element and class name wrapping `renderedSections` (e.g. `"main.product-page"`).
- **`sections`** _(Record<string, SectionInstance>)_: Map of section instance IDs to their type, settings, and blocks.
- **`order`** _(Array<string>)_: An ordered array of section IDs determining the top-to-bottom rendering order on the page.

---

## 5. Route Resolution & Headless Routing

In our TanStack Router storefront, page routes resolve dynamic templates cleanly:

```tsx
// src/routes/pages.$slug.tsx
import { createFileRoute } from '@tanstack/react-router'
import { PageRenderer } from '#/routes/preview/-components/PageRenderer'
import { useGetPageBySlug } from '#/services/page/useGetPage'

export const Route = createFileRoute('/pages/$slug')({
  component: DynamicPageRoute,
})

function DynamicPageRoute() {
  const { slug } = Route.useParams()
  const { data: page, isLoading } = useGetPageBySlug(slug)

  if (isLoading) return <PageLoadingSkeleton />
  if (!page) return <NotFoundPage />

  // 1. Resolve template: 'page.about' if suffix is 'about', fallback to 'page'
  const templateId = page.template_suffix
    ? `page.${page.template_suffix}`
    : 'page'

  // 2. Render through Theme Engine with Context
  return (
    <PageContextProvider value={page}>
      <PageRenderer templateId={templateId} />
    </PageContextProvider>
  )
}
```

---

## 6. Contextual Data Injection (Avoiding Prop Drilling)

In Shopify Liquid, global objects like `{{ product.title }}` or `{{ collection.products }}` are accessible automatically in templates. In React, we achieve identical ergonomics using **Context Providers**:

```tsx
// ProductContext.tsx
import { createContext, useContext } from 'react'
import type { Product } from '#/types/product'

const ProductContext = createContext<Product | null>(null)

export const useProductContext = () => {
  const context = useContext(ProductContext)
  return context // Returns active product on PDP, or null if on homepage
}
```

### How Sections Consume Context:

When building a `ProductInformation` section:

1. If rendered on a `product.json` template, it consumes `useProductContext()` automatically.
2. If rendered as a `FeaturedProduct` on the homepage, the section schema provides a `product` picker setting. The section falls back to fetching the selected product ID.

```tsx
export const ProductInformation: React.FC<
  SectionComponentProps<ProductInfoSettings>
> = ({ settings }) => {
  const contextualProduct = useProductContext()
  const { data: manualProduct } = useGetProduct(settings.product_id, {
    enabled: !contextualProduct && Boolean(settings.product_id),
  })

  const product = contextualProduct || manualProduct

  if (!product) return <ProductPlaceholder />

  return (
    <div>
      <h1>{product.title}</h1>
      <span>{formatPrice(product.price)}</span>
    </div>
  )
}
```

---

## 7. Template Normalization & Migrations

When you release a new version of a theme with schema changes (e.g. adding a new default block or migrating setting keys), older templates stored in user databases must not break.

Every theme exports a `normalizeTemplate()` function in `index.ts`:

```ts
export function normalizeTemplate(template: TemplateData): TemplateData {
  const normalized = structuredClone(template)

  // Ensure every section has valid blocks and block_order arrays
  for (const sectionId of normalized.order) {
    const section = normalized.sections[sectionId]
    if (!section) continue

    section.settings = section.settings || {}
    section.blocks = section.blocks || {}
    section.block_order = section.block_order || []

    // Example Migration: Upgrade legacy 'padding' number to 4-side spacing object
    if (typeof section.settings.padding === 'number') {
      const p = section.settings.padding
      section.settings.padding = { top: p, right: 0, bottom: p, left: 0 }
    }
  }

  return normalized
}
```

This guarantees that newly added settings always receive sensible defaults without crashing the visual customizer or storefront.
