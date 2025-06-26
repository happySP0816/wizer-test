import * as React from "react"
import { cn } from "@/components/lib/utils"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption'
  component?: React.ElementType
  children: React.ReactNode
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'body1', component, children, ...props }, ref) => {
    const Component = component || getDefaultComponent(variant)
    
    return (
      <Component
        ref={ref}
        className={cn(getVariantClasses(variant), "text-primary", className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Typography.displayName = "Typography"

function getDefaultComponent(variant: string): React.ElementType {
  switch (variant) {
    case 'h1':
      return 'h1'
    case 'h2':
      return 'h2'
    case 'h3':
      return 'h3'
    case 'h4':
      return 'h4'
    case 'h5':
      return 'h5'
    case 'h6':
      return 'h6'
    case 'body1':
    case 'body2':
    case 'caption':
    default:
      return 'p'
  }
}

function getVariantClasses(variant: string): string {
  switch (variant) {
    case 'h1':
      return 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'
    case 'h2':
      return 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'
    case 'h3':
      return 'scroll-m-20 text-2xl font-semibold tracking-tight'
    case 'h4':
      return 'scroll-m-20 text-xl font-semibold tracking-tight'
    case 'h5':
      return 'scroll-m-20 text-lg font-semibold tracking-tight'
    case 'h6':
      return 'scroll-m-20 text-base font-semibold tracking-tight'
    case 'body1':
      return 'leading-7'
    case 'body2':
      return 'text-sm leading-7'
    case 'caption':
      return 'text-sm text-muted-foreground'
    default:
      return 'leading-7'
  }
}

export { Typography } 