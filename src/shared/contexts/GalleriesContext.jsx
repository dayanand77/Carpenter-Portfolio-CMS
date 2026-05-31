import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFirestoreGalleries, setFirestoreGallery } from '../services/firebase';
import { getSubcategoryImages } from '../data/mockData';
import { useSubcategories } from './SubcategoriesContext';

const GalleriesContext = createContext(null);

export function GalleriesProvider({ children }) {
  const { subcategories, loading: subsLoading } = useSubcategories();
  const [galleries, setGalleries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshGalleries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFirestoreGalleries();
      setGalleries(data);
    } catch (err) {
      console.error("GalleriesContext: failed to load galleries", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshGalleries();
  }, [refreshGalleries]);

  const getGallery = useCallback((slug) => {
    return galleries[slug] || null;
  }, [galleries]);

  const getGalleryImages = useCallback((slug) => {
    const gal = galleries[slug];
    if (!gal || !gal.images) return [];
    return [...gal.images]
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map(img => img.url);
  }, [galleries]);

  const getGalleryCoverImage = useCallback((slug) => {
    const gal = galleries[slug];
    if (!gal) return "";
    return gal.coverImage || "";
  }, [galleries]);

  const getGalleryImageCount = useCallback((slug) => {
    const gal = galleries[slug];
    if (!gal) return 0;
    return gal.imageCount ?? gal.images?.length ?? 0;
  }, [galleries]);

  const saveGallery = useCallback(async (slug, data) => {
    const result = await setFirestoreGallery(slug, data);
    if (result.success) {
      setGalleries(prev => ({ ...prev, [slug]: { ...data } }));
    }
    return result;
  }, []);

  useEffect(() => {
    if (loading || subsLoading || subcategories.length === 0) return;
    const seedMissing = async () => {
      let hasChanges = false;
      for (const sub of subcategories) {
        const slug = sub.slug || sub.id;
        if (!galleries[slug]) {
          hasChanges = true;
          const localImages = getSubcategoryImages(slug);
          const images = localImages.map((url, idx) => ({
            id: `img${idx + 1}`,
            url,
            displayOrder: idx + 1
          }));
          const coverImage = images.length > 0 ? images[0].url : (sub.coverImage || "");
          await setFirestoreGallery(slug, {
            subcategoryId: slug,
            coverImage,
            imageCount: images.length,
            images
          });
        }
      }
      if (hasChanges) {
        const data = await getFirestoreGalleries();
        setGalleries(data);
      }
    };
    seedMissing();
  }, [loading, subsLoading, subcategories, galleries]);

  return (
    <GalleriesContext.Provider value={{
      galleries, loading, error, refreshGalleries,
      getGallery, getGalleryImages, getGalleryCoverImage, getGalleryImageCount, saveGallery
    }}>
      {children}
    </GalleriesContext.Provider>
  );
}

export function useGalleries() {
  const ctx = useContext(GalleriesContext);
  if (!ctx) throw new Error('useGalleries must be used within a GalleriesProvider');
  return ctx;
}
