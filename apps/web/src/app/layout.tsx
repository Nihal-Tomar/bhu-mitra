import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import { LocaleProvider } from '@bhumitra/ui';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'BHUMITRA — National Land Acquisition Intelligence & Management Platform',
    template: '%s | BHUMITRA',
  },
  description:
    'BHUMITRA is the National Land Acquisition Intelligence & Management Platform of the Department of Land Resources (DoLR), Ministry of Rural Development, Government of India. Statutory compliance under RFCTLARR Act 2013.',
  keywords: [
    'land acquisition',
    'DoLR',
    'RFCTLARR Act 2013',
    'Ministry of Rural Development',
    'Government of India',
    'BhuMitra',
    'cadastral',
    'GIS',
    'gazette notification',
    'National Infrastructure Corridors',
  ],
  robots: { index: false, follow: false },
  authors: [{ name: 'Department of Land Resources, MoRD, Government of India' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B1F33',
};

import { Suspense } from 'react';
import { BhuMitraAiAssistant } from '../components/ai/BhuMitraAiAssistant';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${notoDevanagari.variable} font-sans antialiased`}>
        {/* Skip to main content — WCAG 2.1 AA */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <LocaleProvider defaultLocale="en">
          {children}
          <Suspense fallback={null}>
            <BhuMitraAiAssistant />
          </Suspense>
        </LocaleProvider>
      </body>
    </html>
  );
}
