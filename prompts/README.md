# TradeX UI Enhancement Prompts

This directory contains modular, ready-to-use prompts for AI coding assistants (e.g. Claude Opus, Claude 3.7 Sonnet, Antigravity, or Gemini) to elevate `trade-x-ui` into an institutional-grade trading platform.

## Available Prompt Files

| File | Purpose | Scope |
| :--- | :--- | :--- |
| [`../PROMPT_ENHANCEMENT.md`](../PROMPT_ENHANCEMENT.md) | **All-in-One Master Prompt** | Complete end-to-end overhaul in a single prompt |
| [`01_THEME_AND_DESIGN_SYSTEM.md`](./01_THEME_AND_DESIGN_SYSTEM.md) | **Phase 1: Design Tokens** | `globals.css`, Titanium Midnight palette, dark/light modes |
| [`02_PRO_TRADING_WORKSTATION.md`](./02_PRO_TRADING_WORKSTATION.md) | **Phase 2: Trading Workstation** | `/stocks/[symbol]`, FastOrderTicket, OrderBookDepth, bottom drawer |
| [`03_PORTFOLIO_VAULT_AND_MATRIX.md`](./03_PORTFOLIO_VAULT_AND_MATRIX.md) | **Phase 3: Portfolio Vault** | `/portfolio`, KPI bento grid, Asset Allocation bar, Holdings Matrix |

## How to Use

- **Option A (One-Shot Execution)**: Provide the complete contents of `PROMPT_ENHANCEMENT.md` to your coding assistant.
- **Option B (Phased Step-by-Step Execution)**: Feed prompts sequentially: `01_THEME_AND_DESIGN_SYSTEM.md` ➔ `02_PRO_TRADING_WORKSTATION.md` ➔ `03_PORTFOLIO_VAULT_AND_MATRIX.md`.

