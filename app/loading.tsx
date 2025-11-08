import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-24">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
