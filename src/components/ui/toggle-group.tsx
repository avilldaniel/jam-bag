import { createContext, useContext } from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ToggleGroupContext = createContext<{
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline"
}>({
  size: "default",
  variant: "default",
})

const toggleGroupVariants = cva("flex items-center gap-1", {
  variants: {
    layout: {
      horizontal: "flex-row flex-wrap",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    layout: "horizontal",
  },
})

interface ToggleGroupProps
  extends Omit<ToggleGroupPrimitive.Props, "className">,
    VariantProps<typeof toggleGroupVariants> {
  className?: string
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline"
}

function ToggleGroup({
  className,
  orientation = "horizontal",
  layout,
  size = "default",
  variant = "default",
  children,
  ...props
}: ToggleGroupProps) {
  // Map orientation to layout if layout not explicitly provided
  const resolvedLayout = layout ?? (orientation === "vertical" ? "vertical" : "horizontal")

  return (
    <ToggleGroupContext.Provider value={{ size, variant }}>
      <ToggleGroupPrimitive
        data-slot="toggle-group"
        orientation={orientation}
        className={cn(toggleGroupVariants({ layout: resolvedLayout }), className)}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive>
    </ToggleGroupContext.Provider>
  )
}

const toggleItemVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center justify-center text-xs font-medium transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-transparent hover:bg-muted hover:text-muted-foreground data-[pressed]:bg-primary data-[pressed]:text-primary-foreground",
        outline:
          "border border-border bg-background hover:bg-muted hover:text-foreground data-[pressed]:bg-primary data-[pressed]:text-primary-foreground data-[pressed]:border-primary",
      },
      size: {
        default: "h-8 min-w-8 px-2.5",
        sm: "h-7 min-w-7 px-2",
        lg: "h-9 min-w-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ToggleGroupItemProps
  extends Omit<TogglePrimitive.Props, "className">,
    VariantProps<typeof toggleItemVariants> {
  className?: string
}

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext)
  const resolvedVariant = variant ?? context.variant
  const resolvedSize = size ?? context.size

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(
        toggleItemVariants({
          variant: resolvedVariant,
          size: resolvedSize,
        }),
        className
      )}
      {...props}
    />
  )
}

export {
  ToggleGroup,
  ToggleGroupItem,
  toggleGroupVariants,
  toggleItemVariants,
}
export type { ToggleGroupProps, ToggleGroupItemProps }
