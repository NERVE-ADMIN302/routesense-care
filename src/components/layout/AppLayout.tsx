import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Toast } from '../common/Toast';
import { X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // If on landing page, render standard full-bleed layout without floating shell
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf2f7] flex flex-col antialiased">
      <div className="flex-1 flex p-2 sm:p-3 lg:p-3.5 gap-3 lg:gap-3.5 overflow-hidden h-screen">
        {/* Desktop Floating Rounded Sidebar */}
        <div className="hidden lg:flex shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Mobile Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#062c25] z-10 p-3 rounded-r-3xl">
              <div className="absolute top-3 right-3 z-20">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-emerald-300 hover:text-white hover:bg-emerald-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div onClick={() => setMobileMenuOpen(false)} className="h-full">
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Application Area with Floating Rounded Topbar and Content */}
        <div className="flex-1 flex flex-col min-w-0 h-full gap-3 overflow-hidden">
          <Topbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto pr-1">
            <Outlet />
          </main>
        </div>
      </div>

      <Toast />
    </div>
  );
};
