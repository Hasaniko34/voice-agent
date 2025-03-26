'use client'

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  backLink?: string;
}

export function Header({
  title,
  subtitle,
  breadcrumbs,
  actions,
  backLink,
}: HeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex text-sm text-gray-500 mb-2">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <FiChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-700">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          {backLink && (
            <Link
              href={backLink}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Geri git"
            >
              <FiArrowLeft className="h-4 w-4" />
            </Link>
          )}

          <div className="space-y-1">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-gray-500"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>

        {/* Actions buttons/links */}
        {actions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 sm:mt-0 flex-shrink-0 flex space-x-3"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actions,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 ${className}`}>
      <div>
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="mt-3 sm:mt-0">{actions}</div>}
    </div>
  );
}

// İçerik bölümleri (content sections) için içerik bölümü başlığı
export function ContentHeader({
  title,
  subtitle,
  className = '',
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      <h3 className="font-medium text-gray-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

const HeaderComponents = {
  Header,
  SectionHeader,
  ContentHeader,
};

export default HeaderComponents; 