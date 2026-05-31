import React, { useState, useEffect, useRef } from 'react';

export default function ImageViewer({ images, activeIndex, subtitle, onClose, onNext, onPrev }) {
  const [activeIdx, setActiveIdx] = useState(activeIndex);
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setActiveIdx(activeIndex);
  }, [activeIndex]);

  const currentImageUrl = images[activeIdx];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        if (activeIdx < images.length - 1) setActiveIdx(activeIdx + 1);
        else onNext();
      }
      if (e.key === 'ArrowLeft') {
        if (activeIdx > 0) setActiveIdx(activeIdx - 1);
        else onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIdx, images.length, onClose, onNext, onPrev]);

  const handleTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStart.current.x;
    const diffY = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
      if (diffX > 0) {
        if (activeIdx > 0) setActiveIdx(activeIdx - 1);
        else onPrev();
      } else {
        if (activeIdx < images.length - 1) setActiveIdx(activeIdx + 1);
        else onNext();
      }
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] w-full h-full bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-[90%] max-w-[900px] h-[65vh] flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {(activeIdx > 0) && (
          <button
            onClick={() => setActiveIdx(activeIdx - 1)}
            className="absolute left-[-20px] md:left-[-80px] z-50 w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/60 hover:bg-amber-600 hover:border-amber-600 text-white/70 hover:text-white flex items-center justify-center transition-all duration-200"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
        )}

        {(activeIdx < images.length - 1) && (
          <button
            onClick={() => setActiveIdx(activeIdx + 1)}
            className="absolute right-[-20px] md:right-[-80px] z-50 w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/60 hover:bg-amber-600 hover:border-amber-600 text-white/70 hover:text-white flex items-center justify-center transition-all duration-200"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        )}

        <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute top-[-50px] right-0 z-50 w-11 h-11 rounded-full border border-white/10 bg-black/60 hover:bg-amber-600 hover:border-amber-600 text-white/70 hover:text-white flex items-center justify-center transition-all duration-200"
            aria-label="Close lightbox"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <img
            src={currentImageUrl}
            alt={subtitle || ''}
            className="max-w-full max-h-[80%] object-contain rounded-sm shadow-2xl transition-all duration-300"
          />

          {images.length > 1 && (
            <div className="flex gap-2.5 justify-center mt-4 max-w-full overflow-x-auto no-scrollbar shrink-0 py-1">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-10 h-10 rounded border transition-all overflow-hidden shrink-0 ${
                    activeIdx === idx ? 'border-amber-600 scale-105 shadow-md shadow-amber-600/20' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {subtitle && (
        <div className="w-[90%] max-w-[900px] mt-6 text-center text-white animate-fadeIn" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-heading font-medium text-lg text-white">{subtitle}</h3>
          <p className="text-stone-400 text-xs mt-1">{activeIdx + 1} of {images.length}</p>
        </div>
      )}
    </div>
  );
}
