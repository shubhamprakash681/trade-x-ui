"use client";

import { useEffect } from "react";

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0f172a", color: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
        <main style={{ display: "grid", minHeight: "100vh", placeItems: "center", padding: "24px" }}>
          <section style={{ maxWidth: "420px", textAlign: "center" }}>
            <h1>TradeX is temporarily unavailable</h1>
            <p>Please try loading the page again.</p>
            <button type="button" onClick={retry}>Try again</button>
          </section>
        </main>
      </body>
    </html>
  );
}
