---
name: oklch-color-system
description: OKLCH color space patterns for Tailwind CSS v4 and modern CSS. Use when working with colors, creating themes, defining color palettes, or needing perceptually uniform color manipulation. Triggers on mentions of OKLCH, colors, themes, color palettes, or color manipulation.
---

# OKLCH Color System

OKLCH is the default color space in Tailwind CSS v4, providing perceptually uniform colors and wider gamut support.

## OKLCH Format

```
oklch(lightness chroma hue / alpha)
```

- **Lightness**: 0-1 (0 = black, 1 = white) - perceptually uniform
- **Chroma**: 0-0.4 typical (color intensity/saturation)
- **Hue**: 0-360 degrees (color wheel position)
- **Alpha**: 0-1 (optional transparency)

## Project Color System

### Light Mode

```css
:root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.13 0.028 261.692);
    --primary: oklch(0.488 0.243 264.376);
    --primary-foreground: oklch(0.97 0.014 254.604);
    --secondary: oklch(0.967 0.001 286.375);
    --muted: oklch(0.967 0.003 264.542);
    --muted-foreground: oklch(0.551 0.027 264.364);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.928 0.006 264.531);
}
```

### Dark Mode

```css
.dark {
    --background: oklch(0.13 0.028 261.692);
    --foreground: oklch(0.985 0.002 247.839);
    --primary: oklch(0.42 0.18 266);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
}
```

## Color Manipulation

### Adjusting Lightness

```css
/* Original */
--primary: oklch(0.488 0.243 264.376);

/* Lighter (increase L) */
--primary-light: oklch(0.6 0.243 264.376);

/* Darker (decrease L) */
--primary-dark: oklch(0.35 0.243 264.376);
```

### Adjusting Saturation (Chroma)

```css
/* Muted version (reduce C) */
--primary-muted: oklch(0.488 0.08 264.376);

/* Vibrant version (increase C) */
--primary-vibrant: oklch(0.488 0.3 264.376);
```

### Relative Color Syntax

Derive colors from existing colors:

```css
/* Lighter variant */
--color-primary-light: oklch(from var(--primary) calc(l + 0.15) c h);

/* Muted variant */
--color-primary-muted: oklch(from var(--primary) l calc(c * 0.5) h);

/* Hue rotation */
--color-complementary: oklch(from var(--primary) l c calc(h + 180));
```

## Color Harmony

### Complementary (180° apart)

```css
--primary: oklch(0.5 0.2 264);        /* Blue-purple */
--complementary: oklch(0.5 0.2 84);   /* Yellow-orange */
```

### Triadic (120° apart)

```css
--primary: oklch(0.5 0.2 264);
--triadic-1: oklch(0.5 0.2 24);   /* Red-orange */
--triadic-2: oklch(0.5 0.2 144);  /* Green */
```

### Analogous (30° apart)

```css
--primary: oklch(0.5 0.2 264);
--analogous-1: oklch(0.5 0.2 234);  /* More blue */
--analogous-2: oklch(0.5 0.2 294);  /* More magenta */
```

## color-mix() Function

Runtime color blending:

```css
/* Tint (mix with white) */
background: color-mix(in oklch, var(--primary), white 20%);

/* Shade (mix with black) */
background: color-mix(in oklch, var(--primary), black 20%);

/* Transparency */
background: color-mix(in oklch, var(--primary), transparent 50%);

/* Blend two colors */
background: color-mix(in oklch, var(--primary) 70%, var(--secondary));
```

## Tailwind Usage

### In Classes

```tsx
className="bg-primary text-primary-foreground"
className="bg-muted/50"  /* 50% opacity */
className="border-border"
```

### Arbitrary Values

```tsx
className="bg-[oklch(0.5_0.2_264)]"
className="text-[--primary]"
className="bg-[color-mix(in_oklch,var(--primary),white_20%)]"
```

## Semantic Color Tokens

| Token | Purpose |
|-------|---------|
| `--background` | Page/surface background |
| `--foreground` | Primary text color |
| `--primary` | Brand/action color |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary actions |
| `--muted` | Subtle backgrounds |
| `--muted-foreground` | Secondary text |
| `--destructive` | Error/danger states |
| `--border` | Default borders |
| `--input` | Form input borders |
| `--ring` | Focus rings |

## Chart Colors

For data visualization, use the chart tokens:

```css
--chart-1: oklch(0.809 0.105 251.813);
--chart-2: oklch(0.623 0.214 259.815);
--chart-3: oklch(0.546 0.245 262.881);
--chart-4: oklch(0.488 0.243 264.376);
--chart-5: oklch(0.424 0.199 265.638);
```

## Why OKLCH?

1. **Perceptually uniform**: Equal L values look equally light across hues
2. **Predictable manipulation**: Changing L/C/H produces intuitive results
3. **Wider gamut**: Supports P3 display colors
4. **Better gradients**: No muddy transitions between colors
5. **Tailwind v4 default**: All predefined colors use OKLCH

## Common Patterns

### Hover States

```css
/* Darken on hover */
.btn:hover {
  background: oklch(from var(--primary) calc(l - 0.1) c h);
}
```

### Disabled States

```css
/* Reduce saturation and increase lightness */
.btn:disabled {
  background: oklch(from var(--primary) calc(l + 0.2) calc(c * 0.3) h);
}
```

### Focus Rings

```css
--ring: oklch(0.707 0.022 261.325);

.btn:focus-visible {
  box-shadow: 0 0 0 2px var(--ring);
}
```
