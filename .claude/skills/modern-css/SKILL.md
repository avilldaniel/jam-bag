---
name: modern-css
description: Modern CSS features including :has() selector, container queries, CSS nesting, cascade layers, @property, @starting-style, and scroll-driven animations. Use when implementing advanced CSS patterns, parent selection, container-responsive components, or progressive enhancement. Triggers on mentions of :has(), container queries, CSS nesting, modern CSS, or advanced styling.
---

# Modern CSS

Modern CSS features for building sophisticated UIs without JavaScript.

## :has() Selector (Parent Selection)

Style elements based on their children or subsequent siblings.

### Basic Patterns

```css
/* Parent changes based on child state */
.card:has(img) {
  grid-template-columns: 1fr 2fr;
}

/* Form validation styling */
form:has(:invalid) button[type="submit"] {
  opacity: 0.5;
  pointer-events: none;
}

/* Style based on child focus */
.field:has(:focus-within) {
  border-color: var(--primary);
}
```

### Tailwind Patterns

```tsx
// Has data attribute
className="has-data-[slot=card-footer]:pb-0"

// Has child element
className="has-[>img:first-child]:pt-0"

// Has checked input
className="has-data-checked:bg-primary/5"
```

### Browser Support

Chrome 105+, Firefox 121+, Safari 15.4+ (90%+ global coverage)

## Container Queries

Components respond to container size, not viewport.

### Setup

```tsx
<div className="@container">
  <div className="flex-col @md:flex-row @lg:grid-cols-3">
```

### Named Containers

```tsx
<div className="@container/card-header">
  <div className="@md/card-header:grid-cols-2">
```

### CSS Syntax

```css
.container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .content { display: grid; }
}
```

## CSS Nesting

Native nesting without preprocessors.

```css
.card {
  padding: 1rem;

  & .card-header {
    font-weight: bold;
  }

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
}
```

## @property (Registered Custom Properties)

Type CSS variables for animations and validation.

```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.element {
  background: linear-gradient(var(--gradient-angle), blue, purple);
  transition: --gradient-angle 0.3s;
}

.element:hover {
  --gradient-angle: 90deg;
}
```

### Animation Example

```css
@property --hue {
  syntax: '<number>';
  inherits: false;
  initial-value: 200;
}

@keyframes hue-rotate {
  to { --hue: 560; }
}

.animated {
  background: oklch(0.7 0.15 var(--hue));
  animation: hue-rotate 3s linear infinite;
}
```

## @starting-style

Animate elements entering the DOM.

```css
dialog {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s, transform 0.3s, display 0.3s allow-discrete;
}

dialog[open] {
  opacity: 1;
  transform: translateY(0);
}

@starting-style {
  dialog[open] {
    opacity: 0;
    transform: translateY(-20px);
  }
}
```

### Browser Support

Chrome/Edge, Safari 18+. Use with `transition-behavior: allow-discrete` for `display` transitions.

## Scroll-Driven Animations

Animations driven by scroll position (Chrome, Firefox with flag).

```css
/* Progress bar based on scroll */
.progress-bar {
  animation: grow-progress linear;
  animation-timeline: scroll(root);
  transform-origin: left;
}

@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* Fade in when entering viewport */
.fade-in-on-scroll {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

### Feature Detection

```css
@supports (animation-timeline: scroll()) {
  /* Scroll-driven animations */
}
```

## Cascade Layers

Control specificity with explicit layer ordering.

```css
@layer base, components, utilities;

@layer base {
  h1 { font-size: 2rem; }
}

@layer components {
  .btn { padding: 0.5rem 1rem; }
}

@layer utilities {
  .text-center { text-align: center; }
}
```

Utilities always override components regardless of selector specificity.

## color-mix()

Runtime color blending.

```css
.button {
  background: color-mix(in oklch, var(--primary) 80%, white);
}

.button:hover {
  background: color-mix(in oklch, var(--primary), black 10%);
}
```

## Progressive Enhancement Pattern

```css
/* Fallback */
.tooltip {
  position: absolute;
  top: 100%;
}

/* Enhanced with anchor positioning */
@supports (anchor-name: --tooltip) {
  .trigger { anchor-name: --tooltip; }
  .tooltip {
    position-anchor: --tooltip;
    position-area: bottom;
  }
}
```
