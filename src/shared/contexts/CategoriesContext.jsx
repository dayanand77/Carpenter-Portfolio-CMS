import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFirestoreCategories } from '../services/firebase';

const CategoriesContext = createContext(null);

const CACHE_KEY = 'site_categories_cache';

const getCachedCategories = () => {
  try {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
    }
  } catch (e) {
    console.warn("Failed to parse categories cache", e);
  }
  return null;
};

const fallbackCategories = [
  { id: "doors", name: "Doors", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 0, visible: true },
  { id: "windows", name: "Windows", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 1, visible: true },
  { id: "tables", name: "Tables", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 2, visible: true },
  { id: "chairs", name: "Chairs", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 3, visible: true },
  { id: "beds", name: "Beds", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 4, visible: true },
  { id: "cupboards", name: "Cupboards", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 5, visible: true }
];

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(() => getCachedCategories() || fallbackCategories);
  const [loading, setLoading] = useState(() => !getCachedCategories());
  const [error, setError] = useState(null);

  const refreshCategories = useCallback(async () => {
    if (!getCachedCategories()) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getFirestoreCategories();
      setCategories(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      }
    } catch (err) {
      console.error("CategoriesContext: failed to load categories", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  return (
    <CategoriesContext.Provider value={{ categories, loading, error, refreshCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within a CategoriesProvider');
  return ctx;
}
