import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  ",
  {
    variants: {
      variant: {
        default:
          "bg-[#DCEDC0] dark:text-primary-foreground shadow rounded-full  !py-[25px] text-base",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-full",
        secondary:
          "bg-[#DCEDC0] text-[#397C65] shadow-sm hover:bg-[#DCEDC0]",
        // secondary:
        // "font-semibold  before:w-[4px] before:h-[80%] before:content[''] before:absolute before:bg-[#000] before:left-[-5px] bg-[#DCEDC0]/30 text-secondary-foreground shadow-sm hover:bg-[#DCEDC0]/30 dark:hover:bg-white/30 dark:bg-white/30",
        active_menu:"font-semibold  before:w-[4px] before:h-[80%] before:content[''] before:absolute before:bg-[#000] before:left-[-5px]",
        active_menu_inner:"font-semibold  before:w-[10px] before:h-[10px] before:rounded-[50px] before:content[''] before:absolute before:bg-[#000] before:left-[17px]",
        ghost:"hover:bg-[#DCEDC0] hover:text-[#397C65] dark:hover:bg-[#DCEDC0] text-[#000000B2]  dark:text-white dark:hover:text-[#397C65] ",
        link: " text-[#DCEDC0] dark:text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
