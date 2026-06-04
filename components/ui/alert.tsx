import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 text-sm",
  {
    variants: {
      variant: {
        default: "border-border bg-bg-surface text-text-primary",
        info: "border-accent-green/30 bg-accent-green/10 text-text-primary",
        warning: "border-warning/30 bg-warning/10 text-text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

export { Alert };
