import React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        small: "h-4 w-4 border-2",
        medium: "h-6 w-6 border-2",
        large: "h-8 w-8 border-[3px]",
        xlarge: "h-12 w-12 border-[3px]",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {}

export const Spinner = ({ size, className, ...props }: SpinnerProps) => {
  return (
    <span
      className={cn(spinnerVariants({ size }), className)}
      {...props}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </span>
  );
};
