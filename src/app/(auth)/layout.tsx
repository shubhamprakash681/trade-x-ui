import Link from "next/link";
import { Logo } from "@/components/atoms/logo";
import { Footer } from "@/components/organisms/footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary">
      <div className="flex flex-1 items-center justify-center p-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Link href="/" aria-label="TradeX Home" className="transition-transform hover:scale-105">
              <Logo size="lg" />
            </Link>
          </div>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
