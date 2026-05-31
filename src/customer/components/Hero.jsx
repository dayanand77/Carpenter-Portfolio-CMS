import React from 'react';
import SkeletonImage from '../../shared/components/SkeletonImage';
import { useSettings } from '../../shared/contexts/SettingsContext';

export default function Hero() {
  const { settings } = useSettings();
  const whatsappUrl = settings.whatsappApiLink || (settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : null);

  const handleBrowseClick = (e) => {
    e.preventDefault();
    const catalogElement = document.getElementById('catalog-showroom');
    if (catalogElement) {
      const headerOffset = 80;
      const elementPosition = catalogElement.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative w-full h-[calc(100vh-80px)] h-[calc(100dvh-80px)] min-h-[480px] max-h-[800px] flex items-center justify-start text-white overflow-hidden bg-stone-950">
      
      {/* Hero Background */}
      {settings.heroBannerUrl ? (
        <SkeletonImage src={settings.heroBannerUrl} alt="" className="w-full h-full object-cover" wrapperClassName="absolute inset-0 z-0" />
      ) : null}
      
      {/* Ambient Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-900/60 to-stone-900/85 z-0" />

      {/* Hero Content Overlay */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-[650px] flex flex-col gap-5 md:gap-6 p-6 md:p-0 rounded-xl md:rounded-none bg-stone-900/40 md:bg-transparent border border-white/5 md:border-none backdrop-blur-xs md:backdrop-blur-none animate-fadeIn">
          
          {settings.heroSubtitle && (
          <span className="text-amber-500 font-heading text-xs font-semibold uppercase tracking-[0.15em]">
            {settings.heroSubtitle}
          </span>
          )}
          
          <h1 className="font-heading font-medium text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-white">
            {settings.heroTitle || settings.workshopName || "Oak & Iron Studio"}
          </h1>
          
          <p className="text-stone-300 font-light text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
            {settings.heroDescription || settings.workshopDescription}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <a 
              href="#catalog-showroom" 
              onClick={handleBrowseClick}
              className="px-6 py-3 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs uppercase tracking-wider transition-all duration-350 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Browse Designs
            </a>
            {whatsappUrl && (
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded border border-white/20 bg-stone-900/80 hover:bg-[#25d366] hover:border-[#25d366] text-white font-medium text-xs uppercase tracking-wider transition-all duration-350 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.905-6.993C16.257 1.87 13.771.842 11.13.841 5.692.841 1.269 5.263 1.265 10.702c-.001 1.7.452 3.359 1.314 4.815L1.572 20.67l5.075-1.516zm12.392-5.467c-.33-.165-1.951-.963-2.253-1.073-.303-.11-.523-.165-.743.165-.22.33-.853 1.073-1.046 1.293-.193.22-.386.248-.716.083-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.642-1.953-1.834-2.283-.193-.33-.021-.508.144-.673.148-.148.33-.386.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.019-2.45-.269-.648-.564-.56-.743-.568-.19-.009-.413-.011-.633-.011-.22 0-.578.083-.88.413-.303.33-1.157 1.129-1.157 2.752 0 1.622 1.183 3.193 1.348 3.413.165.22 2.328 3.555 5.639 4.981.787.34 1.4.542 1.88.697.79.25 1.51.215 2.079.129.633-.096 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.569-.083-.138-.303-.22-.633-.385z"/>
              </svg>
              <span>WhatsApp Us</span>
            </a>
            )}
          </div>

        </div>
      </div>

    </section>
  );
}
