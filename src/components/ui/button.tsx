import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#DCEDC0] hover:bg-[#d0e5a8] dark:bg-primary dark:hover:bg-primary/90 text-[#2d5f4d] dark:text-primary-foreground shadow-md hover:shadow-lg rounded-full !py-[25px] text-base transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:bg-destructive/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        outline:
          "border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent rounded-full transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        secondary:
          "bg-[#DCEDC0] text-[#397C65] shadow-sm hover:bg-[#d0e5a8] dark:hover:bg-[#dcedc0] dark:text-[#000] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        active_menu:
          "font-semibold relative before:w-[4px] before:h-[80%] before:content-[''] before:absolute before:bg-primary before:left-[-5px] before:rounded-full",
        active_menu_inner:
          "font-semibold relative before:w-[10px] before:h-[10px] before:rounded-full before:content-[''] before:absolute before:bg-primary before:left-[17px]",
        ghost:
          "hover:bg-[#DCEDC0] hover:text-[#397C65]  dark:hover:text-accent-foreground text-[#000000B2] dark:text-foreground/80 transition-all duration-200",
        link:
          "text-primary dark:text-primary underline-offset-4 hover:underline transition-all duration-200",
        success:
          "bg-success text-success-foreground shadow-md hover:shadow-lg hover:bg-success/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        warning:
          "bg-warning text-warning-foreground shadow-md hover:shadow-lg hover:bg-warning/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        info:
          "bg-info text-info-foreground shadow-md hover:shadow-lg hover:bg-info/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
