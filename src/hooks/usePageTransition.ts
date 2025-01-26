import { useState, useEffect } from 'react';

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link?.href && !link.href.includes('#') && !link.href.includes('mailto:')) {
        setIsTransitioning(true);
        // Reset after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1500);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return isTransitioning;
}