import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import SubcategoryCard from './SubcategoryCard';

export default function CategoryRow({ category, subcategories }) {
  const trackRef = useRef(null);

  const handleMouseDown = (e) => {
    const slider = trackRef.current;
    if (!slider) return;
    slider.isDown = true;
    slider.classList.add('grabbing');
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeft = slider.scrollLeft;
  };

  const handleMouseLeave = () => {
    const slider = trackRef.current;
    if (!slider) return;
    slider.isDown = false;
    slider.classList.remove('grabbing');
  };

  const handleMouseUp = () => {
    const slider = trackRef.current;
    if (!slider) return;
    slider.isDown = false;
    slider.classList.remove('grabbing');
  };

  const handleMouseMove = (e) => {
    const slider = trackRef.current;
    if (!slider || !slider.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 1.5;
    slider.scrollLeft = slider.scrollLeft - walk;
  };

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      {/* Row Header */}
      <div className="flex items-end justify-between border-b border-stone-200/50 pb-2">
        <h3 className="font-heading text-lg md:text-xl font-medium text-stone-850">{category.name}</h3>
        <Link 
          to={`/category/${category.id}`} 
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 hover:pr-1 transition-all duration-200"
        >
          <span>View All</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Subcategories horizontal scroll track */}
      <div 
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar drag-scroll select-none"
      >
        {subcategories.map(sub => (
          <SubcategoryCard key={sub.id} subcategory={sub} />
        ))}
      </div>
    </div>
  );
}
