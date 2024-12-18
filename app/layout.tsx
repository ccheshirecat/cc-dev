import { ReactNode } from 'react';
import RecoilProvider from '@/components/RecoilProvider';
import { WalletProvider } from '@/contexts/WalletContext';
import './globals.css';
import type { Metadata } from 'next';
import Background from '@/components/Background'; // Import the Background component

export const metadata: Metadata = {
  title: 'cc || cheshirecat.dev',
  description: 'i doubt anyone even reads this lol',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Background /> {/* Render the background component */}
        <div className="relative min-h-screen">
          <RecoilProvider>
            <WalletProvider>{children}</WalletProvider>
          </RecoilProvider>
        </div>
      </body>
    </html>
  );
}