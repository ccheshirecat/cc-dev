'use client';

import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const bgImage = 'https://cheshirecat.dev/cdn-cgi/image/format=webp,quality=85/bg.png';

export default function Background() {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = bgImage;
    img.onload = () => setBgLoaded(true);
    img.onerror = () => {
      console.error('Error loading background image');
      setBgLoaded(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  return (
    <div
      className={`${inter.className} min-h-screen bg-black text-purple-300 relative`}
      style={{
        backgroundImage: bgLoaded ? `url('${bgImage}')` : 'none',
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top left',
      }}
    />
  );
}