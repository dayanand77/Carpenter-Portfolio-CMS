import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFirestoreSubcategories } from '../services/firebase';
import { seedDefaultSubcategoryImages } from '../data/mockData';

const SubcategoriesContext = createContext(null);

export function SubcategoriesProvider({ children }) {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshSubcategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFirestoreSubcategories();
      setSubcategories(data);
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
