'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Globe, Search, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/article/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-8">
      <div className="w-full max-w-2xl text-center mb-12">
        <Globe className="w-24 h-24 mx-auto text-primary/80 mb-6" />
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
          Siber Kale Hack Tarayıcısı
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Bir siber güvenlik aracını, tekniğini veya kavramını yazın ve derinlemesine analizini alın.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Örn: RAT, Keylogger, SQL Injection"
            className="w-full pl-12 pr-28 h-14 text-lg rounded-full shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-11 rounded-full px-6">
            Analiz Et <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
      
      <div className="w-full max-w-4xl mt-8">
        <Link href="https://siber-kalev2.vercel.app/" target="_blank" rel="noopener noreferrer" className="block group">
          <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-primary/20">
            <CardContent className="p-8 text-center flex flex-col items-center">
                <Shield className="w-12 h-12 mb-4 text-primary"/>
              <h2 className="text-3xl font-bold text-primary tracking-wide">
                Ücretsiz Siber Güvenlik Dersleri
              </h2>
              <p className="text-md text-muted-foreground mt-2 group-hover:text-foreground/90 transition-colors">
                Bilgiye giden kapıyı arala. Şimdi başla.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

    </div>
  );
}
