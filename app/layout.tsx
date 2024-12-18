import { ReactNode } from 'react';
import RecoilProvider from '@/components/RecoilProvider';
import { WalletProvider } from '@/contexts/WalletContext';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Cloudflare-optimized image path
const bgImage = 'https://cheshirecat.dev/cdn-cgi/image/width=128,height=128,format=webp,quality=85/bg.png';

export const metadata: Metadata = {
  title: 'cc || cheshirecat.dev',
  description: 'i doubt anyone even reads this lol',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-black text-purple-300 relative`}
        style={{
          backgroundImage: `url('${bgImage}')`, // Optimized URL via Cloudflare
          backgroundSize: '128px 128px', // Tile size for seamless repeat
          backgroundRepeat: 'repeat', // Infinite repeat for seamless effect
          backgroundPosition: 'top left', // Align starting point
        }}
      >
        <RecoilProvider>
          <WalletProvider>{children}</WalletProvider>
        </RecoilProvider>
      </body>
    </html>
  );
}
