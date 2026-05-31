import { Link } from 'react-router-dom';
import SkeletonImage from '../../shared/components/SkeletonImage';
import { useGalleries } from '../../shared/contexts/GalleriesContext';

export default function SubcategoryCard({ subcategory }) {
  const { getGalleryImages, getGalleryImageCount, getGalleryCoverImage } = useGalleries();
  const imageCount = getGalleryImageCount(subcategory.slug) || 0;
  const coverImage = getGalleryCoverImage(subcategory.slug) || subcategory.coverImage;

  return (
    <Link
      to={`/gallery/${subcategory.id}`}
      className="flex-none w-[calc(48%-8px)] md:w-[calc(33.33%-16px)] lg:w-[calc(20%-20px)] min-w-[140px] md:min-w-[220px] snap-start bg-white border border-stone-200/80 rounded-md overflow-hidden transition-all duration-350 hover:shadow-md hover:border-stone-300 hover:-translate-y-1 flex flex-col cursor-pointer group"
    >
      <div className="relative overflow-hidden bg-stone-100 h-[110px] md:h-[180px]">
        <SkeletonImage
          src={coverImage}
          alt={subcategory.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          loading="lazy"
        />
        {imageCount > 0 && (
          <span className="absolute top-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[9px] md:text-xs font-medium px-2 py-0.5 rounded-full">
            {imageCount} Image{imageCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="p-3 md:p-4 flex flex-col gap-1 flex-grow">
        <h4 className="font-heading text-xs md:text-sm font-semibold text-stone-850 line-clamp-1">
          {subcategory.name}
        </h4>
        <span className="text-[10px] uppercase tracking-wider text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center gap-1 mt-auto">
          <span>Browse</span>
          <svg className="w-2.5 h-2.5 transition-transform duration-250 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
