'use client'

import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton';
type LoadingSize = 'sm' | 'md' | 'lg';
type LoadingColor = 'primary' | 'secondary' | 'white';

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LoadingVariant;
  size?: LoadingSize;
  color?: LoadingColor;
  text?: string;
  fullPage?: boolean;
  transparent?: boolean;
}

export default function Loading({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  fullPage = false,
  transparent = false,
  className = '',
  ...props
}: LoadingProps) {
  // Boyut sınıfları
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  // Renk sınıfları
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  // Tam sayfa kapsayıcı
  if (fullPage) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${transparent ? 'bg-white/70' : 'bg-white'}`}>
        <Loading
          variant={variant}
          size={size}
          color={color}
          text={text}
        />
      </div>
    );
  }

  // İçerik kapsayıcı
  const containerClasses = text
    ? 'flex flex-col items-center justify-center space-y-3'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`} {...props}>
      {variant === 'spinner' && (
        <div
          className={`border-4 rounded-full ${sizeClasses[size]} ${colorClasses[color]} border-t-transparent animate-spin`}
        />
      )}
      
      {variant === 'dots' && (
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`rounded-full ${sizeClasses.sm} ${colorClasses[color]} bg-current`}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.3,
                ease: "easeInOut" 
              }}
            />
          ))}
        </div>
      )}
      
      {variant === 'pulse' && (
        <motion.div
          className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} bg-current`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      )}
      
      {variant === 'skeleton' && (
        <div className="space-y-2 w-full">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className={`h-3 bg-gray-200 rounded-md ${i === 1 ? 'w-3/4' : 'w-full'}`} 
              style={{ 
                animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      )}
      
      {text && (
        <span className={`text-sm font-medium ${colorClasses[color]}`}>{text}</span>
      )}
    </div>
  );
}

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