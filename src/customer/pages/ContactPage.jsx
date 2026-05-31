import React from 'react';
import { useSettings } from '../../shared/contexts/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();
  const phoneUrl = settings.phoneCallLink || null;
  const whatsappUrl = settings.whatsappApiLink || (settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : null);
  const mapsUrl = settings.googleMapsLink || (settings.physicalAddress ? `https://maps.google.com/?q=${encodeURIComponent(settings.physicalAddress)}` : null);

  return (
    <div className="py-12 md:py-20 bg-neutral-50 min-h-[60vh] animate-fadeIn">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Details Col */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div>
              <span className="text-amber-600 text-xs font-semibold uppercase tracking-wider block mb-2">Get In Touch</span>
              <h1 className="font-heading font-medium text-3xl md:text-4xl text-stone-900 leading-tight">Start Your Project</h1>
              <p className="text-stone-500 text-sm mt-3 leading-relaxed">
                Visit our design showroom or reach out directly to request custom dimensions, timber samples, or consultation quotes.
              </p>
            </div>

            {/* Methods list */}
            <div className="flex flex-col gap-6 my-4">
              
              {/* Address */}
              {settings.physicalAddress && (
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest">Showroom & Workshop</span>
                  {mapsUrl ? (
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-amber-800 hover:underline">
                    {settings.physicalAddress}
                  </a>
                  ) : (
                  <span className="text-sm font-semibold text-stone-800">
                    {settings.physicalAddress}
                  </span>
                  )}
                </div>
              </div>
              )}

              {/* Phone */}
              {phoneUrl && (
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest">Phone Call</span>
                  <a href={phoneUrl} className="text-sm font-semibold text-stone-800 hover:text-amber-700">
                    {settings.phoneDisplayText || settings.phoneCallLink}
                  </a>
                </div>
              </div>
              )}

              {/* Email */}
              {settings.email && (
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest">Email Address</span>
                  <a href={`mailto:${settings.email}`} className="text-sm font-semibold text-stone-800 hover:text-amber-700">
                    {settings.email}
                  </a>
                </div>
              </div>
              )}

            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {phoneUrl && (
              <a 
                href={phoneUrl} 
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs uppercase tracking-wider transition-colors duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
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
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded bg-[#25d366] hover:bg-[#1ebd58] text-white font-medium text-xs uppercase tracking-wider transition-colors duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.905-6.993C16.257 1.87 13.771.842 11.13.841 5.692.841 1.269 5.263 1.265 10.702c-.001 1.7.452 3.359 1.314 4.815L1.572 20.67l5.075-1.516zm12.392-5.467c-.33-.165-1.951-.963-2.253-1.073-.303-.11-.523-.165-.743.165-.22.33-.853 1.073-1.046 1.293-.193.22-.386.248-.716.083-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.642-1.953-1.834-2.283-.193-.33-.021-.508.144-.673.148-.148.33-.386.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.019-2.45-.269-.648-.564-.56-.743-.568-.19-.009-.413-.011-.633-.011-.22 0-.578.083-.88.413-.303.33-1.157 1.129-1.157 2.752 0 1.622 1.183 3.193 1.348 3.413.165.22 2.328 3.555 5.639 4.981.787.34 1.4.542 1.88.697.79.25 1.51.215 2.079.129.633-.096 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.569-.083-.138-.303-.22-.633-.385z"/>
                </svg>
                <span>WhatsApp Quote</span>
              </a>
              )}
            </div>

          </div>

          {/* Map Col */}
          {settings.googleMapsEmbedUrl && (
          <div className="lg:col-span-7 h-[350px] md:h-[450px] rounded-lg overflow-hidden border border-stone-200/80 shadow-md">
            <iframe
              src={settings.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Workshop Location"
            />
          </div>
          )}
        </div>

      </div>
    </div>
  );
}
