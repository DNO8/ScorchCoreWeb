'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { NAV_ITEMS } from '@/lib/constants/routes';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-gray-800 bg-gray-900 transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="flex h-full flex-col gap-2 p-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                )}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          {/* Stats Section */}
          <div className="mt-auto space-y-2">
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
              <h4 className="text-xs font-semibold text-gray-400 mb-2">
                Mis Estadísticas
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">CoreMiners:</span>
                  <span className="font-medium text-white">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Geodas:</span>
                  <span className="font-medium text-white">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Poder Total:</span>
                  <span className="font-medium text-white">0</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};
