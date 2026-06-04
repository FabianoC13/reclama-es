import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'lg' | 'sm';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' &&
            'rounded-lg bg-text-primary text-bg-surface hover:-translate-y-px hover:bg-[#3d3028]',
          variant === 'secondary' &&
            'rounded-lg border border-border bg-transparent text-text-primary hover:border-border-focus hover:bg-bg-surface',
          variant === 'ghost' && 'rounded-lg text-text-secondary hover:bg-black/[0.06] hover:text-text-primary',
          size === 'default' && 'px-5 py-2.5 text-sm',
          size === 'lg' && 'px-7 py-3.5 text-base rounded-xl',
          size === 'sm' && 'px-3 py-1.5 text-xs',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
