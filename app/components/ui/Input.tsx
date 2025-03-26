'use client'

import { InputHTMLAttributes, forwardRef } from 'react';
import { IconType } from 'react-icons';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: IconType;
  rightIcon?: IconType;
  onRightIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '',
    label,
    error,
    helpText,
    leftIcon: LeftIcon, 
    rightIcon: RightIcon,
    onRightIconClick,
    disabled,
    required,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    // Yüksek kontrastlı renk ve stil sınıfları
    const baseInputClasses = "w-full px-4 py-2.5 rounded-md transition-colors text-gray-900 bg-white placeholder:text-gray-500";
    const borderClasses = error 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
    const focusClasses = "focus:outline-none focus:ring-2 focus:ring-opacity-50";
    const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed opacity-75" : "";
    const iconPaddingLeft = LeftIcon ? "pl-10" : "";
    const iconPaddingRight = RightIcon ? "pr-10" : "";
    
    const inputClasses = `${baseInputClasses} ${borderClasses} ${focusClasses} ${disabledClasses} ${iconPaddingLeft} ${iconPaddingRight} ${className}`;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LeftIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
            </div>
          )}
          
          <input
            id={inputId}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
            required={required}
            ref={ref}
            {...props}
          />
          
          {RightIcon && (
            <div 
              className={`absolute inset-y-0 right-0 flex items-center pr-3 ${onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'}`}
              onClick={onRightIconClick}
            >
              <RightIcon className={`w-5 h-5 ${error ? 'text-red-500' : 'text-gray-500'}`} aria-hidden="true" />
            </div>
          )}
        </div>
        
        {/* Hata mesajı veya yardım metni */}
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 flex items-center">
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p id={`${inputId}-help`} className="mt-1.5 text-sm text-gray-600">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 