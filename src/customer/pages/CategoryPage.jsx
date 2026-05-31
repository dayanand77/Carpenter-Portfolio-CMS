import { useParams, Link } from 'react-router-dom';
import { useCategories } from '../../shared/contexts/CategoriesContext';
import { useSubcategories } from '../../shared/contexts/SubcategoriesContext';
import { useGalleries } from '../../shared/contexts/GalleriesContext';
import Breadcrumb from '../components/Breadcrumb';

export default function CategoryPage({ onImageClick }) {
  const { slug } = useParams();
  const { categories } = useCategories();
  const { subcategories: ctxSubcategories } = useSubcategories();
  const { getGalleryImages } = useGalleries();

  const category = categories.find(c => c.id === slug && c.visible !== false);
  const subcategories = (ctxSubcategories || [])
    .filter(s => s.categoryId === slug && s.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (!category) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-xl font-medium text-stone-850">Category Not Found</h2>
        <Link to="/" className="text-amber-600 hover:text-amber-700 underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 bg-neutral-50 min-h-[60vh] animate-fadeIn">
      <div className="container mx-auto px-6">

        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: category.name }
        ]} />

        <div className="max-w-2xl mb-12 flex flex-col gap-3">
          <span className="text-amber-600 text-xs font-semibold uppercase tracking-wider">Category Overview</span>
          <h1 className="font-heading font-medium text-3xl md:text-4xl text-stone-900 leading-tight">{category.name}</h1>
          <p className="text-stone-500 text-sm md:text-base leading-relaxed">{category.description}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {subcategories.length} subcategor{subcategories.length !== 1 ? 'ies' : 'y'}
            </span>
            <span className="text-stone-300 text-[10px]">·</span>
            <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {subcategories.reduce((sum, s) => sum + (getGalleryImages(s.slug).length || 0), 0)} images
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          {subcategories.map(sub => {
            const imageCount = getGalleryImages(sub.slug).length || 0;
            return (
              <div key={sub.id} className="flex flex-col gap-6">
                <div className="flex items-end justify-between border-b border-stone-200/50 pb-2">
                  <div className="flex items-center gap-3">
                    <h2 className="font-heading text-lg md:text-xl font-medium text-stone-800">{sub.name}</h2>
                    {imageCount > 0 && (
                      <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {imageCount} image{imageCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/gallery/${sub.id}`}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 hover:pr-1 transition-all duration-200"
                  >
                    <span>View Full Grid</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>

                {sub.description && (
                  <p className="text-stone-500 text-xs leading-relaxed max-w-xl">{sub.description}</p>
                )}

                {imageCount === 0 ? (
                  <p className="text-stone-400 font-light text-xs py-2">No images available in this subcategory yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {getGalleryImages(sub.slug).slice(0, 4).map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => onImageClick && onImageClick(getGalleryImages(sub.slug), idx, sub.name)}
                        className="relative aspect-square overflow-hidden rounded-lg bg-stone-100 border border-stone-200/70 cursor-pointer group transition-all duration-350 hover:shadow-md hover:border-stone-300 hover:-translate-y-0.5"
                      >
                        <img
                          src={imgUrl}
                          alt={sub.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-center justify-center">
                          <span className="w-10 h-10 rounded-full bg-white text-stone-850 flex items-center justify-center shadow-md scale-90 group-hover:scale-100 transition-all duration-350">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
