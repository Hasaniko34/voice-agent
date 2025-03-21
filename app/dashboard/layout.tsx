'use client'

import { Inter } from "next/font/google";
import Sidebar from "../components/dashboard/Sidebar";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isSidebarCollapsed={isSidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />
      <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 