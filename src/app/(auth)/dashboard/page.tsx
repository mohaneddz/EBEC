import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  return (
    <section className="full grid grid-cols-3 gap-4 p-4">
      <p className="absolute top-0">MAIN </p>
      <div className="flex flex-col gap-4">
        <Skeleton className="min-h-1 min-w-1 full" />
        <Skeleton className="min-h-1 min-w-1 full" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="min-h-1 min-w-1 full" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="min-h-1 min-w-1 full" />
        <Skeleton className="min-h-1 min-w-1 full" />
      </div>
    </section>
  );
};
