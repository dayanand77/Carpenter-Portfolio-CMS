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

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({ ...fallbackSettings });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFirestoreSettings();
      setSettings(data);
    } catch (err) {
      setError(err.message);
      setSettings({ ...fallbackSettings });
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
