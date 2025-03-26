'use client'

import { ReactNode, HTMLAttributes } from 'react';

// Form konteyner bileşeni
interface FormProps extends HTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export function Form({ children, className = '', onSubmit, ...props }: FormProps) {
  return (
    <form 
      className={`space-y-6 ${className}`} 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit(e);
      }}
      {...props}
    >
      {children}
    </form>
  );
}

// Form grup bileşeni
interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function FormGroup({ children, className = '', ...props }: FormGroupProps) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

// Form etiket bileşeni
interface FormLabelProps extends HTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
}

export function FormLabel({ children, htmlFor, required = false, className = '', ...props }: FormLabelProps) {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-900 ${className}`} 
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

// Form açıklama bileşeni
interface FormDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function FormDescription({ children, className = '', ...props }: FormDescriptionProps) {
  return (
    <p className={`text-sm text-gray-600 ${className}`} {...props}>
      {children}
    </p>
  );
}

// Form mesaj bileşeni (hata, başarı, bilgi)
type MessageType = 'error' | 'success' | 'info';

interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  type?: MessageType;
}

export function FormMessage({ children, type = 'error', className = '', ...props }: FormMessageProps) {
  const messageClasses = {
    error: 'text-red-600',
    success: 'text-green-600',
    info: 'text-blue-600',
  };

  return (
    <p className={`text-sm ${messageClasses[type]} mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

// Form bölümü bileşeni
interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function FormSection({ children, title, description, className = '', ...props }: FormSectionProps) {
  return (
    <div className={`border-b border-gray-200 pb-6 ${className}`} {...props}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

// Form eylemleri bileşeni (gönderme, iptal butonları)
interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function FormActions({ children, className = '', ...props }: FormActionsProps) {
  return (
    <div className={`flex justify-end space-x-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

// Form satırı bileşeni
interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function FormRow({ children, className = '', ...props }: FormRowProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export const FormComponents = {
  Form,
  Group: FormGroup,
  Label: FormLabel,
  Description: FormDescription,
  Message: FormMessage,
  Section: FormSection,
  Actions: FormActions,
  Row: FormRow
};

export default FormComponents; 