---
name: tailwind-v4-patterns
description: Tailwind CSS v4 patterns and best practices for CSS-first configuration. Use when styling with Tailwind, configuring themes with @theme directive, working with CSS variables, creating custom variants with @custom-variant, or migrating from Tailwind v3. Triggers on mentions of Tailwind, styling, @theme, CSS variables, or utility classes.
---

# Tailwind V4 Patterns

Tailwind CSS v4 uses CSS-first configuration. No `tailwind.config.js` needed.

## CSS-First Configuration

### Import Structure

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));
```

### Theme Configuration with @theme

Define design tokens directly in CSS:

```css
@theme inline {
    --font-sans: 'JetBrains Mono Variable', monospace;
    --color-primary: var(--primary);
    --color-background: var(--background);
    --radius-lg: var(--radius);
}
```

### CSS Variables Pattern

Define base variables in `:root` and `.dark`:

```css
:root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.13 0.028 261.692);
    --primary: oklch(0.488 0.243 264.376);
    --primary-foreground: oklch(0.97 0.014 254.604);
}

.dark {
    --background: oklch(0.13 0.028 261.692);
    --foreground: oklch(0.985 0.002 247.839);
    --primary: oklch(0.42 0.18 266);
}
```

Then expose via `@theme inline` for Tailwind utilities.

## Custom Variants

### Creating Custom Variants

```css
@custom-variant dark (&:is(.dark *));
@custom-variant hocus (&:is(:hover, :focus-visible));
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

### Usage

```tsx
<div className="dark:bg-background hocus:scale-105">
```

## Cascade Layers

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply font-sans bg-background text-foreground;
  }
}
```

Layer order: `theme → base → components → utilities`

## Key Differences from v3

| v3 Pattern | v4 Pattern |
|------------|------------|
| `tailwind.config.js` | `@theme inline {}` in CSS |
| `addVariant()` in JS | `@custom-variant` in CSS |
| `@tailwind base` | `@import "tailwindcss"` |
| RGB/HSL colors | OKLCH colors |
| Plugin system | CSS-native features |

## Container Queries

Built-in, no plugin needed:

```tsx
<div className="@container">
  <div className="@md:grid-cols-2 @lg:grid-cols-3">
    {/* Responds to container width */}
  </div>
</div>
```

Named containers:

```tsx
<div className="@container/card">
  <div className="@md/card:flex-row">
```

## Data Attribute Utilities

Style based on data attributes:

```tsx
<div data-size="sm" className="data-[size=sm]:text-xs data-[size=lg]:text-base">
```

## Group and Peer Patterns

### Named Groups

```tsx
<div className="group/card">
  <div className="group-hover/card:opacity-100 group-data-[size=sm]/card:p-2">
```

### Has Variants

Style parent based on children:

```tsx
<div className="has-[img]:grid-cols-2 has-data-[slot=footer]:pb-0">
```

## Arbitrary Values

```tsx
className="bg-[--color-primary]"
className="text-[oklch(0.5_0.2_250)]"
className="w-[calc(100%-2rem)]"
```
