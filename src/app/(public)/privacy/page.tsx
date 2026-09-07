import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — TradeX",
  description:
    "Privacy Policy for TradeX paper trading platform detailing how user information is collected and protected.",
};

export default function PrivacyPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-brand hover:underline transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-3 border-b border-border-primary pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              TradeX Privacy Policy
            </h1>
            <p className="text-sm text-text-tertiary">
              Last Updated: <span className="text-text-secondary">September 2026</span>
            </p>
          </div>

          {/* Privacy statement banner */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-5">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 shrink-0 text-brand mt-0.5" />
              <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">
                At <strong className="text-text-primary">TradeX</strong>, we respect and protect your privacy. This
                Privacy Policy explains how we collect, use, and safeguard your information when you use our
                paper-trading platform and associated services.
              </p>
            </div>
          </div>

          {/* Body Sections */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-text-secondary">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">1. Information We Collect</h2>
              <h3 className="text-base font-semibold text-text-primary">1.1. Personal Data</h3>
              <p>When you create an account on TradeX, you voluntarily provide basic information:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Account password (securely hashed with BCrypt; never stored in plaintext)</li>
              </ul>
              <p className="text-xs italic text-text-tertiary">
                Note: TradeX never requests or collects financial banking details, credit cards, PAN numbers, or
                government identification documents.
              </p>

              <h3 className="text-base font-semibold text-text-primary">1.2. Usage and Technical Data</h3>
              <p>When you access the platform, our servers may automatically collect standard technical information:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Device attributes, operating system, and browser version</li>
                <li>IP address and approximate geographic location</li>
                <li>Simulated trading history, orders placed, and watchlist preferences</li>
                <li>Log data including request timestamps and error traces</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">2. How We Use Your Information</h2>
              <p>The collected information is used solely to provide and improve the platform:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Authenticating user sessions and safeguarding account access</li>
                <li>Maintaining your virtual portfolio balances, open orders, and transaction history</li>
                <li>Delivering simulated price alerts and notification triggers</li>
                <li>Diagnosing system errors and optimizing backend microservices performance</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">3. Information Sharing & Third Parties</h2>
              <p>
                We do <strong className="text-text-primary">not</strong> sell, rent, monetize, or share your personal
                information with third-party advertisers or external data brokers. Your data is strictly utilized
                internally by our isolated microservices (Auth Service, Portfolio Ledger, and Notification Engine).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">4. Cookies & Local Storage</h2>
              <p>TradeX utilizes browser localStorage and cookies exclusively for critical app functionality:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <strong>Authentication Tokens:</strong> Secure JWT access and refresh tokens to persist your logged-in
                  state.
                </li>
                <li>
                  <strong>UI Theme Preferences:</strong> Storing your preferred visual mode (Light, Dark, or System)
                  across browser sessions.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">5. Data Security Measures</h2>
              <p>
                We employ industry-standard technical measures to protect your data against unauthorized access or
                disclosure:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Passwords are salted and cryptographically hashed with BCrypt.</li>
                <li>All network communications are secured using TLS/HTTPS encryption.</li>
                <li>Stateless JWT authentication with automated token expiration.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">6. Children&apos;s Privacy</h2>
              <p>
                TradeX is designed for educational simulation and is not directed to individuals under the age of 13. We
                do not knowingly collect personal data from children under 13.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">7. Your Rights and Data Deletion</h2>
              <p>
                You retain full control over your personal data. You may update your profile name or password at any
                time via your Account Profile. If you wish to delete your account and associated simulation data, you
                may reach out to us at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">8. Changes to This Privacy Policy</h2>
              <p>
                We may periodically update this Privacy Policy to reflect enhancements to our platform. Any updates will
                be posted to this page with an updated &ldquo;Last Updated&rdquo; timestamp.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">9. Contact Us</h2>
              <p>If you have questions, feedback, or privacy-related inquiries regarding TradeX, please reach out:</p>
              <p>
                <strong className="text-text-primary">Developer:</strong> Shubham Prakash
                <br />
                <strong className="text-text-primary">Email:</strong>{" "}
                <a href="mailto:shubhamprakash681@gmail.com" className="text-brand hover:underline font-medium">
                  shubhamprakash681@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
