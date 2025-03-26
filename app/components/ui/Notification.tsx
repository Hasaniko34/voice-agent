'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

// Bildirim tipleri
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Bildirim öğesi için arayüz
export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

// Bildirim bağlamı için arayüz
interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id'>) => void;
  removeNotification: (id: string) => void;
}

// Boş varsayılan bağlam
const defaultContext: NotificationContextType = {
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
};

// Bağlam oluşturma
const NotificationContext = createContext<NotificationContextType>(defaultContext);

// Bağlam kancası
export const useNotification = () => useContext(NotificationContext);

// Bildirim sağlayıcı bileşeni
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Bildirim ekleme
  const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  // Bildirim kaldırma
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

// Bildirim kapsamı
function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Bildirim öğesi
function NotificationItem({
  notification,
  onClose,
}: {
  notification: NotificationItem;
  onClose: () => void;
}) {
  const { id, type, title, message, duration = 5000 } = notification;

  // Otomatik kapatma
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
    return;
  }, [duration, onClose]);

  // Tip bazlı simge ve renk sınıfları
  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          icon: FiCheckCircle,
          bgClass: 'bg-green-50 border-green-200',
          iconClass: 'text-green-500',
          titleClass: 'text-green-800',
          messageClass: 'text-green-700',
        };
      case 'error':
        return {
          icon: FiAlertTriangle,
          bgClass: 'bg-red-50 border-red-200',
          iconClass: 'text-red-500',
          titleClass: 'text-red-800',
          messageClass: 'text-red-700',
        };
      case 'warning':
        return {
          icon: FiAlertTriangle,
          bgClass: 'bg-yellow-50 border-yellow-200',
          iconClass: 'text-yellow-500',
          titleClass: 'text-yellow-800',
          messageClass: 'text-yellow-700',
        };
      case 'info':
      default:
        return {
          icon: FiInfo,
          bgClass: 'bg-blue-50 border-blue-200',
          iconClass: 'text-blue-500',
          titleClass: 'text-blue-800',
          messageClass: 'text-blue-700',
        };
    }
  };

  const { icon: Icon, bgClass, iconClass, titleClass, messageClass } = getTypeStyles(type);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-lg shadow-lg border ${bgClass} max-w-md w-full flex`}
    >
      <div className="flex-shrink-0">
        <Icon className={`h-5 w-5 ${iconClass}`} />
      </div>
      <div className="ml-3 flex-1">
        <p className={`text-sm font-medium ${titleClass}`}>{title}</p>
        {message && <p className={`mt-1 text-sm ${messageClass}`}>{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="ml-4 flex-shrink-0 inline-flex text-gray-400 focus:outline-none focus:text-gray-500 hover:text-gray-500"
      >
        <FiX className="h-5 w-5" />
      </button>
    </motion.div>
  );
}

// Yardımcı fonksiyonlar
export function useSuccessNotification() {
  const { addNotification } = useNotification();
  return (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration });
  };
}

export function useErrorNotification() {
  const { addNotification } = useNotification();
  return (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration });
  };
}

export function useInfoNotification() {
  const { addNotification } = useNotification();
  return (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration });
  };
}

export function useWarningNotification() {
  const { addNotification } = useNotification();
  return (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration });
  };
}

export { NotificationContext }; 