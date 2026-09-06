import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-brand text-text-inverse hover:bg-brand-hover focus-visible:ring-brand",
  secondary:
    "bg-bg-tertiary text-text-primary hover:bg-border-primary border border-border-primary",
  outline:
    "border border-border-secondary text-text-primary hover:bg-bg-tertiary",
  ghost: "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
  danger: "bg-loss text-white hover:opacity-90",
  profit: "bg-profit text-white hover:opacity-90",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-6 text-base rounded-lg",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
          "disabled:opacity-50 disabled:pointer-events-none",
          "cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button, type ButtonProps };
