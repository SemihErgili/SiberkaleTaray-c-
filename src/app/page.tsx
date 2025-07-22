
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Globe, Search, ArrowRight, Shield, DatabaseZap, Shell, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

const popularSearches = ['SQL Injection', 'RAT', 'Phishing', 'Keylogger'];
const featuredTopics = [
    {
        icon: <DatabaseZap className="w-8 h-8 text-primary" />,
        title: "Veritabanı Güvenliği",
        description: "SQL Injection gibi saldırılara karşı korunma yöntemleri.",
        topic: "SQL Injection",
        image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg",
        aiHint: "database security"
    },
    {
        icon: <Shell className="w-8 h-8 text-primary" />,
        title: "Zararlı Yazılımlar",
        description: "RAT ve Keylogger gibi araçların çalışma mantığını öğrenin.",
        topic: "RAT",
        image: "https://images.pexels.com/photos/5240544/pexels-photo-5240544.jpeg",
        aiHint: "malware code"
    },
    {
        icon: <Users className="w-8 h-8 text-primary" />,
        title: "Sosyal Mühendislik",
        description: "Phishing ve oltalama saldırılarının incelikleri.",
        topic: "Phishing",
        image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg",
        aiHint: "social engineering"
    }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/article/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePopularSearch = (topic: string) => {
    setSearchQuery(topic);
    router.push(`/article/${encodeURIComponent(topic)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-8">
      <div className="w-full max-w-2xl text-center mb-12">
        <Globe className="w-24 h-24 mx-auto text-primary/80 mb-6 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          Siber Kale Hack Tarayıcısı
        </h1>
        <p className="text-md md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Bir siber güvenlik aracını, tekniğini veya kavramını yazın ve yapay zeka destekli, uygulamalı ve derinlemesine analizini anında alın.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Bir siber güvenlik terimi arayın..."
            className="w-full pl-12 pr-32 md:pr-40 h-14 text-lg rounded-full shadow-lg bg-card focus:bg-background transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-11 rounded-full px-4 md:px-6">
            Analiz Et
             <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground mr-2">Popüler:</span>
            {popularSearches.map(term => (
                <Button key={term} variant="outline" size="sm" className="rounded-full" onClick={() => handlePopularSearch(term)}>
                    {term}
                </Button>
            ))}
        </div>
      </div>
      
      <div className="w-full max-w-6xl mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Öne Çıkan Konular</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTopics.map((item, index) => (
                 <Link href={`/article/${encodeURIComponent(item.topic)}`} key={index} className="block group">
                    <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-primary/20">
                         <div className="relative h-40 w-full">
                            <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" data-ai-hint={item.aiHint}/>
                         </div>
                         <CardHeader>
                            <div className="flex items-center gap-4 mb-2">
                                {item.icon}
                                <CardTitle className="text-xl">{item.title}</CardTitle>
                            </div>
                         </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors">
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </div>
      
       <div className="w-full max-w-4xl mt-24">
        <Link href="https://siber-kalev2.vercel.app/" target="_blank" rel="noopener noreferrer" className="block group">
          <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-primary/20">
            <CardContent className="p-6 md:p-8 text-center flex flex-col items-center">
                <Shield className="w-10 h-10 md:w-12 md:h-12 mb-4 text-primary"/>
              <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-wide">
                Ücretsiz Siber Güvenlik Dersleri
              </h2>
              <p className="text-sm md:text-md text-muted-foreground mt-2 group-hover:text-foreground/90 transition-colors">
                Bilgiye giden kapıyı arala. Şimdi başla.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

    </div>
  );
}
