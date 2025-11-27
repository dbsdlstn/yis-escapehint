import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const hasError = !!error;

  const inputClasses = `w-full px-4 py-3 bg-bg-input border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-white focus:border-transparent ${
    hasError ? 'border-red-500' : 'border-border-light'
  } ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-text-secondary mb-2">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        aria-invalid={hasError}
        aria-describedby={hasError ? "error-text" : undefined}
        {...props}
      />
      {helperText && !hasError && (
        <p className="mt-1 text-sm text-text-secondary">
          {helperText}
        </p>
      )}
      {hasError && (
        <p id="error-text" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};