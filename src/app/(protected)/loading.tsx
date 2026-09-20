import { CardSkeleton, TableSkeleton } from "@/components/atoms/skeleton";

export default function ProtectedLoading() {
  return (
    <div className="space-y-6 select-none" aria-live="polite">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="rounded-xl border border-border-primary bg-bg-secondary shadow-sm overflow-hidden">
        <TableSkeleton rows={6} cols={5} />
      </div>
      <span className="sr-only">Loading page</span>
    </div>
  );
}
