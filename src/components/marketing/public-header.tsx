import Link from "next/link";
import { ArrowRight, CandlestickChart, Menu } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="site-container header-inner">
        <Link href="/" className="brand-lockup" aria-label="TradeX home">
          <span className="brand-mark"><CandlestickChart aria-hidden="true" /></span>
          <span>Trade<span className="brand-accent">X</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/#features">Platform</Link><Link href="/about">About</Link><Link href="/#how-it-works">How it works</Link><Link href="/privacy">Trust & safety</Link>
        </nav>
        <div className="header-actions"><Link href="/login" className="text-link">Log in</Link><Link href="/register" className="button button-primary button-small">Start trading <ArrowRight aria-hidden="true" /></Link><button className="mobile-menu" aria-label="Open navigation"><Menu aria-hidden="true" /></button></div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return <footer className="public-footer"><div className="site-container footer-grid"><div><Link href="/" className="brand-lockup"><span className="brand-mark"><CandlestickChart aria-hidden="true" /></span><span>Trade<span className="brand-accent">X</span></span></Link><p className="footer-copy">Build conviction before you put real capital on the line.</p></div><div className="footer-links"><div><strong>Product</strong><Link href="/#features">Features</Link><Link href="/#how-it-works">How it works</Link><Link href="/register">Create account</Link></div><div><strong>Company</strong><Link href="/about">About TradeX</Link><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms of service</Link></div></div></div><div className="site-container footer-bottom"><span>© 2026 TradeX. Built for better decisions.</span><span>Paper trading involves no real money.</span></div></footer>;
}

export function PublicShell({ children }: { children: React.ReactNode }) { return <div className="public-site"><PublicHeader />{children}<PublicFooter /></div>; }

export function SectionEyebrow({ children }: { children: React.ReactNode }) { return <p className="eyebrow">{children}</p>; }

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="arrow-link">{children}<ArrowRight aria-hidden="true" /></Link>; }
