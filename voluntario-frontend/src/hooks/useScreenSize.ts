import { useEffect, useState } from 'react';

export function useScreenSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isSmall = width < 768;
  const isMedium = width >= 768 && width < 1024;
  const isLarge = width >= 1024;

  return { isSmall, isMedium, isLarge };
}
