'use client'

import { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';

// Görünür olma animasyonu
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Aşağıdan yukarıya kaydırma animasyonu
export function SlideUp({
  children,
  delay = 0,
  duration = 0.5,
  distance = 20,
  className = '',
  ...props
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Ölçeklendirme animasyonu
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Liste öğeleri için adım adım animasyon
export function StaggeredList({
  children,
  delay = 0.1,
  staggerDelay = 0.1,
  className = '',
  ...props
}: {
  children: ReactNode[];
  delay?: number;
  staggerDelay?: number;
  className?: string;
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      {...props}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Sayfa geçiş animasyonu
export function PageTransition({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLMotionProps<'div'>) {
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: 20,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Dikkat çekici vurgulama animasyonu
export function Highlight({
  children,
  color = 'blue',
  className = '',
  ...props
}: {
  children: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
} & HTMLMotionProps<'div'>) {
  const colorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
  };

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      {...props}
    >
      <motion.div
        className={`absolute inset-0 ${colorClasses[color]} rounded-md -z-10`}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      {children}
    </motion.div>
  );
}

// Dalga efekti
export function WaveBackground({
  children,
  className = '',
  color = 'blue',
  ...props
}: {
  children?: ReactNode;
  className?: string;
  color?: 'blue' | 'green' | 'purple';
} & HTMLMotionProps<'div'>) {
  const colorClasses = {
    blue: 'from-blue-100 via-white to-blue-50',
    green: 'from-green-100 via-white to-green-50',
    purple: 'from-purple-100 via-white to-purple-50',
  };

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      <motion.div
        className={`absolute -bottom-16 left-0 right-0 h-24 bg-gradient-to-r ${colorClasses[color]}`}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          borderTopLeftRadius: '50%',
          borderTopRightRadius: '50%',
          transform: 'scaleX(1.5)',
        }}
      />
      {children}
    </div>
  );
}

// Pulse animasyonu
export function PulseEffect({
  children,
  className = '',
  color = 'blue',
  ...props
}: {
  children: ReactNode;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow';
} & HTMLMotionProps<'div'>) {
  const colorClasses = {
    blue: 'shadow-blue-200',
    green: 'shadow-green-200',
    red: 'shadow-red-200',
    yellow: 'shadow-yellow-200',
  };

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          '0 0 0 0 rgba(0, 0, 0, 0)',
          '0 0 0 20px rgba(0, 0, 0, 0.1)',
          '0 0 0 0 rgba(0, 0, 0, 0)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Parlama efekti
export function Shimmer({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          repeatDelay: 1,
        }}
      />
    </motion.div>
  );
}

export function CardHover({
  children,
  className = '',
  hoverScale = 1.03,
  ...props
}: {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={`rounded-lg ${className}`}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Tüm animasyon bileşenlerini dışa aktar
export const Animations = {
  FadeIn,
  SlideUp,
  ScaleIn,
  StaggeredList,
  PageTransition,
  Highlight,
  WaveBackground,
  PulseEffect,
  Shimmer,
  CardHover,
};

export default Animations; 