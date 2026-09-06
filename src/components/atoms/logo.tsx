import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { icon: "h-5 w-5", text: "text-lg" },
  md: { icon: "h-6 w-6", text: "text-xl" },
  lg: { icon: "h-8 w-8", text: "text-2xl" },
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const s = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center justify-center rounded-lg bg-brand p-1.5">
        <TrendingUp className={cn(s.icon, "text-white")} />
      </div>
      {showText && (
        <span className={cn(s.text, "font-bold text-text-primary")}>
          Trade<span className="text-brand">X</span>
        </span>
      )}
    </div>
  );
}
