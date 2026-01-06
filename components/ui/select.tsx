'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const selectSizes = {
  sm: 'h-7 text-xs',
  default: 'h-8 text-sm',
  lg: 'h-9 text-sm',
};

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  items: SelectItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  size?: keyof typeof selectSizes;
  className?: string;
  id?: string;
}

// Base UI Select implementation - simplified for now
// Full Base UI implementation coming in future Coss UI updates
function Select({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select...',
  label,
  error,
  disabled,
  size = 'default',
  className,
  id,
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3',
          'text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'cursor-pointer',
          selectSizes[size],
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
      >
        {placeholder && !currentValue && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {items.map((item) => (
          <option key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// Simplified native select for basic use cases (backwards compatible)
export interface NativeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  size?: keyof typeof selectSizes;
}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, label, error, options, size = 'default', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'flex w-full rounded-md border border-input bg-background px-3',
            'text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'cursor-pointer',
            selectSizes[size],
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
NativeSelect.displayName = 'NativeSelect';

export { Select, NativeSelect };
