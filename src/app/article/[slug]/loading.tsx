import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-full flex-grow border-t border-border/50">
      {/* Left Column Skeleton */}
      <aside className="col-span-12 md:col-span-3 p-4 md:p-6 border-b md:border-b-0 md:border-r border-border/50 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-7 w-3/4" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
      </aside>

      {/* Middle Column Skeleton */}
      <div className="col-span-12 md:col-span-3 border-b md:border-b-0 md:border-r border-border/50">
          <div className="p-4 space-y-4">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full rounded-md" />
                ))}
            </div>
          </div>
      </div>

      {/* Right Column Skeleton */}
      <main className="col-span-12 md:col-span-6">
        <div className="p-6 md:p-8 space-y-4">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-20 w-full mt-4" />
                <Skeleton className="h-5 w-full mt-4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
            </div>
        </div>
      </main>
    </div>
  );
}
