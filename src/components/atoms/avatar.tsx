import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        className={cn(
          "rounded-full object-cover ring-2 ring-border-primary",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold",
        "bg-brand/20 text-brand ring-2 ring-border-primary",
        sizeClasses[size],
        className
      )}
      aria-label={name || "User avatar"}
    >
      {initials}
    </div>
  );
}
