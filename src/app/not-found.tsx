import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary p-4">
      <h1 className="text-6xl font-bold text-brand">404</h1>
      <p className="mt-4 text-lg text-text-secondary">Page not found</p>
      <p className="mt-1 text-sm text-text-tertiary">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
