import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSettings } from '../../shared/contexts/SettingsContext';

// Floating Actions for customer showroom view
function FloatingActionButtons() {
  const { settings } = useSettings();
  const phoneUrl = settings?.phoneCallLink || null;
  const whatsappUrl = settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : null;
  if (!settings) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
      {/* Phone Call floating button */}
      {phoneUrl && (
        <a
          href={phoneUrl}
          className="w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-stone-850 hover:scale-110 active:scale-95 border border-stone-800"
          aria-label="Call Workshop"
          title="Call Workshop"
        >
          <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
            <path d="M21.384 17.791c-1.422-1.405-3.328-1.314-4.524-.038-.727.778-1.71 1.838-2.036 1.439-.882-1.079-2.974-3.137-4.048-4.004-.385-.311.691-1.309 1.484-2.022 1.29-1.16 1.405-3.085.03-4.524L9.585 5.864c-1.272-1.332-3.138-1.246-4.382.023-.974.992-3.176 3.327-2.128 6.441.977 2.9 3.565 6.401 7.213 9.99 3.655 3.596 7.234 6.079 10.126 6.945 3.097.925 5.37-1.332 6.347-2.327 1.229-1.256 1.282-3.125-.06-4.382l-2.772-2.78v.014z"/>
          </svg>
        </a>
      )}
      {/* WhatsApp floating button */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#1ebd58] hover:scale-110 hover:shadow-green-500/20 active:scale-95 animate-whatsappPulse"
          aria-label="Contact workshop on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <svg className="w-6 h-6 fill-currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.905-6.993C16.257 1.87 13.771.842 11.13.841 5.692.841 1.269 5.263 1.265 10.702c-.001 1.7.452 3.359 1.314 4.815L1.572 20.67l5.075-1.516zm12.392-5.467c-.33-.165-1.951-.963-2.253-1.073-.303-.11-.523-.165-.743.165-.22.33-.853 1.073-1.046 1.293-.193.22-.386.248-.716.083-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.642-1.953-1.834-2.283-.193-.33-.021-.508.144-.673.148-.148.33-.386.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.019-2.45-.269-.648-.564-.56-.743-.568-.19-.009-.413-.011-.633-.011-.22 0-.578.083-.88.413-.303.33-1.157 1.129-1.157 2.752 0 1.622 1.183 3.193 1.348 3.413.165.22 2.328 3.555 5.639 4.981.787.34 1.4.542 1.88.697.79.25 1.51.215 2.079.129.633-.096 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.569-.083-.138-.303-.22-.633-.385z"/>
          </svg>
        </a>
      )}
    </div>
  );
}

export default function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-stone-850 selection:bg-amber-600/10 selection:text-amber-800">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingActionButtons />
    </div>
  );
}
