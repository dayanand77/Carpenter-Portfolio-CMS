import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../shared/contexts/SettingsContext';
import { useCategories } from '../../shared/contexts/CategoriesContext';

export default function Footer() {
  const { settings } = useSettings();
  const { categories } = useCategories();
  const visibleCategories = categories
    .filter(c => c.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const whatsappUrl = settings.whatsappApiLink || (settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : null);

  return (
    <footer className="bg-stone-900 text-stone-300 py-16 border-t border-stone-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 text-white">
              <svg className="w-8 h-8 text-amber-500" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 8H24V24H8V8Z" strokeDasharray="2 2" />
                <path d="M12 4V28M4 12H28" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <circle cx="20" cy="20" r="3" fill="currentColor" />
              </svg>
              <span className="font-heading font-semibold text-lg uppercase tracking-wider">
                {settings.workshopName || "Oak & Iron Studio"}
              </span>
            </Link>
            <p className="text-sm text-stone-400 font-light leading-relaxed max-w-sm">
              {settings.workshopDescription}
            </p>
          </div>

          {/* Showroom Catalog Col */}
          <div>
            <h4 className="font-heading font-semibold text-white text-xs uppercase tracking-widest mb-6">Showroom</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {visibleCategories.map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`} className="hover:text-amber-500 hover:pl-1 transition-all duration-200">
                    {cat.name} Collection
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Quick Links Col */}
          <div>
            <h4 className="font-heading font-semibold text-white text-xs uppercase tracking-widest mb-6">Links</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link to="/about" className="hover:text-amber-500 hover:pl-1 transition-all duration-200">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-500 hover:pl-1 transition-all duration-200">
                  Contact & Maps
                </Link>
              </li>
              {whatsappUrl && (
                <li>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 hover:pl-1 transition-all duration-200">
                    WhatsApp Inquiry
                  </a>
                </li>
              )}
              <li>
                {/* <Link to="/admin/login" className="text-stone-500 hover:text-amber-500 hover:pl-1 transition-all duration-200">
                  Admin Dashboard
                </Link> */}
              </li>
            </ul>
          </div>

          {/* Contact Details Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold text-white text-xs uppercase tracking-widest mb-6">Joinery Studio</h4>
            <p className="text-sm text-stone-400 font-light leading-relaxed">
              {settings.physicalAddress}
            </p>
            {/* Social Links */}
            {(settings.instagramUrl || settings.facebookUrl || settings.pinterestUrl || settings.youtubeUrl) && (
              <div className="flex flex-wrap gap-3 mt-2">
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-500 transition-colors" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  </a>
                )}
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-500 transition-colors" aria-label="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                )}
                {settings.pinterestUrl && (
                  <a href={settings.pinterestUrl} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-500 transition-colors" aria-label="Pinterest">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.782c0-1.67.968-2.914 2.172-2.914 1.027 0 1.518.77 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.566 0 11.954-5.39 11.954-12 0-6.61-5.388-12-11.954-12z" /></svg>
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-500 transition-colors" aria-label="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  </a>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="border-t border-stone-850 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500">
          <span>&copy; {new Date().getFullYear()} {settings.copyrightText || settings.workshopName || "Oak & Iron Studio"}.{!settings.copyrightText ? " All Rights Reserved." : ""}</span>
          <span className="mt-2 md:mt-0">{settings.footerContent}</span>
        </div>

      </div>
    </footer>
  );
}
