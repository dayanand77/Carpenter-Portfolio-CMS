import React, { useState, useEffect } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../../shared/services/firebase';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { name: "Overview", path: "/admin/dashboard", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zm10 0a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"/>
      </svg>
    )},
    { name: "Categories", path: "/admin/categories", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>
    )},
    { name: "Subcategories", path: "/admin/subcategories", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4M4 4v16m0 0l5-5m11 1v4m0 0h-4m4 0l-5-5"/>
      </svg>
    )},
    { name: "Website Settings", path: "/admin/settings", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    )}
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex font-body">
      
      {/* Sidebar for Desktop (Hidden on mobile) */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-stone-900 text-stone-300 border-r border-stone-850 shrink-0">
        {/* Brand header */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-stone-850 bg-stone-950/40">
          <svg className="w-6 h-6 text-amber-500" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 8H24V24H8V8Z" strokeDasharray="2 2" />
            <path d="M12 4V28M4 12H28" strokeLinecap="round"/>
          </svg>
          <span className="font-heading font-semibold text-white tracking-widest text-sm uppercase">Admin Panel</span>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-6 flex flex-col gap-1.5">
          {navItems.map(item => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded text-sm font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'bg-amber-600 text-white' 
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer / Signout */}
        <div className="p-6 border-t border-stone-850">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded text-sm font-medium text-stone-400 hover:bg-red-950/20 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-stone-200/80 flex items-center justify-between px-6 z-35 shrink-0">
          
          {/* Hamburger toggle for mobile sidebar */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-stone-600 p-1.5 rounded hover:bg-stone-50"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Quick title indicator */}
          <h2 className="font-heading font-medium text-stone-800 text-base md:text-lg">
            {navItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
          </h2>

          {/* Customer Site Preview Link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-stone-250 hover:bg-stone-50 text-xs font-semibold text-stone-600 transition-all duration-200"
          >
            <span>View Showroom</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </Link>
        </header>

        {/* Dashboard Pages Content viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Panel Drawer */}
      <aside className={`fixed top-0 left-0 z-50 h-screen w-[260px] bg-stone-900 text-stone-300 flex flex-col transition-transform duration-300 ease-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-stone-850 bg-stone-950/40">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-amber-500" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 8H24V24H8V8Z" strokeDasharray="2 2" />
              <path d="M12 4V28M4 12H28" strokeLinecap="round"/>
            </svg>
            <span className="font-heading font-semibold text-white tracking-widest text-sm uppercase">Admin Panel</span>
          </div>
          <button className="text-stone-400" onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-6 flex flex-col gap-1.5">
          {navItems.map(item => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded text-sm font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'bg-amber-600 text-white' 
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-stone-850">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded text-sm font-medium text-stone-400 hover:bg-red-950/20 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

    </div>
  );
}
