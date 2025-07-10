import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { SplashScreen } from '@/components/ui/splash-screen';

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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={cn('font-body antialiased bg-background text-foreground')}>
        <SplashScreen />
        <div className="flex flex-col min-h-screen">
          <header className="p-4 border-b border-border/50">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <Globe className="size-8 text-primary" />
              <h1 className="text-2xl font-bold">Siber Kale Hack Tarayıcısı</h1>
            </Link>
          </header>
          <main className="flex-grow flex flex-col">{children}</main>
          <footer className="p-4 text-center text-sm text-muted-foreground">
            Bir Semih Ergili Klasiği
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
