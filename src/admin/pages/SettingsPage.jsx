import { useState, useEffect, useCallback } from 'react';
import { saveFirestoreSettings } from '../../shared/services/firebase';
import { useSettings } from '../../shared/contexts/SettingsContext';

function ImageUploader({ value, onUpload, onRemove, label }) {
  const inputId = `img-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex items-start gap-4">
      <div className="w-24 h-24 rounded-lg border border-stone-200 bg-stone-50 overflow-hidden shrink-0 flex items-center justify-center">
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-contain" />
        ) : (
          <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors border border-stone-200/60 self-start">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {value ? 'Replace' : 'Upload'}
        </label>
        <input id={inputId} type="file" accept="image/*" onChange={onUpload} className="hidden" />
        {value && (
          <button type="button" onClick={onRemove} className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors self-start">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

const isValidUrl = (str) => {
  if (!str) return true;
  try { new URL(str); return true; }
  catch { return false; }
};

export default function SettingsPage() {
  const { settings: firestoreSettings, loading: fsLoading, error: fsError, refreshSettings } = useSettings();
  const [settings, setSettings] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (firestoreSettings) {
      setSettings(firestoreSettings);
      setDirty(false);
    }
  }, [firestoreSettings]);

  useEffect(() => {
    if (!dirty) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  const markDirty = useCallback((updater) => {
    setSettings(updater);
    setDirty(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    markDirty((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppChange = (e) => {
    const value = e.target.value;
    const clean = value.replace(/[^0-9]/g, '');
    markDirty((prev) => ({
      ...prev,
      whatsappNumber: value,
      whatsappApiLink: clean ? `https://wa.me/${clean}` : ''
    }));
  };

  const handlePhoneDisplayChange = (e) => {
    const value = e.target.value;
    const clean = value.replace(/[^0-9+]/g, '');
    markDirty((prev) => ({
      ...prev,
      phoneDisplayText: value,
      phoneCallLink: clean ? `tel:${clean}` : ''
    }));
  };

  const handleImageUpload = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      markDirty((prev) => ({ ...prev, [field]: ev.target.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = (field) => () => {
    markDirty((prev) => ({ ...prev, [field]: '' }));
  };

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlFields = [
      { key: 'brandLogoUrl', label: 'Brand Logo URL' },
      { key: 'heroBannerUrl', label: 'Hero Banner URL' },
      { key: 'whatsappApiLink', label: 'WhatsApp API Link' },
      { key: 'phoneCallLink', label: 'Phone Call Link' },
      { key: 'googleMapsLink', label: 'Google Maps Link' },
      { key: 'googleMapsEmbedUrl', label: 'Google Maps Embed URL' },
      { key: 'instagramUrl', label: 'Instagram URL' },
      { key: 'facebookUrl', label: 'Facebook URL' },
      { key: 'pinterestUrl', label: 'Pinterest URL' },
      { key: 'youtubeUrl', label: 'YouTube URL' },
    ];
    for (const { key, label } of urlFields) {
      const val = settings[key];
      if (val && !isValidUrl(val)) {
        showToast(`Invalid URL: ${label}`, 'error');
        return;
      }
    }
    setSaving(true);
    const result = await saveFirestoreSettings(settings);
    setSaving(false);
    if (result.success) {
      showToast("Website settings saved successfully!", "success");
      setDirty(false);
      refreshSettings();
    } else {
      showToast(result.error || "Failed to save settings.", "error");
    }
  };

  if (fsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (fsError && !settings) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-red-50 border-l-2 border-red-500 text-red-700 text-sm px-6 py-4 rounded max-w-lg">
          <p className="font-semibold mb-1">Failed to load settings</p>
          <p className="text-xs">{fsError}</p>
          <button
            onClick={refreshSettings}
            className="mt-3 text-xs font-semibold text-red-800 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-stone-500 text-sm">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs md:text-sm">
      
      {toast && (
        <div className={`fixed bottom-5 right-5 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 border z-50 animate-fadeIn ${
          toastType === 'error' ? 'bg-red-700 border-red-600' : 'bg-stone-900 border-stone-800'
        }`}>
          {toastType === 'error' ? (
            <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Website Settings</h1>
          <p className="text-stone-500 text-sm">Manage your showroom branding, hero, about, contact, social, and footer content.</p>
        </div>
        {dirty && (
          <span className="text-amber-600 text-xs font-semibold bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/60">
            Unsaved changes
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ── SECTION 1: BRANDING & LOGO ── */}
        <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-medium text-stone-900 border-b border-stone-100 pb-3">Branding &amp; Logo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Workshop Full Name</label>
              <input type="text" name="workshopName" value={settings.workshopName || ''} onChange={handleChange} required
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. Oak &amp; Iron Studio" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Logo Text (Compact)</label>
              <input type="text" name="workshopShortName" value={settings.workshopShortName || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. O&amp;I" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Logo Subtitle / Tagline</label>
              <input type="text" name="workshopTagline" value={settings.workshopTagline || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. Artisanal Woodcraft Since 1998" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Workshop Description</label>
              <input type="text" name="workshopDescription" value={settings.workshopDescription || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="Short tagline for footer &amp; about" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Workshop Logo Image</label>
              <ImageUploader
                value={settings.brandLogoUrl}
                onUpload={handleImageUpload('brandLogoUrl')}
                onRemove={handleRemoveImage('brandLogoUrl')}
                label="Workshop Logo"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: ABOUT SHOWROOM ── */}
        <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-medium text-stone-900 border-b border-stone-100 pb-3">About Showroom</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Brand Introduction</label>
              <textarea name="aboutBrandIntroduction" value={settings.aboutBrandIntroduction || ''} onChange={handleChange}
                rows="2" className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors resize-none"
                placeholder="Tell your brand story..." />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Craftsmanship &amp; Experience</label>
              <textarea name="aboutCraftsmanship" value={settings.aboutCraftsmanship || ''} onChange={handleChange}
                rows="2" className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors resize-none"
                placeholder="Describe your craftsmanship..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Years of Experience</label>
              <input type="text" name="yearsOfExperience" value={settings.yearsOfExperience || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. 25" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Projects Completed</label>
              <input type="text" name="projectsCompleted" value={settings.projectsCompleted || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. 500+" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Master Craftsmen</label>
              <input type="text" name="masterCraftsmenCount" value={settings.masterCraftsmenCount || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. 12" />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: CONTACT & LOCATION ── */}
        <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-medium text-stone-900 border-b border-stone-100 pb-3">Contact &amp; Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">WhatsApp Number</label>
              <input type="text" name="whatsappNumber" value={settings.whatsappNumber || ''} onChange={handleWhatsAppChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. 1234567890" />
              <p className="text-[10px] text-stone-400 mt-1">Auto-generates WhatsApp API link</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">WhatsApp API Link</label>
              <input type="url" name="whatsappApiLink" value={settings.whatsappApiLink || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="Auto-generated" readOnly />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Phone Number Display Text</label>
              <input type="text" name="phoneDisplayText" value={settings.phoneDisplayText || ''} onChange={handlePhoneDisplayChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. +1 (234) 567-890" />
              <p className="text-[10px] text-stone-400 mt-1">Auto-generates tel: link</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Phone Call Protocol Link</label>
              <input type="url" name="phoneCallLink" value={settings.phoneCallLink || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="Auto-generated" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Email Address</label>
              <input type="email" name="email" value={settings.email || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. hello@example.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Physical Address</label>
              <input type="text" name="physicalAddress" value={settings.physicalAddress || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. 742 Artisan Way, Woodworkers District" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Google Maps Link</label>
              <input type="url" name="googleMapsLink" value={settings.googleMapsLink || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="https://maps.google.com/?q=..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Google Maps Embed URL</label>
              <input type="url" name="googleMapsEmbedUrl" value={settings.googleMapsEmbedUrl || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
          </div>
        </div>

        {/* ── SECTION 4: SOCIAL SHOWROOM HANDLES ── */}
        <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-medium text-stone-900 border-b border-stone-100 pb-3">Social Showroom Handles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Instagram URL</label>
              <input type="url" name="instagramUrl" value={settings.instagramUrl || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="https://instagram.com/yourhandle" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Facebook URL</label>
              <input type="url" name="facebookUrl" value={settings.facebookUrl || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="https://facebook.com/yourpage" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Pinterest URL</label>
              <input type="url" name="pinterestUrl" value={settings.pinterestUrl || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="https://pinterest.com/yourhandle" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">YouTube URL</label>
              <input type="url" name="youtubeUrl" value={settings.youtubeUrl || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="https://youtube.com/@yourchannel" />
            </div>
          </div>
        </div>

        {/* ── SECTION 5: HOMEPAGE CONTENT ── */}
        <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-medium text-stone-900 border-b border-stone-100 pb-3">Homepage Hero</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Hero Title</label>
              <input type="text" name="heroTitle" value={settings.heroTitle || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="Main heading on hero section" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Hero Subtitle</label>
              <input type="text" name="heroSubtitle" value={settings.heroSubtitle || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="Small label above the title" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Hero Description</label>
              <textarea name="heroDescription" value={settings.heroDescription || ''} onChange={handleChange}
                rows="2" className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors resize-none"
                placeholder="Paragraph text shown on the hero section" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Hero Banner Image</label>
              <ImageUploader
                value={settings.heroBannerUrl}
                onUpload={handleImageUpload('heroBannerUrl')}
                onRemove={handleRemoveImage('heroBannerUrl')}
                label="Hero Banner"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 6: FOOTER ── */}
        <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-medium text-stone-900 border-b border-stone-100 pb-3">Footer</h3>
          
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Footer Content</label>
              <textarea name="footerContent" value={settings.footerContent || ''} onChange={handleChange}
                rows="2" className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors resize-none"
                placeholder="Additional footer text..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Copyright Text</label>
              <input type="text" name="copyrightText" value={settings.copyrightText || ''} onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="e.g. Oak &amp; Iron Studio. All Rights Reserved." />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pb-12">
          <button type="button" onClick={() => { setSettings(firestoreSettings); setDirty(false); }}
            className="px-6 py-2.5 border border-stone-250 text-stone-700 hover:bg-stone-50 rounded-lg text-sm font-semibold transition-colors">
            Reset Fields
          </button>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors shadow-xs">
            {saving ? "Saving..." : "Save Settings Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}