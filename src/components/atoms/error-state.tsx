import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/atoms/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this page. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border-primary bg-bg-secondary p-8 text-center">
      <AlertCircle className="h-10 w-10 text-loss" aria-hidden="true" />
      <h1 className="mt-4 text-xl font-semibold text-text-primary">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-text-secondary">{description}</p>
      {onRetry && (
        <Button className="mt-6" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      )}
    </section>
  );
}
