import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './Provider';
import { Metadata } from 'next';

const outfit = Outfit({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SpecsAura Admin',
  description: 'SpecsAura Admin Dashboard',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/icon.png', type: 'image/png' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}