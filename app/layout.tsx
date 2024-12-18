import { ReactNode } from 'react';
import RecoilProvider from '@/components/RecoilProvider';
import { WalletProvider } from '@/contexts/WalletContext';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// List of background images to randomly pick from
const bgimgs = [
  '/cdn-cgi/image/width=1920,height=1080,format=webp,quality=85/bg1.png',
  '/cdn-cgi/image/width=1920,height=1080,format=webp,quality=85/bg2.png',
  '/cdn-cgi/image/width=1920,height=1080,format=webp,quality=85/bg3.png',
];

// Randomly pick an image (this is done on the server)
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
          backgroundSize: 'cover', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center', 
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
