import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-brand", sizeClasses[size], className)}
      aria-label="Loading"
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}
