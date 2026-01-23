import { createContext, useContext } from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const TabsContext = createContext<{
  size?: "default" | "sm"
}>({
  size: "default",
})

const tabsVariants = cva("flex flex-col", {
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-row",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

interface TabsProps
  extends Omit<TabsPrimitive.Root.Props, "className"> {
  className?: string
  size?: "default" | "sm"
}

function Tabs({
  className,
  orientation = "horizontal",
  size = "default",
  ...props
}: TabsProps) {
  return (
    <TabsContext.Provider value={{ size }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        orientation={orientation}
        className={cn(tabsVariants({ orientation }), className)}
        {...props}
      />
    </TabsContext.Provider>
  )
}

const tabsListVariants = cva(
  "inline-flex items-center gap-1 border-b border-border",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface TabsListProps
  extends Omit<TabsPrimitive.List.Props, "className">,
    VariantProps<typeof tabsListVariants> {
  className?: string
}

function TabsList({ className, size, ...props }: TabsListProps) {
  const context = useContext(TabsContext)
  const resolvedSize = size ?? context.size

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ size: resolvedSize }), className)}
      {...props}
    />
  )
}

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 border-b-2 border-transparent -mb-px text-muted-foreground hover:text-foreground hover:bg-muted data-[selected]:border-primary data-[selected]:text-foreground data-[selected]:bg-muted focus-visible:ring-ring/50 focus-visible:ring-2",
  {
    variants: {
      size: {
        default: "px-4 py-2 text-sm",
        sm: "px-3 py-1.5 text-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface TabsTriggerProps
  extends Omit<TabsPrimitive.Tab.Props, "className">,
    VariantProps<typeof tabsTriggerVariants> {
  className?: string
}

function TabsTrigger({ className, size, ...props }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  const resolvedSize = size ?? context.size

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ size: resolvedSize }), className)}
      {...props}
    />
  )
}

const tabsContentVariants = cva("outline-none", {
  variants: {
    size: {
      default: "pt-4",
      sm: "pt-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

interface TabsContentProps
  extends Omit<TabsPrimitive.Panel.Props, "className">,
    VariantProps<typeof tabsContentVariants> {
  className?: string
}

function TabsContent({ className, size, ...props }: TabsContentProps) {
  const context = useContext(TabsContext)
  const resolvedSize = size ?? context.size

  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(tabsContentVariants({ size: resolvedSize }), className)}
      {...props}
    />
  )
}

const tabsIndicatorVariants = cva(
  "absolute bottom-0 h-0.5 bg-primary transition-all duration-200",
  {
    variants: {
      renderBeforeHydration: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      renderBeforeHydration: false,
    },
  }
)

interface TabsIndicatorProps
  extends Omit<TabsPrimitive.Indicator.Props, "className"> {
  className?: string
}

function TabsIndicator({ className, ...props }: TabsIndicatorProps) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(tabsIndicatorVariants(), className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
  tabsVariants,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
  tabsIndicatorVariants,
}
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsIndicatorProps,
}
