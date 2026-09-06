import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-primary bg-bg-secondary p-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-text-primary", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-text-secondary", className)} {...props}>
      {children}
    </p>
  );
}

function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("mt-4 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
