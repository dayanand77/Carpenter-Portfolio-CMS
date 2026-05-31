import { createContext, useContext, useEffect, useState } from 'react';
import { getFirestoreSettings } from '../services/firebase';

const fallbackSettings = {
  workshopName: "Oak & Iron Studio",
  workshopDescription: "",
  workshopShortName: "",
  workshopTagline: "",
  brandLogoUrl: "",
  heroBannerUrl: "",
  aboutBrandIntroduction: "",
  aboutCraftsmanship: "",
  yearsOfExperience: "",
  projectsCompleted: "",
  masterCraftsmenCount: "",
  whatsappNumber: "",
  whatsappApiLink: "",
  phoneCallLink: "",
  phoneDisplayText: "",
  email: "",
  physicalAddress: "",
  googleMapsLink: "",
  googleMapsEmbedUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  pinterestUrl: "",
  youtubeUrl: "",
  heroTitle: "",
  heroSubtitle: "",
  heroDescription: "",
  footerContent: "",
  copyrightText: ""
};

const SettingsContext = createContext(null);

const CACHE_KEY = 'site_settings_cache';

const getCachedSettings = () => {
  try {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
    }
  } catch (e) {
    console.warn("Failed to parse settings cache", e);
  }
  return null;
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => getCachedSettings() || { ...fallbackSettings });
  const [loading, setLoading] = useState(() => !getCachedSettings());
  const [error, setError] = useState(null);

  const loadSettings = async () => {
    try {
      // Only set loading to true if we don't have cached data
      if (!getCachedSettings()) {
        setLoading(true);
      }
      setError(null);
      const data = await getFirestoreSettings();
      setSettings(data);
      
      // Update cache
      if (typeof window !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      }
    } catch (err) {
      setError(err.message);
      if (!getCachedSettings()) {
        setSettings({ ...fallbackSettings });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
