'use client';

import { useState } from 'react';
import type { GenerateArticleOutput } from '@/ai/flows/generate-article-flow';
import { ShieldCheck, TerminalSquare, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


type ArticleViewProps = {
  article: Required<GenerateArticleOutput>;
};

export function ArticleView({ article }: ArticleViewProps) {
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  const selectedSection = article.analysis?.[selectedSectionIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-full flex-grow border-t border-border/50">
      <aside className="col-span-12 md:col-span-3 p-4 md:p-6 border-b md:border-b-0 md:border-r border-border/50 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
          <h1 className="text-xl font-bold">{article.topicTitle}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          '{article.topicTitle}' konusu hakkında yapay zeka tarafından üretilen uygulamalı ve teknik analiz.
        </p>

        {article.relatedTopics && article.relatedTopics.length > 0 && (
            <>
                <Separator />
                <div>
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        İlgili Terimler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {article.relatedTopics.map((topic, index) => (
                            <Link 
                                href={`/article/${encodeURIComponent(topic)}`}
                                key={index}
                                className="px-3 py-1 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs rounded-full transition-colors"
                            >
                                {topic}
                            </Link>
                        ))}
                    </div>
                </div>
            </>
        )}
      </aside>

      <div className="col-span-12 md:col-span-3 border-b md:border-b-0 md:border-r border-border/50">
        <ScrollArea className="h-full max-h-[200px] md:max-h-none">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TerminalSquare className="w-5 h-5" />
              Analiz Bölümleri
            </h2>
            <ul className="space-y-1">
              {article.analysis.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => setSelectedSectionIndex(index)}
                    className={cn(
                      'w-full text-left p-2 rounded-md text-sm transition-colors',
                      selectedSectionIndex === index
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </div>

      <main className="col-span-12 md:col-span-6">
        <ScrollArea className="h-full">
          {selectedSection ? (
            <article className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-4">{selectedSection.title}</h3>
              <div className="text-base text-foreground/90 leading-relaxed whitespace-pre-line font-body">
                {selectedSection.content.split(/(```[\s\S]*?```)/g).map((part, index) => {
                  if (part.startsWith('```') && part.endsWith('```')) {
                    const codeBlock = part.slice(3, -3).trim();
                    const languageMatch = codeBlock.match(/^[a-z]+\n/);
                    const language = languageMatch ? languageMatch[0].trim() : 'bash';
                    const finalCode = languageMatch ? codeBlock.substring(language.length).trim() : codeBlock;
                    
                    return (
                        <SyntaxHighlighter
                            key={index}
                            language={language}
                            style={atomOneDark}
                            customStyle={{ 
                                borderRadius: '0.5rem',
                                padding: '1rem',
                                margin: '1rem 0',
                                backgroundColor: '#1d1f21' // Softer black
                            }}
                            codeTagProps={{
                                className: 'text-sm font-code'
                            }}
                        >
                            {finalCode}
                        </SyntaxHighlighter>
                    );
                  }
                  return <span key={index}>{part}</span>;
                })}
              </div>
            </article>
          ) : (
            <div className="p-6 text-muted-foreground flex items-center justify-center h-full">Analizi görüntülemek için bir bölüm seçin.</div>
          )}
        </ScrollArea>
      </main>
    </div>
  );
}
