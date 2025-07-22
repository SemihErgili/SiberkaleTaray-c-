import { generateArticle, GenerateArticleOutput } from '@/ai/flows/generate-article-flow';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Hand, Clock, KeyRound } from 'lucide-react';
import { Suspense } from 'react';
import ArticleLoading from './loading';
import { ArticleView, FullArticle } from './ArticleView';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const topic = decodeURIComponent(params.slug);
  
    return {
      title: `Analiz: ${topic}`,
      description: `Siber güvenlik konusu olan '${topic}' hakkında yapay zeka tarafından üretilmiş, kod örnekleri içeren derinlemesine teknik analiz.`,
    };
}

async function ArticleGenerator({ topic }: { topic: string }) {
    let result: GenerateArticleOutput | null = null;
    let error: any = null;

    try {
        result = await generateArticle({ topic });
    } catch (e: any) {
        error = e;
        console.error("[ Server ] Failed to generate analysis:", e.message);
    }

    if (error) {
        let title = 'Analiz Başarısız Oldu';
        let message = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin veya farklı bir konu arayın.';
        let icon = <AlertCircle className="h-10 w-10 text-destructive" />;
        
        const errorMessage = error.message ? error.message.toLowerCase() : '';

        if (errorMessage.includes('rate limit') || error.status === 429) {
            title = 'API Kullanım Limiti Aşıldı';
            message = 'Groq API kullanım kotasını aştınız. Lütfen bir süre bekleyip tekrar deneyin veya Groq hesabınızdaki faturalandırma detaylarınızı kontrol edin.';
            icon = <Clock className="h-10 w-10 text-yellow-500" />;
        } else if (errorMessage.includes('api key') || errorMessage.includes('authentication') || error.status === 401) {
            title = 'Geçersiz API Anahtarı';
            message = 'Yapay zeka servisi için API anahtarı yapılandırılmamış veya geçersiz. Lütfen .env dosyanıza geçerli bir GROQ_API_KEY eklediğinizden emin olun.';
            icon = <KeyRound className="h-10 w-10 text-orange-500" />;
        } else if (errorMessage.includes('safety') || errorMessage.includes('beklenen formatta bir yanıt vermedi')) {
            title = 'Analiz Üretilemedi';
            message = `Model, aradığınız "${topic}" konusu için bir analiz oluşturamadı veya güvenlik politikalarını ihlal etti. Lütfen daha genel veya farklı bir terimle tekrar deneyin.`;
            icon = <Hand className="h-10 w-10 text-blue-500" />;
        }

         return (
            <div className="p-4 md:p-8 flex items-center justify-center flex-grow">
                <Card className="shadow-lg border-destructive/50 max-w-lg text-center">
                    <CardHeader className="items-center">
                        <div className="p-3 bg-muted rounded-full mb-4">
                           {icon}
                        </div>
                        <CardTitle className="flex items-center gap-3 text-foreground">
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            {message}
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                       <Button asChild>
                            <Link href="/">Ana Sayfaya Dön</Link>
                       </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (!result) {
         return (
            <div className="p-4 md:p-8 flex items-center justify-center flex-grow">
                <Card className="shadow-lg max-w-lg">
                    <CardHeader>
                        <CardTitle>Sonuç Bulunamadı</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            '{topic}' konusu için bir analiz üretilemedi. Modelden bir yanıt alınamadı.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!result.isCybersecurityTopic) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center flex-grow text-center">
                <Card className="shadow-lg max-w-lg border-primary/20">
                    <CardHeader className="items-center">
                         <Hand className="w-16 h-16 text-primary mb-4" />
                        <CardTitle className="text-3xl">
                           Hey Hacker!
                        </CardTitle>
                        <CardDescription className="text-lg">
                           Böyle Bir Terim Yok
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Aradığınız terim <span className="font-bold text-primary">'{topic}'</span>, siber güvenlik dünyasında bir anlam ifade etmiyor gibi görünüyor. Lütfen teknik bir terimle tekrar dene.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }
    
    if (!result.analysis || !result.topicTitle || result.analysis.length === 0) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center flex-grow">
                <Card className="shadow-lg max-w-lg">
                    <CardHeader>
                        <CardTitle>Eksik Analiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            '{topic}' konusu için bir analiz üretilemedi. Model konuyu tanıdı ancak detaylı içerik oluşturamadı. Lütfen tekrar deneyin.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <ArticleView article={result as FullArticle} />;
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const topic = decodeURIComponent(params.slug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="flex flex-col flex-grow">
        <Suspense fallback={<ArticleLoading />}>
            <ArticleGenerator topic={topic} />
        </Suspense>
    </div>
  );
}
