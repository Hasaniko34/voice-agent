'use client'

import { ReactNode } from 'react';

// Shadow bileşeni için props tanımı
export interface ShadowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  elevation?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  hover?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// Gerçekçi gölge bileşeni
export function Shadow({
  children,
  elevation = 'md',
  color = 'default',
  rounded = 'md',
  hover = 'none',
  className = '',
  ...props
}: ShadowProps) {
  // Gölge varyantları sınıfları
  const elevationClasses = {
    none: '',
    xs: 'shadow-sm',
    sm: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  const colorClasses = {
    default: '',
    primary: 'shadow-primary/20',
    secondary: 'shadow-gray-200/80',
    info: 'shadow-blue-200/80',
    success: 'shadow-green-200/80',
    warning: 'shadow-yellow-200/80',
    danger: 'shadow-red-200/80',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  const hoverClasses = {
    none: '',
    sm: 'transition-shadow hover:shadow-md',
    md: 'transition-shadow hover:shadow-lg',
    lg: 'transition-shadow hover:shadow-xl',
    xl: 'transition-shadow hover:shadow-2xl',
  };

  const shadowClass = `${elevationClasses[elevation]} ${colorClasses[color]} ${roundedClasses[rounded]} ${hoverClasses[hover]} ${className}`;

  return (
    <div
      className={shadowClass}
      {...props}
    >
      {children}
    </div>
  );
}

// Özel 3D efekti için bileşen
export function Shadow3D({
  children,
  color = 'default',
  depth = 'md',
  rounded = 'md',
  className = '',
  ...props
}: {
  children: ReactNode;
  color?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
  depth?: 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  // Derinlik seviyesine göre z-offset değeri
  const depthValues = {
    sm: '2px',
    md: '4px',
    lg: '6px',
  };

  // Renk varyantlarına göre gölge renkleri
  const colorValues = {
    default: 'rgba(0, 0, 0, 0.1)',
    primary: 'rgba(79, 70, 229, 0.2)',
    secondary: 'rgba(156, 163, 175, 0.2)',
    info: 'rgba(59, 130, 246, 0.2)',
    success: 'rgba(34, 197, 94, 0.2)',
    warning: 'rgba(234, 179, 8, 0.2)',
    danger: 'rgba(239, 68, 68, 0.2)',
  };

  // Yuvarlatma değerleri için sınıf isimleri
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`relative inline-block ${roundedClasses[rounded]} ${className}`}
      style={{
        transform: 'translateZ(0)', // 3D hızlandırma için
      }}
      {...props}
    >
      {/* Gölge katmanı */}
      <div
        className={`absolute inset-0 ${roundedClasses[rounded]}`}
        style={{
          transform: `translate(${depthValues[depth]}, ${depthValues[depth]})`,
          backgroundColor: colorValues[color],
          zIndex: -1,
        }}
      />
      {/* İçerik */}
      <div className={`relative ${roundedClasses[rounded]} bg-white border border-gray-100`}>
        {children}
      </div>
    </div>
  );
}

// Neon efekti için bileşen
export function NeonEffect({
  children,
  color = 'primary',
  intensity = 'md',
  pulse = false,
  rounded = 'md',
  className = '',
  ...props
}: {
  children: ReactNode;
  color?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
  intensity?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  // Renk varyantlarına göre gölge renkleri
  const colorValues = {
    primary: 'rgba(79, 70, 229, 1)',
    info: 'rgba(59, 130, 246, 1)',
    success: 'rgba(34, 197, 94, 1)',
    warning: 'rgba(234, 179, 8, 1)',
    danger: 'rgba(239, 68, 68, 1)',
  };

  // Yoğunluk seviyesine göre gölge boyutu
  const intensityValues = {
    sm: '0 0 5px 0',
    md: '0 0 10px 0',
    lg: '0 0 20px 0',
  };

  // Yuvarlatma değerleri için sınıf isimleri
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`
        relative 
        ${roundedClasses[rounded]} 
        ${pulse ? 'animate-pulse' : ''} 
        ${className}
      `}
      style={{
        boxShadow: `${intensityValues[intensity]} ${colorValues[color]}`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// Tüm gölge bileşenlerini dışa aktar
export const Shadows = {
  Shadow,
  Shadow3D,
  NeonEffect,
};

export default Shadows; 