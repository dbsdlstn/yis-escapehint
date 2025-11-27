import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  // Base classes for accessibility (minimum 44x44 touch target)
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-white min-h-[44px] min-w-[44px]';

  // Size classes
  const sizeClasses = {
    sm: 'text-button-text px-3 py-2 text-sm',
    md: 'text-button-text px-4 py-2',
    lg: 'text-button-text px-6 py-3 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-accent-white text-dark-primary hover:bg-gray-200 active:scale-95 disabled:opacity-50',
    secondary: 'bg-dark-secondary text-text-primary border border-border-light hover:bg-dark-primary active:scale-95 disabled:opacity-50',
    ghost: 'bg-transparent text-text-primary hover:bg-white/10 active:scale-95 disabled:opacity-50',
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
    loading ? 'opacity-75 cursor-not-allowed' : ''
  }`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};