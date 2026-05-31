import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../shared/contexts/SettingsContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const phoneUrl = settings.phoneCallLink || null;
  const whatsappUrl = settings.whatsappApiLink || (settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location]);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-350 ${
        scrolled 
          ? 'h-[68px] bg-neutral-50/95 shadow-md shadow-stone-800/5 border-b border-stone-200/50 backdrop-blur-md' 
          : 'h-[80px] bg-neutral-50/85 border-b border-stone-200/30 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3">
            <svg className="w-8 h-8 text-amber-700 shrink-0" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 8H24V24H8V8Z" strokeDasharray="2 2" />
              <path d="M12 4V28M4 12H28" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <circle cx="20" cy="20" r="3" fill="currentColor"/>
            </svg>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-lg uppercase tracking-wider text-stone-800 leading-tight">
                {settings.workshopShortName || settings.workshopName || "Oak & Iron Studio"}
              </span>
              {settings.workshopTagline && (
                <span className="text-[10px] text-stone-400 font-medium tracking-wider uppercase">{settings.workshopTagline}</span>
              )}
            </div>
          </Link>

          {/* Center Navigation Links (Hidden on tablet/mobile below 768px) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm uppercase tracking-wider font-medium relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-amber-600 after:transition-all after:duration-200 ${
                location.pathname === '/' 
                  ? 'text-stone-900 after:w-full' 
                  : 'text-stone-500 hover:text-stone-800 after:w-0 hover:after:w-full'
              }`}
            >
              Browse Designs
            </Link>
            <Link 
              to="/about" 
              className={`text-sm uppercase tracking-wider font-medium relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-amber-600 after:transition-all after:duration-200 ${
                location.pathname === '/about' 
                  ? 'text-stone-900 after:w-full' 
                  : 'text-stone-500 hover:text-stone-800 after:w-0 hover:after:w-full'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm uppercase tracking-wider font-medium relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-amber-600 after:transition-all after:duration-200 ${
                location.pathname === '/contact' 
                  ? 'text-stone-900 after:w-full' 
                  : 'text-stone-500 hover:text-stone-800 after:w-0 hover:after:w-full'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right actions CTA (Hidden on Mobile) */}
          {phoneUrl && (
          <div className="hidden md:flex items-center gap-3">
            <a 
              href={phoneUrl} 
              className="w-11 h-11 rounded-full border border-stone-200 bg-white text-stone-600 flex items-center justify-center transition-all duration-350 hover:bg-stone-50 hover:border-amber-600 hover:text-amber-700 hover:-translate-y-0.5 hover:shadow-sm" 
              title="Call Workshop"
              aria-label="Call Workshop"
            >
              <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M21.384 17.791c-1.422-1.405-3.328-1.314-4.524-.038-.727.778-1.71 1.838-2.036 1.439-.882-1.079-2.974-3.137-4.048-4.004-.385-.311.691-1.309 1.484-2.022 1.29-1.16 1.405-3.085.03-4.524L9.585 5.864c-1.272-1.332-3.138-1.246-4.382.023-.974.992-3.176 3.327-2.128 6.441.977 2.9 3.565 6.401 7.213 9.99 3.655 3.596 7.234 6.079 10.126 6.945 3.097.925 5.37-1.332 6.347-2.327 1.229-1.256 1.282-3.125-.06-4.382l-2.772-2.78v.014z"/>
              </svg>
            </a>
            {whatsappUrl && (
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25d366] text-white font-medium text-xs uppercase tracking-wider shadow-sm transition-all duration-350 hover:bg-[#1ebd58] hover:-translate-y-0.5 hover:shadow-md hover:shadow-green-500/10"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.905-6.993C16.257 1.87 13.771.842 11.13.841 5.692.841 1.269 5.263 1.265 10.702c-.001 1.7.452 3.359 1.314 4.815L1.572 20.67l5.075-1.516zm12.392-5.467c-.33-.165-1.951-.963-2.253-1.073-.303-.11-.523-.165-.743.165-.22.33-.853 1.073-1.046 1.293-.193.22-.386.248-.716.083-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.642-1.953-1.834-2.283-.193-.33-.021-.508.144-.673.148-.148.33-.386.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.019-2.45-.269-.648-.564-.56-.743-.568-.19-.009-.413-.011-.633-.011-.22 0-.578.083-.88.413-.303.33-1.157 1.129-1.157 2.752 0 1.622 1.183 3.193 1.348 3.413.165.22 2.328 3.555 5.639 4.981.787.34 1.4.542 1.88.697.79.25 1.51.215 2.079.129.633-.096 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.569-.083-.138-.303-.22-.633-.385z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            )}
          </div>
          )}

          {/* Hamburger (Mobile/Tablet display below 768px) */}
          <button 
            className="md:hidden w-6 h-6 flex flex-col justify-between" 
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle Navigation Drawer"
          >
            <span className={`w-full h-[2px] bg-stone-800 rounded-sm transition-all origin-left ${drawerOpen ? 'rotate-[45deg]' : ''}`}></span>
            <span className={`w-full h-[2px] bg-stone-800 rounded-sm transition-all ${drawerOpen ? 'w-0 opacity-0' : ''}`}></span>
            <span className={`w-full h-[2px] bg-stone-800 rounded-sm transition-all origin-left ${drawerOpen ? 'rotate-[-45deg]' : ''}`}></span>
          </button>

        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 z-40 bg-stone-900/35 backdrop-blur-xs md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div className={`fixed top-0 right-0 z-50 h-screen w-[75vw] max-w-[320px] bg-white shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-out md:hidden ${
        drawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Workshop Logo & Identity Header */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-150">
          <div className="flex items-center gap-2.5">
            <svg className="w-7 h-7 text-amber-700 shrink-0" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M8 8H24V24H8V8Z" strokeDasharray="2 2" />
              <path d="M12 4V28M4 12H28" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
              <circle cx="20" cy="20" r="2.5" fill="currentColor"/>
            </svg>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-xs uppercase tracking-wider text-stone-900 leading-tight">
                {settings.workshopShortName || settings.workshopName || "Oak & Iron Studio"}
              </span>
              {settings.workshopTagline && (
                <span className="text-[9px] text-stone-400 font-medium tracking-wider uppercase">{settings.workshopTagline}</span>
              )}
            </div>
          </div>
          <button 
            className="w-7 h-7 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-500 hover:text-stone-850 hover:bg-stone-100 transition-colors"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Card-Style Navigation List */}
        <nav className="flex flex-col gap-2.5 py-6 flex-1 overflow-y-auto">
          <Link 
            to="/" 
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl border text-sm font-semibold tracking-wide transition-all ${
              location.pathname === '/' 
                ? 'bg-amber-600/5 text-amber-800 border-amber-500/25' 
                : 'bg-stone-50/50 border-stone-200/40 text-stone-650 hover:bg-stone-100/70'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${location.pathname === '/' ? 'bg-amber-600 text-white' : 'bg-stone-150 text-stone-500'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zm10 0a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <span>Browse Designs</span>
          </Link>

          <Link 
            to="/about" 
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl border text-sm font-semibold tracking-wide transition-all ${
              location.pathname === '/about' 
                ? 'bg-amber-600/5 text-amber-800 border-amber-500/25' 
                : 'bg-stone-50/50 border-stone-200/40 text-stone-650 hover:bg-stone-100/70'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${location.pathname === '/about' ? 'bg-amber-600 text-white' : 'bg-stone-150 text-stone-500'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>About Workshop</span>
          </Link>

          <Link 
            to="/contact" 
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl border text-sm font-semibold tracking-wide transition-all ${
              location.pathname === '/contact' 
                ? 'bg-amber-600/5 text-amber-800 border-amber-500/25' 
                : 'bg-stone-50/50 border-stone-200/40 text-stone-650 hover:bg-stone-100/70'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${location.pathname === '/contact' ? 'bg-amber-600 text-white' : 'bg-stone-150 text-stone-500'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span>Contact</span>
          </Link>
        </nav>

        {/* Separator and Action Buttons */}
        <div className="border-t border-stone-150 pt-5 flex flex-col gap-2.5 mt-auto">
          {phoneUrl && (
          <a 
            href={phoneUrl} 
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-white text-xs font-bold uppercase tracking-wider transition-colors duration-250 shadow-sm"
          >
            <svg className="w-3.5 h-3.5 fill-currentColor shrink-0" viewBox="0 0 24 24">
              <path d="M21.384 17.791c-1.422-1.405-3.328-1.314-4.524-.038-.727.778-1.71 1.838-2.036 1.439-.882-1.079-2.974-3.137-4.048-4.004-.385-.311.691-1.309 1.484-2.022 1.29-1.16 1.405-3.085.03-4.524L9.585 5.864c-1.272-1.332-3.138-1.246-4.382.023-.974.992-3.176 3.327-2.128 6.441.977 2.9 3.565 6.401 7.213 9.99 3.655 3.596 7.234 6.079 10.126 6.945 3.097.925 5.37-1.332 6.347-2.327 1.229-1.256 1.282-3.125-.06-4.382l-2.772-2.78v.014z"/>
            </svg>
            <span>Call Workshop</span>
          </a>
          )}
          {whatsappUrl && (
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25d366] hover:bg-[#1ebd58] text-white text-xs font-bold uppercase tracking-wider transition-colors duration-250 shadow-sm"
          >
            <svg className="w-3.5 h-3.5 fill-currentColor shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.905-6.993C16.257 1.87 13.771.842 11.13.841 5.692.841 1.269 5.263 1.265 10.702c-.001 1.7.452 3.359 1.314 4.815L1.572 20.67l5.075-1.516zm12.392-5.467c-.33-.165-1.951-.963-2.253-1.073-.303-.11-.523-.165-.743.165-.22.33-.853 1.073-1.046 1.293-.193.22-.386.248-.716.083-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.642-1.953-1.834-2.283-.193-.33-.021-.508.144-.673.148-.148.33-.386.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.019-2.45-.269-.648-.564-.56-.743-.568-.19-.009-.413-.011-.633-.011-.22 0-.578.083-.88.413-.303.33-1.157 1.129-1.157 2.752 0 1.622 1.183 3.193 1.348 3.413.165.22 2.328 3.555 5.639 4.981.787.34 1.4.542 1.88.697.79.25 1.51.215 2.079.129.633-.096 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.569-.083-.138-.303-.22-.633-.385z"/>
            </svg>
            <span>WhatsApp Inquiry</span>
          </a>
          )}
        </div>
      </div>
    </>
  );
}
