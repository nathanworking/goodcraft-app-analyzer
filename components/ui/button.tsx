'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    'destructive-outline':
      'border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    xs: 'h-6 px-2 text-xs rounded',
    sm: 'h-7 px-3 text-xs rounded-md',
    default: 'h-8 px-4 text-sm rounded-md',
    lg: 'h-9 px-4 text-sm rounded-lg',
    xl: 'h-10 px-6 text-base rounded-lg',
    icon: 'h-8 w-8 rounded-md',
    'icon-sm': 'h-7 w-7 rounded-md',
    'icon-lg': 'h-9 w-9 rounded-lg',
  },
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  render?: React.ReactElement<{ className?: string; children?: React.ReactNode }>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', render, children, ...props }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      buttonVariants.variant[variant],
      buttonVariants.size[size],
      className
    );

    // If render prop is provided, clone the element with our styles (Coss UI pattern)
    if (render && React.isValidElement(render)) {
      return React.cloneElement(render, {
        ref,
        className: cn(baseClasses, render.props.className),
        ...props,
        children: children ?? render.props.children,
      } as React.HTMLAttributes<HTMLElement>);
    }

    return (
      <button ref={ref} className={baseClasses} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
