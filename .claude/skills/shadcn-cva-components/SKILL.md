---
name: shadcn-cva-components
description: Patterns for creating shadcn/ui components with class-variance-authority (CVA) variant structures. Use when creating new components, defining variants, working with shadcn/ui, or implementing type-safe component APIs. Triggers on mentions of CVA, variants, shadcn, component creation, or VariantProps.
---

# shadcn/ui + CVA Components

Type-safe component variants using class-variance-authority with shadcn/ui patterns.

## CVA Variant Structure

### Basic Pattern

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center justify-center rounded-none text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border border-border bg-background hover:bg-muted",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-2.5 gap-1.5",
        xs: "h-6 px-2 gap-1 text-xs",
        sm: "h-7 px-2.5 gap-1",
        lg: "h-9 px-3 gap-1.5",
        icon: "size-8",
        "icon-xs": "size-6",
        "icon-sm": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Component with VariantProps

```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

## Data Slot Pattern

Use `data-slot` for component communication:

```tsx
// Parent component
<div data-slot="card" data-size={size}>

// Child responds to parent
className="group-data-[size=sm]/card:px-3"
```

### Common Slots

- `data-slot="card"`, `data-slot="card-header"`, `data-slot="card-footer"`
- `data-slot="field"`, `data-slot="field-label"`, `data-slot="field-error"`
- `data-slot="button"`, `data-slot="input"`

## Group Targeting

### Named Groups

```tsx
// Define group
<div className="group/card">

// Target from children
<div className="group-hover/card:opacity-100">
<div className="group-data-[size=sm]/card:text-xs">
```

### Has-Data Pattern

Style parent based on child slots:

```tsx
className="has-data-[slot=card-footer]:pb-0"
className="has-data-[slot=card-action]:grid-cols-[1fr_auto]"
className="has-[>img:first-child]:pt-0"
```

## Compound Variants

Conditional styling based on multiple variants:

```tsx
const cardVariants = cva("rounded-lg border", {
  variants: {
    variant: {
      default: "border-border",
      elevated: "shadow-lg",
    },
    size: {
      default: "p-6",
      compact: "p-4",
    },
  },
  compoundVariants: [
    {
      variant: "elevated",
      size: "compact",
      class: "shadow-md", // Override shadow for compact elevated
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})
```

## Component Template

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "",
        // Add variants
      },
      size: {
        default: "",
        // Add sizes
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ComponentProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof componentVariants> {}

function Component({ className, variant, size, ...props }: ComponentProps) {
  return (
    <div
      data-slot="component"
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Component, componentVariants }
```

## Responsive Variants with Container Queries

```tsx
const fieldVariants = cva("flex w-full gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-center",
      responsive: "flex-col @md/field-group:flex-row @md/field-group:items-center",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

// Usage with container
<div className="@container/field-group">
  <Field orientation="responsive">
```

## Icon Handling Pattern

```tsx
const buttonVariants = cva(
  "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        default: "has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "[&_svg:not([class*='size-'])]:size-3",
        icon: "size-8",
      },
    },
  }
)
```

## State Styling

```tsx
const inputVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1",
  {
    variants: {
      state: {
        default: "",
        invalid: "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        disabled: "disabled:pointer-events-none disabled:opacity-50",
      },
    },
  }
)
```
