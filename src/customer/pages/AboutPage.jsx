import { useSettings } from '../../shared/contexts/SettingsContext';
import SkeletonImage from '../../shared/components/SkeletonImage';

export default function AboutPage() {
  const { settings } = useSettings();

  const hasStats = settings.yearsOfExperience || settings.projectsCompleted || settings.masterCraftsmenCount;
  const hasAboutContent = settings.aboutBrandIntroduction || settings.aboutCraftsmanship;

  return (
    <div className="py-12 md:py-20 bg-neutral-50 min-h-[60vh] animate-fadeIn">
      <div className="container mx-auto px-6">
        
        {/* About Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-amber-600 text-xs font-semibold uppercase tracking-wider block mb-2">Our Heritage</span>
              <h1 className="font-heading font-medium text-3xl md:text-4xl text-stone-900 leading-tight">
                {settings.workshopName || "Oak & Iron Studio"}
              </h1>
            </div>
            
            <p className="text-stone-700 font-light text-base md:text-lg leading-relaxed">
              {settings.workshopDescription}
            </p>

            {hasAboutContent && (
              <div className="flex flex-col gap-4 mt-2">
                {settings.aboutBrandIntroduction && (
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {settings.aboutBrandIntroduction}
                  </p>
                )}
                {settings.aboutCraftsmanship && (
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {settings.aboutCraftsmanship}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Image Showcase */}
          <div className="h-[300px] md:h-[450px] rounded-lg overflow-hidden border border-stone-200/80 shadow-md">
            <SkeletonImage 
              src="/assets/images/hero_bg.png" 
              alt="Joinery Studio Showroom" 
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>

        </div>

        {/* Stats Section */}
        {hasStats && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings.yearsOfExperience && (
              <div className="bg-white rounded-xl border border-stone-200/80 p-6 text-center shadow-xs">
                <span className="block text-3xl font-bold text-amber-700">{settings.yearsOfExperience}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-1 block">Years of Experience</span>
              </div>
            )}
            {settings.projectsCompleted && (
              <div className="bg-white rounded-xl border border-stone-200/80 p-6 text-center shadow-xs">
                <span className="block text-3xl font-bold text-amber-700">{settings.projectsCompleted}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-1 block">Projects Completed</span>
              </div>
            )}
            {settings.masterCraftsmenCount && (
              <div className="bg-white rounded-xl border border-stone-200/80 p-6 text-center shadow-xs">
                <span className="block text-3xl font-bold text-amber-700">{settings.masterCraftsmenCount}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-1 block">Master Craftsmen</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
