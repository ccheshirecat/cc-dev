'use client'; // This makes the component a client component

import { ReactNode, useEffect, useState } from 'react';
import RecoilProvider from '@/components/RecoilProvider';
import { WalletProvider } from '@/contexts/WalletContext';
import './globals.css';
import { Inter } from 'next/font/google';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'], display: 'swap' }); // Font Swap for better performance

// Cloudflare-optimized image path
const bgImage = 'https://cheshirecat.dev/cdn-cgi/image/format=webp,quality=85/bg.png';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [bgLoaded, setBgLoaded] = useState(false);

  // Function to handle lazy loading of background image using IntersectionObserver
  useEffect(() => {
    const element = document.getElementById('bgLazyLoad');
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBgLoaded(true); // Set to true when the component enters the viewport
            observer.disconnect(); // Stop observing once image is loaded
          }
        });
      },
      { threshold: 0.1 } // Trigger the callback when 10% of the element is in view
    );

    observer.observe(element); // Observe the element

    return () => {
      observer.disconnect(); // Cleanup the observer when the component unmounts
    };
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_TITLE || 'cc || cheshirecat.dev'}</title>
        <meta name="description" content={process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'sup'} />
        <link
          rel="preload"
          href="https://fonts.cloudflare.com/css2?family=Inter:wght@400;600&display=swap"
          as="style"
        />
        <link
          href="https://fonts.cloudflare.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <body className={`${inter.className} min-h-screen bg-black text-purple-300 relative`}>
        {/* Lazy load background image */}
        <div
          id="bgLazyLoad"
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: bgLoaded ? `url('${bgImage}')` : 'none', // Load the image on visibility
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
