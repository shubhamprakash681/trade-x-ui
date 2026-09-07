import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/components/atoms/toast";

export const viewport: Viewport = { themeColor: "#0F172A" };

export const metadata: Metadata = {
  title: "TradeX — Paper Trading Platform",
  description:
    "TradeX is a production-inspired paper trading platform. Practice stock trading with virtual money in a risk-free environment.",
  keywords: ["trading", "paper trading", "stocks", "portfolio", "investment"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
