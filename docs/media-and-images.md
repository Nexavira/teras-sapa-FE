# Image & Media Management

> **A Comprehensive Specification for Content-Managed Reusable Assets, Focal Point Cropping, Responsive Art Direction, and Performance Optimization in Shopiti.**  
> Modeled after **Shopify Files & Media Library**, engineered for modern headless web applications.

---

## 1. Architectural Philosophy: Why Raw Image URLs Fail

In primitive website builders, images are handled as basic text fields where users paste image URLs. This creates severe problems:
1. **No Reusability:** If a merchant uploads their brand logo or a hero image, they must re-upload or track down the URL every time they want to use it in another section or block.
2. **Broken Responsive Layouts:** A landscape banner designed for a 1440px desktop screen gets cropped awkwardly on a 375px mobile device, cutting off product details or faces.
3. **Huge Payloads & Poor SEO:** Uploading unoptimized 8MB PNGs destroys Google Core Web Vitals (LCP / CLS) scores and kills conversion rates.

### The Shopiti Solution:
A **Centralized Media Asset Library (CMS)** paired with the **`image_picker`** setting type, supporting asset reusability, focal point positioning, dynamic CDN resizing, and responsive `<picture>` art direction.

```mermaid
graph TD
    subgraph "Media Asset Management (CMS)"
        UPLOAD[Merchant Uploads File] --> STORAGE[CDN / Object Storage]
        STORAGE --> META[Media Database: id, dimensions, size, alt_text, tags]
        META --> LIBRARY[Reusable Media Library Gallery]
    end

    subgraph "Theme Customizer Inspector"
        PICKER[image_picker Setting Widget] -->|Click 'Select Image'| MODAL[Media Library Modal]
        LIBRARY -->|Browse / Search Existing| MODAL
        MODAL -->|Selects Asset| VALUE[ImageValue Object]
        VALUE -->|Set Focal Point Pin| FP[focalPoint: { x: 45, y: 20 }]
    end

    subgraph "Storefront Presentation Layer"
        FP --> SNIP[<ResponsiveImage /> Snippet]
        SNIP -->|Calculates object-position & srcset| DOM[Optimal <img> with WebP & Lazy Loading]
    end
```

---

## 2. The Reusable Media Library CMS

When a merchant interacts with an `image_picker` field in the Theme Customizer, clicking the field opens the **Media Picker Modal**:

### 1. Tab 1: "Store Media Library"
- Displays a searchable, paginated grid of all previously uploaded assets.
- Filter by media type (Images, Videos, Documents) and tags (Products, Banners, Logos).
- Selecting any existing image attaches it to the section or block immediately, **reusing the exact asset without duplicating storage**.

### 2. Tab 2: "Upload New"
- Drag-and-drop file upload zone supporting JPG, PNG, WebP, SVG, and GIF.
- Client-side preflight validation (checks dimensions, format, file size).
- Once uploaded, the asset is saved to the store's media database and is instantly available for all other sections across the theme.

---

## 3. The `ImageValue` Data Contract

Rather than storing a raw string, an `image_picker` setting produces a structured `ImageValue` object:

```ts
export interface ImageValue {
  /** Unique media asset UUID in the CMS */
  id?: string
  /** Absolute public CDN URL */
  url: string
  /** Accessible alt text for screen readers and SEO */
  altText?: string
  /** Intrinsic image width in pixels */
  width?: number
  /** Intrinsic image height in pixels */
  height?: number
  /** Normalized 2D focal point coordinates (0% to 100%) */
  focalPoint?: {
    x: number
    y: number
  }
}
```

### Schema Setting Definition:
```ts
{
  type: 'image_picker',
  id: 'banner_image',
  label: 'Hero Background Image',
  info: 'Recommended size: 2880 x 1200px. WebP, PNG, or JPG.',
  allowed_types: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
}
```

---

## 4. Focal Point Cropping & Positioning

### The Problem:
An image of a model wearing a watch has dimensions `1920x1080` (16:9). When viewed on a smartphone (`375x812`), CSS `object-fit: cover` defaults to centering (`50% 50%`), cutting off the model's head and the watch.

### The Solution:
In the Theme Customizer, the merchant can click anywhere on the image thumbnail to place an interactive **Focal Point Pin**.
- The pin coordinates are saved as `{ x: 65, y: 25 }` (percentages from top-left).
- In the frontend component, this maps directly to CSS `object-position`:

```tsx
import styled from '@emotion/styled'
import type { ImageValue } from '#themes/shared/types/theme'

const ImageElement = styled.img<{ focalPoint?: ImageValue['focalPoint'] }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${({ focalPoint }) =>
    focalPoint ? `${focalPoint.x}% ${focalPoint.y}%` : 'center center'};
`

export const BannerImage: React.FC<{ image?: ImageValue }> = ({ image }) => {
  if (!image?.url) return null

  return (
    <ImageElement
      src={image.url}
      alt={image.altText || 'Promotional Banner'}
      width={image.width}
      height={image.height}
      focalPoint={image.focalPoint}
      loading="lazy"
      decoding="async"
    />
  )
}
```

---

## 5. Responsive Art Direction (Desktop vs. Mobile Images)

For hero banners, a single image cropped differently is often insufficient. Designers frequently produce a distinct landscape banner for desktop and a portrait banner for mobile.

### Schema Pattern:
```ts
settings: [
  {
    type: 'image_picker',
    id: 'image_desktop',
    label: 'Desktop Image',
    info: 'Displayed on screens larger than 768px (e.g. 2880 x 1200px).',
  },
  {
    type: 'image_picker',
    id: 'image_mobile',
    label: 'Mobile Image (Optional)',
    info: 'Displayed on mobile devices (e.g. 750 x 1000px). Falls back to desktop image if blank.',
  },
]
```

### Component Implementation using `<picture>`:
```tsx
export const ResponsiveHeroImage: React.FC<{
  imageDesktop?: ImageValue
  imageMobile?: ImageValue
}> = ({ imageDesktop, imageMobile }) => {
  if (!imageDesktop?.url) return null

  return (
    <picture>
      {/* Mobile source breakpoint */}
      {imageMobile?.url && (
        <source
          media="(max-width: 768px)"
          srcSet={imageMobile.url}
          width={imageMobile.width}
          height={imageMobile.height}
        />
      )}
      {/* Desktop default fallback */}
      <img
        src={imageDesktop.url}
        alt={imageDesktop.altText || 'Hero Banner'}
        width={imageDesktop.width}
        height={imageDesktop.height}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: imageDesktop.focalPoint
            ? `${imageDesktop.focalPoint.x}% ${imageDesktop.focalPoint.y}%`
            : 'center',
        }}
        fetchPriority="high" // High priority for above-the-fold LCP optimization
      />
    </picture>
  )
}
```

---

## 6. High-Performance Optimization Standards

Every theme component rendering images MUST follow these performance rules:

1. **Explicit Width and Height:** Always pass `width` and `height` attributes to images to prevent **Cumulative Layout Shift (CLS)** as images load.
2. **Lazy Loading by Default:** All images below the fold must include `loading="lazy"` and `decoding="async"`.
3. **LCP Hero Exceptions:** The first visible hero section on a page must omit `loading="lazy"` and instead use `fetchpriority="high"` to maximize Largest Contentful Paint speed.
4. **Next-Gen WebP/AVIF Delivery:** Image URLs served through the media API should automatically negotiate optimal formats (`format=webp&quality=80`).
5. **Blur Placeholders:** Use a subtle background color or low-resolution image placeholder (`--color-background-secondary`) while the high-resolution image hydrates.
