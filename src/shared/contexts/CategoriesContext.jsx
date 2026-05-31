import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFirestoreCategories } from '../services/firebase';

const CategoriesContext = createContext(null);

const fallbackCategories = [
  { id: "doors", name: "Doors", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 0, visible: true },
  { id: "windows", name: "Windows", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 1, visible: true },
  { id: "tables", name: "Tables", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 2, visible: true },
  { id: "chairs", name: "Chairs", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 3, visible: true },
  { id: "beds", name: "Beds", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 4, visible: true },
  { id: "cupboards", name: "Cupboards", coverImage: "/assets/images/door_single.png", description: "", displayOrder: 5, visible: true }
];

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFirestoreCategories();
      setCategories(data);
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
