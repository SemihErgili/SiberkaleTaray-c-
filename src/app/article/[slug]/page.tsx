import { generateArticle, GenerateArticleOutput } from '@/ai/flows/generate-article-flow';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Hand } from 'lucide-react';
import { Suspense } from 'react';
import ArticleLoading from './loading';
import { ArticleView } from './ArticleView';
import type { Metadata } from 'next';

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
        console.error("Failed to generate analysis:", e.message);
    }

    if (error) {
         return (
            <div className="p-4 md:p-8 flex items-center justify-center flex-grow">
                <Card className="shadow-lg border-destructive/50 max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-destructive">
                            <AlertCircle />
                            Analiz Başarısız Oldu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="font-semibold">
                            '{topic}' konusu analiz edilirken bir hata oluştu.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {error.message || 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin veya farklı bir konu arayın.'}
                        </p>
                    </CardContent>
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
                            '{topic}' konusu için bir analiz üretilemedi. Lütfen daha genel bir terimle tekrar deneyin.
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
    
    if (!result.analysis || result.analysis.length === 0) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center flex-grow">
                <Card className="shadow-lg max-w-lg">
                    <CardHeader>
                        <CardTitle>Sonuç Bulunamadı</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            '{topic}' konusu için bir analiz üretilemedi. Lütfen daha genel bir terimle tekrar deneyin.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return <ArticleView article={result as Required<GenerateArticleOutput>} />;
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
