'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const textareaSizes = {
  sm: 'text-xs min-h-[80px]',
  default: 'text-sm min-h-[100px]',
  lg: 'text-sm min-h-[120px]',
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  size?: keyof typeof textareaSizes;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, size = 'default', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
        <textarea
          id={textareaId}
          className={cn(
            'flex w-full rounded-md border border-input bg-background px-3 py-2',
            'text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-y',
            textareaSizes[size],
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
