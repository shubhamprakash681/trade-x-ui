"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-profit" />,
  error: <AlertCircle className="h-5 w-5 text-loss" />,
  info: <Info className="h-5 w-5 text-info" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning" />,
};

const bgClasses: Record<ToastType, string> = {
  success: "border-profit/30 bg-profit-bg",
  error: "border-loss/30 bg-loss-bg",
  info: "border-info/30 bg-bg-elevated",
  warning: "border-warning/30 bg-warning-bg",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-80 flex-col gap-2" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex w-80 items-start gap-3 rounded-lg border p-4 shadow-lg",
              "animate-in slide-in-from-right-5 fade-in duration-300",
              bgClasses[t.type]
            )}
            role="alert"
          >
            <div className="mt-0.5 shrink-0">{icons[t.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">{t.title}</p>
              {t.message && (
                <p className="mt-0.5 text-xs text-text-secondary">{t.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
