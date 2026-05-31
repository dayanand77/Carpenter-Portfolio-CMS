import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import CategoryRow from '../components/CategoryRow';
import { useCategories } from '../../shared/contexts/CategoriesContext';
import { useSubcategories } from '../../shared/contexts/SubcategoriesContext';

export default function HomePage({ onImageClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { categories: ctxCategories } = useCategories();
  const { subcategories: ctxSubcategories } = useSubcategories();

  const categories = useMemo(() => ctxCategories
    .filter(c => c.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)), [ctxCategories]);

  const subcategories = useMemo(() => ctxSubcategories
    .filter(s => s.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)), [ctxSubcategories]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories.map(cat => ({
        category: cat,
        subcategories: subcategories.filter(sub => sub.categoryId === cat.id)
      }));
    }
    const term = searchTerm.toLowerCase();
    return categories
      .map(cat => {
        const matchingCatName = cat.name.toLowerCase().includes(term);
        const matchedSubs = subcategories.filter(
          sub => sub.categoryId === cat.id && sub.name.toLowerCase().includes(term)
        );
        if (matchingCatName && matchedSubs.length === 0) {
          return { category: cat, subcategories: subcategories.filter(sub => sub.categoryId === cat.id) };
        }
        if (matchedSubs.length > 0) {
          return { category: cat, subcategories: matchedSubs };
        }
        return null;
      })
      .filter(Boolean);
  }, [categories, subcategories, searchTerm]);

  const hasResults = filtered.length > 0;

  return (
    <div className="w-full">
      <Hero />

      {/* Categories Catalog */}
      <section id="catalog-showroom" className="py-12 md:py-16 bg-neutral-50 border-b border-stone-200/50">
        <div className="container mx-auto px-6 flex flex-col gap-16">
          <div className="max-w-md">
            <span className="text-amber-600 text-xs font-semibold uppercase tracking-wider block mb-2">Design Catalog</span>
            <h2 className="font-heading text-2xl md:text-3xl font-medium tracking-tight text-stone-900">Explore Collections</h2>
            <p className="text-stone-500 text-sm mt-1">Bespoke catalog sections built dynamically from our artisan workshop panel.</p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search categories or items..." className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-amber-600 text-sm text-stone-800" />
          </div>

          {!hasResults ? (
            <div className="py-12 text-center text-stone-400 text-sm">No results found for &ldquo;{searchTerm}&rdquo;.</div>
          ) : (
          <div className="flex flex-col gap-12 md:gap-16">
            {filtered.map(({ category, subcategories: catSubs }) => (
              <CategoryRow
                key={category.id}
                category={category}
                subcategories={catSubs}
              />
            ))}
          </div>
          )}
        </div>
      </section>
    </div>
  );
}
