'use client'

import React from 'react';

export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton';
export type LoadingSize = 'small' | 'medium' | 'large';
export type LoadingColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

// Loading Props için tip tanımı
interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  color?: LoadingColor;
  text?: string;
  fullPage?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'medium',
  color = 'primary',
  text,
  fullPage = false,
  className = '',
}) => {
  // Size değerlerine göre boyutlar
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  // Renk sınıfları
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-cyan-600',
  };

  // Varyasyona göre bileşen render et
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`animate-spin rounded-full border-t-2 border-b-2 ${colorClasses[color]} ${sizeClasses[size]} ${className}`}></div>
        );
      case 'dots':
        return (
          <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-full ${colorClasses[color]} ${
                  size === 'small' ? 'h-1.5 w-1.5' : size === 'medium' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'
                } animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div
            className={`${sizeClasses[size]} ${colorClasses[color]} animate-pulse rounded-full ${className}`}
            style={{
              background: `currentColor`,
              animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          ></div>
        );
      case 'skeleton':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className={`rounded bg-gray-200 ${sizeClasses[size]}`}></div>
          </div>
        );
      default:
        return null;
    }
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-75">
        <div className="flex flex-col items-center">
          {renderLoader()}
          {text && <p className="mt-4 text-gray-700">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {renderLoader()}
      {text && <span className="ml-3 text-gray-700">{text}</span>}
    </div>
  );
};

export default Loading;

// Özel stil için global CSS
export const loadingStyles = `
  @keyframes pulse {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }
`; 