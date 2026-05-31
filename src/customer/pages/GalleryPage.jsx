import { useParams, Link } from 'react-router-dom';
import SkeletonImage from '../../shared/components/SkeletonImage';
import { useState } from 'react';
import { useSettings } from '../../shared/contexts/SettingsContext';
import { useCategories } from '../../shared/contexts/CategoriesContext';
import { useSubcategories } from '../../shared/contexts/SubcategoriesContext';
import { useGalleries } from '../../shared/contexts/GalleriesContext';
import Breadcrumb from '../components/Breadcrumb';

export default function GalleryPage({ onImageClick }) {
  const { slug } = useParams();
  const [viewerOpened, setViewerOpened] = useState(false);
  const { settings } = useSettings();
  const { categories } = useCategories();
  const { subcategories: ctxSubcategories } = useSubcategories();
  const { getGalleryImages } = useGalleries();

  const subcategory = (ctxSubcategories || []).find(s => s.id === slug && s.visible !== false);
  const category = subcategory ? categories.find(c => c.id === subcategory.categoryId) : null;
  const whatsappNumber = settings.whatsappNumber?.trim();

  const allImages = subcategory ? getGalleryImages(subcategory.slug) : [];
  const totalImages = allImages.length;

  const handleImageClick = (images, idx, subtitle) => {
    setViewerOpened(true);
    onImageClick(images, idx, subtitle);
  };

  const openWhatsApp = () => {
    const msg = viewerOpened && category
      ? `Hello,\nI am interested in the ${subcategory.name} designs from the ${category.name} category.`
      : `Hello,\nI am interested in the "${subcategory.name}" designs shown on your website.\nPlease provide more information.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!subcategory) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-stone-500 gap-4">
        <span className="text-stone-300 text-5xl">🔍</span>
        <p className="text-sm font-medium">Subcategory not found.</p>
        <Link to="/" className="text-amber-700 hover:underline text-xs font-semibold">&larr; Back to showroom</Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-neutral-50 min-h-[60vh] animate-fadeIn">
      <div className="container mx-auto px-6">
        
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Showroom', to: '/#catalog-showroom' },
          ...(category ? [{ label: category.name, to: `/category/${category.id}` }] : []),
          { label: subcategory.name }
        ]} />

        {/* Subcategory header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading font-medium text-2xl md:text-3xl text-stone-900">{subcategory.name}</h1>
            {subcategory.description && (
              <p className="text-stone-500 text-sm mt-1 max-w-2xl">{subcategory.description}</p>
            )}
            <span className="text-stone-400 text-xs mt-2 block">{totalImages} design{totalImages !== 1 ? 's' : ''}</span>
          </div>

          {/* WhatsApp inquiry */}
          {whatsappNumber && subcategory && (
            <button 
              onClick={openWhatsApp}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#25d366] text-white font-medium text-xs uppercase tracking-wider shadow-sm hover:bg-[#1ebd58] transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md shrink-0"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.905-6.993C16.257 1.87 13.771.842 11.13.841 5.692.841 1.269 5.263 1.265 10.702c-.001 1.7.452 3.359 1.314 4.815L1.572 20.67l5.075-1.516zm12.392-5.467c-.33-.165-1.951-.963-2.253-1.073-.303-.11-.523-.165-.743.165-.22.33-.853 1.073-1.046 1.293-.193.22-.386.248-.716.083-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.642-1.953-1.834-2.283-.193-.33-.021-.508.144-.673.148-.148.33-.386.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.019-2.45-.269-.648-.564-.56-.743-.568-.19-.009-.413-.011-.633-.011-.22 0-.578.083-.88.413-.303.33-1.157 1.129-1.157 2.752 0 1.622 1.183 3.193 1.348 3.413.165.22 2.328 3.555 5.639 4.981.787.34 1.4.542 1.88.697.79.25 1.51.215 2.079.129.633-.096 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.569-.083-.138-.303-.22-.633-.385z"/>
              </svg>
              <span>Ask About This Design</span>
            </button>
          )}
        </div>

        {/* Image Grid */}
        {totalImages > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((img, idx) => (
              <div 
                key={idx} 
                className="relative group cursor-pointer rounded-lg overflow-hidden border border-stone-200 bg-white shadow-xs hover:shadow-lg transition-all duration-250"
                onClick={() => handleImageClick(allImages, idx, subcategory.name)}
              >
                <div className="aspect-square">
                  <SkeletonImage 
                    src={img} 
                    alt={`${subcategory.name} design ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                    loading={idx < 4 ? undefined : "lazy"}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-stone-400">
            <p className="text-sm font-medium">No designs in this collection yet.</p>
            <p className="text-xs mt-1">Check back later or contact the studio for more information.</p>
          </div>
        )}

      </div>
    </div>
  );
}
