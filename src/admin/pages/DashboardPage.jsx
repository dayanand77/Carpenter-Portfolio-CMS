import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../shared/contexts/CategoriesContext';
import { useSubcategories } from '../../shared/contexts/SubcategoriesContext';
import { useGalleries } from '../../shared/contexts/GalleriesContext';

export default function DashboardPage() {
  const { categories } = useCategories();
  const { subcategories } = useSubcategories();
  const { getGalleryImageCount } = useGalleries();
  const categoriesCount = categories.length;
  const subcategoriesCount = subcategories.length;
  const totalImages = subcategories.reduce((sum, s) => sum + (getGalleryImageCount(s.slug) || 0), 0);

  const allDates = subcategories.map(s => s.updatedAt).filter(Boolean).sort().reverse();
  const lastUpload = allDates.length > 0
    ? new Date(allDates[0]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  const statCards = [
    { name: "Total Categories", count: categoriesCount, color: "bg-blue-500", text: "text-blue-500" },
    { name: "Subcategories", count: subcategoriesCount, color: "bg-amber-500", text: "text-amber-500" },
    { name: "Gallery Images", count: totalImages, color: "bg-green-500", text: "text-green-500" },
    { name: "Last Upload Date", count: lastUpload, color: "bg-purple-500", text: "text-purple-500" }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map(card => (
          <div key={card.name} className="bg-white border border-stone-200/80 p-5 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">{card.name}</span>
              <span className={`font-heading font-semibold ${card.name === "Last Upload Date" ? 'text-lg' : 'text-3xl'} text-stone-850`}>{card.count}</span>
            </div>
            <div className={`w-3.5 h-3.5 rounded-full ${card.color}`} />
          </div>
        ))}
      </div>

      {/* Main Console shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

        {/* Welcome Section */}
        <div className="bg-white border border-stone-200/80 p-6 md:p-8 rounded-lg flex flex-col justify-between gap-6 shadow-sm">
          <div>
            <h3 className="font-heading text-lg md:text-xl font-medium text-stone-850 mb-2">Welcome Back, Admin</h3>
            <p className="text-sm text-stone-500 leading-relaxed font-light">
              This management dashboard gives you full control over the customer showroom catalog. You can create new categories, edit subcategories, and upload custom woodwork photos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/subcategories"
              className="px-4 py-2.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              Manage Subcategories
            </Link>
            <Link
              to="/admin/settings"
              className="px-4 py-2.5 rounded border border-stone-200 hover:bg-stone-50 text-stone-600 font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              Edit Contacts
            </Link>
          </div>
        </div>

        {/* Database Status Info */}
        <div className="bg-white border border-stone-200/80 p-6 md:p-8 rounded-lg shadow-sm flex flex-col justify-between gap-4">
          <h3 className="font-heading text-base md:text-lg font-medium text-stone-850">Content Structure</h3>
          <div className="flex flex-col gap-3 text-xs md:text-sm text-stone-600">
            <div className="flex justify-between items-center py-2 border-b border-stone-100">
              <span className="font-medium text-stone-500">Categories</span>
              <span className="font-semibold text-stone-800">{categoriesCount} folders</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stone-100">
              <span className="font-medium text-stone-500">Subcategories</span>
              <span className="font-semibold text-stone-800">{subcategoriesCount} collections</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-stone-500">Gallery Images</span>
              <span className="font-semibold text-stone-800">{totalImages} uploaded</span>
            </div>
          </div>
          <div className="text-[11px] text-stone-400 font-light mt-2">
            * Images are stored in subcategory galleries. Manage them from the Subcategories panel.
          </div>
        </div>

      </div>

    </div>
  );
}
