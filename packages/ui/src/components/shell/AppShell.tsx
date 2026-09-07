'use client';

import React, { useState } from 'react';
import { GovMasthead } from './GovMasthead';
import { AppHeader } from './AppHeader';
import { Sidebar, type SidebarNavItem } from './Sidebar';
import { MobileNav } from './MobileNav';

export interface AppShellProps {
  children: React.ReactNode;
  navItems?: SidebarNavItem[];
  activeNavId?: string;
  onNavSelect?: (item: SidebarNavItem) => void;
  userRole?: string;
  userName?: string;
  notificationCount?: number;
  sidebarCollapsed?: boolean;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  navItems,
  activeNavId = 'dashboard',
  onNavSelect,
  userRole,
  userName,
  notificationCount,
  sidebarCollapsed = false,
  className = '',
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${className}`}>
      {/* Government Top Masthead */}
      <GovMasthead skipToId="main-content" />

      {/* Primary Application Header */}
      <AppHeader
        userRole={userRole}
        userName={userName}
        notificationCount={notificationCount}
        onMenuToggle={() => setMobileNavOpen(true)}
      />

      {/* Main Administrative Layout Area */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Persistent Sidebar */}
        <div className="hidden md:block shrink-0">
          <Sidebar
            items={navItems}
            activeId={activeNavId}
            onSelect={onNavSelect}
            collapsed={sidebarCollapsed}
            className="min-h-full"
          />
        </div>

        {/* Mobile Navigation Sheet */}
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          items={navItems}
          activeId={activeNavId}
          onSelect={onNavSelect}
        />

        {/* Primary Page Canvas */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
