import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFirestoreSubcategories } from '../services/firebase';
import { seedDefaultSubcategoryImages } from '../data/mockData';

const SubcategoriesContext = createContext(null);

const CACHE_KEY = 'site_subcategories_cache';

const getCachedSubcategories = () => {
  try {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
    }
  } catch (e) {
    console.warn("Failed to parse subcategories cache", e);
  }
  return null;
};

export function SubcategoriesProvider({ children }) {
  const [subcategories, setSubcategories] = useState(() => getCachedSubcategories() || []);
  const [loading, setLoading] = useState(() => !getCachedSubcategories());
  const [error, setError] = useState(null);

  const refreshSubcategories = useCallback(async () => {
    if (!getCachedSubcategories()) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getFirestoreSubcategories();
      setSubcategories(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      }
      seedDefaultSubcategoryImages();
    } catch (err) {
      console.error("SubcategoriesContext: failed to load subcategories", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSubcategories();
  }, [refreshSubcategories]);

  return (
    <SubcategoriesContext.Provider value={{ subcategories, loading, error, refreshSubcategories }}>
      {children}
    </SubcategoriesContext.Provider>
  );
}

export function useSubcategories() {
  const ctx = useContext(SubcategoriesContext);
  if (!ctx) throw new Error('useSubcategories must be used within a SubcategoriesProvider');
  return ctx;
}
