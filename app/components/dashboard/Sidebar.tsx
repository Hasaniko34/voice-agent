'use client'

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiMenu, 
  FiHome, 
  FiMic, 
  FiSettings,
  FiPhone,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiClock,
  FiList,
  FiLogOut
} from 'react-icons/fi';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isSidebarCollapsed, setSidebarCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    // LocalStorage'dan token ve user bilgilerini temizle
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Ana sayfaya yönlendir
    router.push('/');
  };

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Ana Sayfa',
      icon: FiHome
    },
    {
      path: '/dashboard/voice-agents',
      name: 'Ses Asistanları',
      icon: FiHome,
    },
    {
      path: '/dashboard/call',
      name: 'Telefon Ara',
      icon: FiPhone,
    },
    {
      path: '/dashboard/call-history',
      name: 'Geçmiş Aramalar',
      icon: FiClock,
    },
    {
      path: '/dashboard/planned-calls',
      name: 'Planlı Aramalar',
      icon: FiList,
    },
    {
      path: '/dashboard/settings',
      name: 'Ayarlar',
      icon: FiSettings
    }
  ];

  return (
    <aside 
      className={`bg-white fixed h-full border-r border-gray-200 transition-all duration-300 z-10 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!isSidebarCollapsed && (
          <h1 className="text-xl font-semibold text-gray-800">Voice AI</h1>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="px-2 py-4 flex flex-col h-[calc(100%-4rem)]">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* Çıkış yap butonu */}
        <div className="mt-auto mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <FiLogOut className={`${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
            {!isSidebarCollapsed && <span>Çıkış Yap</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
} 