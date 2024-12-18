'use client';

import { ReactNode, useEffect, useState } from 'react';
import RecoilProvider from '@/components/RecoilProvider';
import { WalletProvider } from '@/contexts/WalletContext';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Cloudflare-optimized image path
const bgImage = 'https://cheshirecat.dev/cdn-cgi/image/format=webp,quality=85/bg.png';

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'cc || cheshirecat.dev',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'sup',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const element = document.getElementById('bgLazyLoad');
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBgLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 } 
    );

    observer.observe(element);

    return () => {
      observer.disconnect(); 
    };
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-purple-300 relative`}>
        <div
          id="bgLazyLoad"
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: bgLoaded ? `url('${bgImage}')` : 'none',
            backgroundSize: 'auto',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'top left',
            transition: 'background-image 0.3s ease-in-out',
          }}
        />

        <RecoilProvider>
          <WalletProvider>{children}</WalletProvider>
        </RecoilProvider>
      </body>
    </html>
  );
}