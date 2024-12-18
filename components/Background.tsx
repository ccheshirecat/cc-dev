'use client'; // This is a client component

import { useEffect, useState } from 'react';

const bgImage = 'https://cheshirecat.dev/cdn-cgi/image/format=webp,quality=85/bg.png';

export default function Background() {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = bgImage;
    img.onload = () => setBgLoaded(true);
    img.onerror = () => {
      console.error('Error loading background image');
      setBgLoaded(true); // Fallback to prevent infinite loading state
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out`}
      style={{
        opacity: bgLoaded ? 1 : 0, // Fade in once loaded
        backgroundImage: bgLoaded ? `url('${bgImage}')` : 'none',
        backgroundColor: '#000000', // While loading, use a solid background color to avoid "white flash"
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top left',
      }}
    />
  );
}
