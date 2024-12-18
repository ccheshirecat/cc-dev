import { ReactNode } from 'react';
import RecoilProvider from '@/components/RecoilProvider';
import { WalletProvider } from '@/contexts/WalletContext';
import './globals.css';
import { Inter } from 'next/font/google';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const bgImage = 'https://cheshirecat.dev/cdn-cgi/image/format=webp,quality=85/bg.png';

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'cc || cheshirecat.dev',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'sup',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-purple-300 relative`}>
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={bgImage}
            alt="Background"
            width={1920}
            height={1080}
            style={{ objectFit: 'none', objectPosition: 'center' }} // Center the image
            loading="lazy"
            priority={false}
          />
        </div>

        <RecoilProvider>
          <WalletProvider>{children}</WalletProvider>
        </RecoilProvider>
      </body>
    </html>
  );
}