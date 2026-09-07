import { Spinner } from "@/components/atoms/spinner";

export default function ProtectedLoading() {
  return (
    <div className="flex min-h-64 items-center justify-center" aria-live="polite">
      <Spinner size="lg" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
