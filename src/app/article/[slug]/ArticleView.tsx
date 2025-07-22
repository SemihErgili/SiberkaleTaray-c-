'use client';

import { useState } from 'react';
import { ShieldCheck, TerminalSquare, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { GenerateArticleOutput } from '@/ai/flows/generate-article-flow';

// Use a type that ensures the necessary properties are present for the view.
export type FullArticle = Required<GenerateArticleOutput>;

type ArticleViewProps = {
  article: FullArticle;
};

const CodeBlock = ({ language, code }: { language: string; code: string }) => (
    <div className="prose">
        <pre>
            <SyntaxHighlighter
                language={language}
                style={atomDark}
                customStyle={{ 
                    backgroundColor: 'transparent',
                    padding: '0',
                }}
                codeTagProps={{
                    className: 'font-code'
                }}
            >
                {code}
            </SyntaxHighlighter>
        </pre>
    </div>
);

const ContentDisplay = ({ content, title }: { content: string, title: string }) => {
    return (
        <article className="p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <div className="prose dark:prose-invert">
                {content.split(/(```[\s\S]*?```)/g).map((part, index) => {
                    if (part.startsWith('```') && part.endsWith('```')) {
                        const codeBlock = part.slice(3, -3).trim();
                        const languageMatch = codeBlock.match(/^[a-z]+\n/);
                        const language = languageMatch ? languageMatch[0].trim() : 'bash';
                        const finalCode = languageMatch ? codeBlock.substring(language.length).trim() : codeBlock;
                        
                        return <CodeBlock key={index} language={language} code={finalCode} />;
                    }
                    return <span key={index}>{part.replace(/\\n/g, '\n')}</span>;
                })}
            </div>
        </article>
    );
};

export function ArticleView({ article }: ArticleViewProps) {
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  const handleSectionSelect = (index: number) => {
    setSelectedSectionIndex(index);
  };
  
  const currentSection = article.analysis[selectedSectionIndex];

  const SectionList = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(!isMobile && "p-4")}>
      <h2 className={cn("text-lg font-semibold mb-4 flex items-center gap-2", isMobile && "sr-only")}>
        <TerminalSquare className="w-5 h-5" />
        Analiz Bölümleri
      </h2>
      <ul className="space-y-1">
        {article.analysis.map((section, index) => (
          <li key={index}>
            <button
              onClick={() => handleSectionSelect(index)}
              className={cn(
                'w-full text-left p-2 rounded-md text-sm transition-colors flex items-center justify-between',
                selectedSectionIndex === index
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              )}
            >
              <span>{section.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 flex-grow">
      {/* --- Mobile Header & Accordion --- */}
      <div className="md:hidden border-b p-4">
        <h1 className="text-xl font-bold mb-2">{article.topicTitle}</h1>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <div className='flex items-center gap-2 text-md'>
                        <TerminalSquare className="w-5 h-5" />
                        Analiz Bölümleri
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <SectionList isMobile />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </div>

      {/* --- Desktop Left Sidebar --- */}
      <aside className="hidden md:flex md:col-span-3 p-4 md:p-6 border-r border-border/50 flex-col gap-4">
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
      
      {/* --- Desktop Middle Column (Sections) --- */}
      <div className="hidden md:block md:col-span-3 border-r border-border/50">
        <ScrollArea className="h-full">
          <SectionList />
        </ScrollArea>
      </div>

      {/* --- Main Content (Right Column on Desktop) --- */}
      <main className="col-span-12 md:col-span-6">
        <ScrollArea className="h-[calc(100vh-250px)] md:h-[calc(100vh-129px)]">
           {currentSection ? (
             <ContentDisplay content={currentSection.content} title={currentSection.title} />
           ) : (
            <div className="p-6 text-muted-foreground flex items-center justify-center h-full">
              Analizi görüntülemek için bir bölüm seçin.
            </div>
           )}
        </ScrollArea>
      </main>
    </div>
  );
}
