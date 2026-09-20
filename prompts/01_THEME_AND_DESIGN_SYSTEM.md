# Step 1: Theme & Visual Tokens Overhaul (Titanium Midnight)

Copy and paste this prompt to execute **Phase 1: Design System & Tokens**:

```markdown
# TASK: IMPLEMENT "TITANIUM MIDNIGHT" DESIGN SYSTEM IN TradeX UI

## Context
You are working on `trade-x-ui`. The goal of this task is to update the theme, CSS variables, and visual design tokens to the **Titanium Midnight** luxury fintech theme.

### Key Rules:
- DO NOT change any static component interfaces (`Button`, `Card`, `Input`, `AppShell`, `Sidebar`, `Navbar`, etc.).
- Maintain backwards compatibility with all existing props so unit tests continue to pass.
- Upgrade `src/app/globals.css` to transform the platform aesthetics from generic Indigo/Slate to a high-end Deep Obsidian Navy & Luminescent Jade/Coral palette.

---

## Instructions

### 1. Update `src/app/globals.css`
Replace the root and dark theme tokens in `src/app/globals.css`:

```css
@import "tailwindcss";

/* ─── Titanium Midnight Design System ──────────────────────────────────────── */

:root {
  /* Brand */
  --brand-primary: #2563eb;
  --brand-primary-hover: #1d4ed8;
  --brand-secondary: #0284c7;
  --brand-accent: #4f46e5;

  /* Semantic / Financial */
  --color-profit: #059669;
  --color-profit-bg: #ecfdf5;
  --color-loss: #e11d48;
  --color-loss-bg: #fff1f2;
  --color-warning: #d97706;
  --color-warning-bg: #fffbeb;
  --color-info: #2563eb;

  /* Surfaces (Light Mode) */
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --bg-elevated: #ffffff;
  --border-primary: #e2e8f0;
  --border-secondary: #cbd5e1;

  /* Text (Light Mode) */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --text-inverse: #ffffff;

  /* Chart (Light Mode) */
  --chart-line: #2563eb;
  --chart-candle-up: #059669;
  --chart-candle-down: #e11d48;
  --chart-volume: #94a3b8;
  --chart-grid: #e2e8f0;
  --chart-crosshair: #64748b;

  /* Gradients */
  --gradient-brand: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #0284c7 100%);
  --gradient-profit: linear-gradient(135deg, #059669 0%, #047857 100%);
  --gradient-loss: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
  --gradient-surface: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.dark {
  /* Brand */
  --brand-primary: #3b82f6;
  --brand-primary-hover: #60a5fa;
  --brand-secondary: #38bdf8;
  --brand-accent: #6366f1;

  /* Semantic / Financial */
  --color-profit: #10b981;
  --color-profit-bg: rgba(16, 185, 129, 0.12);
  --color-loss: #f43f5e;
  --color-loss-bg: rgba(244, 63, 94, 0.12);
  --color-warning: #f59e0b;
  --color-warning-bg: rgba(245, 158, 11, 0.12);
  --color-info: #38bdf8;

  /* Surfaces (Titanium Midnight - Dark Mode) */
  --bg-primary: #0a0e17;
  --bg-secondary: #111726;
  --bg-tertiary: #172033;
  --bg-elevated: #1a243a;
  --border-primary: rgba(255, 255, 255, 0.08);
  --border-secondary: rgba(255, 255, 255, 0.15);

  /* Text (Dark Mode) */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --text-inverse: #0a0e17;

  /* Chart (Dark Mode) */
  --chart-line: #3b82f6;
  --chart-candle-up: #10b981;
  --chart-candle-down: #f43f5e;
  --chart-volume: rgba(148, 163, 184, 0.35);
  --chart-grid: rgba(255, 255, 255, 0.04);
  --chart-crosshair: #94a3b8;

  /* Gradients */
  --gradient-brand: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #38bdf8 100%);
  --gradient-profit: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-loss: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
  --gradient-surface: linear-gradient(180deg, #111726 0%, #0a0e17 100%);
}

@theme inline {
  --color-brand: var(--brand-primary);
  --color-brand-hover: var(--brand-primary-hover);
  --color-brand-secondary: var(--brand-secondary);
  --color-brand-accent: var(--brand-accent);

  --color-profit: var(--color-profit);
  --color-profit-bg: var(--color-profit-bg);
  --color-loss: var(--color-loss);
  --color-loss-bg: var(--color-loss-bg);
  --color-warning: var(--color-warning);
  --color-warning-bg: var(--color-warning-bg);
  --color-info: var(--color-info);

  --color-bg-primary: var(--bg-primary);
  --color-bg-secondary: var(--bg-secondary);
  --color-bg-tertiary: var(--bg-tertiary);
  --color-bg-elevated: var(--bg-elevated);
  --color-border-primary: var(--border-primary);
  --color-border-secondary: var(--border-secondary);

  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  --color-text-inverse: var(--text-inverse);

  --color-chart-line: var(--chart-line);
  --color-chart-candle-up: var(--chart-candle-up);
  --color-chart-candle-down: var(--chart-candle-down);
  --color-chart-volume: var(--chart-volume);
  --color-chart-grid: var(--chart-grid);
  --color-chart-crosshair: var(--chart-crosshair);
}
```

### 2. Verify Component Tests
Run the test suite to ensure the tokens didn't break any component contracts:
```bash
npm run test
```
```

