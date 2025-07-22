import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react"
import { SplashScreenLoader } from '@/components/SplashScreenLoader';

export const metadata: Metadata = {
  title: {
    default: 'Siber Kale Hack Tarayıcısı - AI Destekli Siber Güvenlik Analizi',
    template: '%s | Siber Kale Hack Tarayıcısı',
  },
  description: 'Siber güvenlik araçları, teknikleri ve kavramları hakkında yapay zeka tarafından oluşturulan, uygulamalı ve kod örnekleri içeren derinlemesine teknik analizler. Ethical hacking ve siber güvenlik öğrenin.',
  keywords: ['Siber Güvenlik', 'Hacking', 'Ethical Hacking', 'Penetration Testing', 'SQL Injection', 'RAT', 'Keylogger', 'Yapay Zeka', 'AI Security'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={cn('font-sans antialiased bg-background text-foreground')}>
        <SplashScreenLoader />
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Link href="/" className="flex items-center gap-3">
                    <Globe className="size-8 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap">Siber Kale Hack Tarayıcısı</h1>
                </Link>
            </div>
          </header>
          <main className="flex-grow flex flex-col container">{children}</main>
          <footer className="bg-primary text-primary-foreground">
            <div className="container flex items-center justify-center h-16">
                 <p className="text-balance text-center text-sm">
                    Bir <a href="https://github.com/semihergili" target='_blank' rel="noopener noreferrer" className='font-medium underline underline-offset-4'>Semih Ergili</a> klasiği. 
                    <a href="https://topluyo.com" target='_blank' rel="noopener noreferrer" className='font-medium underline underline-offset-4'> topluyo.com</a> desteği ile.
                 </p>
            </div>
          </footer>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}