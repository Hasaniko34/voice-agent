'use client'

import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: IconType;
  loading?: boolean;
  animate?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = '',
  icon: Icon,
  disabled = false,
  loading = false,
  animate = true,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  ...props
}, ref) => {
  
  // Variant sınıfları
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-transparent',
    secondary: 'bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 text-gray-900 border-gray-300',
    outline: 'bg-white hover:bg-gray-50 focus:ring-blue-500 text-gray-700 border-gray-300',
    danger: 'bg-red-100 hover:bg-red-200 focus:ring-red-500 text-red-700 border-transparent',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white border-transparent',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 text-gray-700 border-transparent'
  };
  
  // Boyut sınıfları
  const sizeClasses = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    icon: 'p-2'
  };
  
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-md',
    'border shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-colors duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');
  
  const buttonContent = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      )}
      {Icon && !loading && (
        <Icon 
          className={`${size === 'icon' ? 'h-5 w-5' : 'mr-2 h-4 w-4'} ${!children ? 'mr-0' : ''}`} 
          aria-hidden="true" 
        />
      )}
      {children}
    </>
  );
  
  if (animate) {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={baseClasses}
        disabled={disabled || loading}
        type={type}
        {...props as any}
      >
        {buttonContent}
      </motion.button>
    );
  }
  
  return (
    <button
      ref={ref}
      className={baseClasses}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {buttonContent}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 