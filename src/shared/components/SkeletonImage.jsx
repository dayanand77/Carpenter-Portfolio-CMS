import { useState } from 'react';

export default function SkeletonImage({ src, alt, className = '', wrapperClassName = '', ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract rounding classes from the image so the skeleton matches exactly
  const roundedClasses = className
    .split(' ')
    .filter(c => c.startsWith('rounded'))
    .join(' ');

  return (
    <div className={`relative w-full h-full overflow-hidden ${wrapperClassName}`}>
      {!isLoaded && (
        <div className={`absolute inset-0 bg-stone-200 animate-pulse ${roundedClasses}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
