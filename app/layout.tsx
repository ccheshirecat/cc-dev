import { ReactNode } from 'react';
import RecoilProvider from '@/components/RecoilProvider';
import { WalletProvider } from '@/contexts/WalletContext';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// List of background images to randomly pick from (Cloudflare-optimized URLs)
const bgimgs = [
  'https://cheshirecat.dev/cdn-cgi/image/width=1920,height=1080,format=webp,quality=85/bg1.png',
  'https://cheshirecat.dev/cdn-cgi/image/width=1920,height=1080,format=webp,quality=85/bg2.png',
  'https://cheshirecat.dev/cdn-cgi/image/width=1920,height=1080,format=webp,quality=85/bg3.png',
];

// Randomly pick one image (this is done on the server, not client)
const randomImage = bgimgs[Math.floor(Math.random() * bgimgs.length)];

export const metadata: Metadata = {
  title: 'cc || cheshirecat.dev',
  description: 'i doubt anyone even reads this lol',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} min-h-screen bg-black text-purple-300`}
        style={{
          backgroundImage: `url('${randomImage}')`, 
          backgroundSize: 'auto', // <-- No stretch, maintain proportions
          backgroundRepeat: 'repeat', // <-- Repeat if bigger
          backgroundPosition: 'top left', // <-- Start from top-left
        }}
      >
        <RecoilProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </RecoilProvider>
      </body>
    </html>
  );
}
