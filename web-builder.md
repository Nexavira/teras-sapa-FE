# Web Builder Architecture & Theme Infrastructure

**Target Audience:** AI Coding Agent **Project Scope:** A scalable, headless-ready web builder featuring a component-based design, scoped styling, external data integration, and a lightweight Liquid-style theme infrastructure.

---

## 1. Core Architecture Principles

The fundamental rule of this architecture is the strict separation of data and design. The application acts as a structured content management system and a CSS compiler, rather than a raw HTML editor.

-

**The Blueprint:** The visual layer is constructed using reusable starter components called Sections (layout modules) and Blocks (smaller customizable elements within Sections).

-

**The Configuration (Schema):** Every component requires a strict JSON configuration schema to dictate its editable options, such as text content, colors, and padding.

-

**The Page Layout:** Instead of saving raw HTML, the application stores the user's page layout as a massive JSON object in the database. This object simply lists the components present on the page, their display order, and their specific user-defined settings.

---

## 2. Theme Infrastructure Design

To support dynamic routes and component reusability, the theme engine is divided into four primary layers, inspired by Shopify's Liquid architecture but keeping the scope smaller and strictly separated.

| Layer       | Purpose                                                                           | Technical Implementation |
| ----------- | --------------------------------------------------------------------------------- | ------------------------ |
| **Layouts** | The master wrapper for the site containing `<head>`, global headers, and footers. |

| An HTML file containing a generic placeholder like `{{ content_for_layout }}` where page-specific content is injected.

|
| **Templates** | Determines which sections belong on a specific page type, such as a Homepage or Product Detail.

| A JSON file that strictly stores the ordering and IDs of sections.

|
| **Sections** | The actual starter components rendered on the page.

| An HTML file with templating tags, paired with a JSON schema dictating editable settings.

|
| **Routing / Slugs** | Maps a user's URL request to the correct template and fetches required external data.

| Database logic that reads a URL path, extracts the slug, and passes the required data into the template.

|

---

## 3. Data Structure Definitions

The engine relies on specific JSON structures to manage routes, templates, and component instances.

### A. The Page & Routing Structure

This structure defines a page, its URL routing, and which template it maps to. It allows you to create static pages as well as dynamic data-driven pages where the slug changes.

```json
{
  "id": "page_987xyz",
  "title": "Default Product Template",
  "route_type": "dynamic",
  "base_path": "/products",
  "slug_binding": "product.handle",
  "template_id": "tpl_product_default",
  "status": "published"
}
```

(Structure defined in )

### B. The Template Layout Structure

This acts as the skeleton for the page layout, dictating to the compiler which components to fetch and their render order.

```json
{
  "id": "tpl_product_default",
  "name": "Product Default",
  "layout": "theme_main",
  "sections": {
    "header_main": { "type": "header", "order": 1 },
    "product_info_main": { "type": "product_overview", "order": 2 },
    "recommendation_grid": { "type": "product_collection", "order": 3 }
  }
}
```

(Structure defined in )

### C. The Component Configuration Structure

This object stores specific user settings, styling scopes, and external data bindings for an active component.

```json
{
  "id": "product_info_main",
  "type": "product_overview",
  "styling_scope": {
    "global_classes": ["product-layout", "grid-2-col"],
    "local_hash": "#product-overview-x8y9z",
    "local_css": "background-color: #f4f4f4; padding: 2rem;"
  },
  "data_binding": {
    "source": "external_api",
    "endpoint": "/api/v1/products/{{ request.slug }}"
  },
  "blocks": [
    {
      "type": "title",
      "content_bind": "{{ product.title }}"
    },
    {
      "type": "price",
      "content_bind": "{{ product.price | format_currency }}"
    },
    {
      "type": "add_to_cart_button",
      "settings": {
        "button_color": "#000000",
        "button_text": "Buy Now"
      }
    }
  ]
}
```

(Structure defined in )

---

## 4. Styling Scopes

To manage the cascading nature of styles and handle local versus global styling, the application must act as a CSS compiler.

-

**Global Scope:** The component is assigned a generic CSS class. This is used when a user updates a master component and expects all instances across the site to update automatically.

-

**Local Scope:** The application generates a unique hash ID for a specific instance. This is used when a user changes specific elements, like background color or padding, of one specific instance without affecting others.

---

## 5. External Data Integration

Connecting the builder to live external data requires a dedicated templating bridge.

1.**Data Binding:** Component JSON schemas include fields like "Data Source" or "API Reference" to connect to external systems.

2.**Dynamic References:** Instead of static text strings, text fields hold variable placeholders from the external data source.

3.**The Fetch Layer:** Upon page load or compile, the builder makes an API call to the external product management system to fetch the requested data.

4.**The Renderer:** The rendering engine loops over external data arrays to dynamically generate a starter component for each database item.

---

## 6. Execution Flow

### When Publishing or Saving

When users drag and drop elements in the visual canvas, they are just updating the massive JSON object in the database. When saving or publishing, the application runs a strict compilation process:

1.**Read JSON:** The compiler reads the stored page and layout JSON objects.

2.**Generate HTML:** It loops through the JSON to render raw HTML for each component instance.

3.**Generate Scoped CSS:** It outputs global CSS to standard generic classes and generates local CSS targeting the unique hash IDs.

4.**Package:** It combines everything into a clean package to be displayed on the live web page.

### When Loading a Dynamic Page

For dynamic requests, such as a URL containing a slug:

1.**Match Route:** The system recognizes the URL path and identifies the associated dynamic page configuration.

2.**Extract Slug:** It pulls the specific slug directly from the URL.

3.**Fetch Data:** It uses the slug to ping the external API to fetch the specific details for that item.

4.**Load Template:** It reads the layout JSON to load the required components in order.

5.**Bind & Render:** It replaces Liquid-style tags with the fetched data and renders the final HTML.

6.**Compile CSS:** It injects the appropriate global classes and local scoped overrides into a `<style>` block for local overrides.
