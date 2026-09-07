import { PublicNavbar } from "@/components/organisms/public-navbar";
import { Footer } from "@/components/organisms/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary overflow-x-clip w-full min-w-0">
      <PublicNavbar />
      <main className="flex-1 w-full min-w-0">{children}</main>
      <Footer />
    </div>
  );
}
