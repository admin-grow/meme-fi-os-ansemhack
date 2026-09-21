# MemeFI OS 🚀
> **Don't just launch a token. Launch an entire movement.**  
> *The AI-powered multi-agent studio that transforms internet sentiment into complete on-chain Solana token brands—synthesizing custom lore, vector mascots, social launch kits, and ClawPump bonding curves with a human in the loop.*  
> *Built for the **#AnsemHack** in collaboration with **ClawPump** (`@clawpumptech`).*

[![Live Demo](https://img.shields.io/badge/Live%20App-memefios.com-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://memefios.com)
[![ClawPump](https://img.shields.io/badge/Bonding%20Curve-ClawPump%20v2-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://clawpump.tech)
[![Hackathon](https://img.shields.io/badge/Hackathon-AnsemHack%202026-FF007A?style=for-the-badge)](https://x.com/clawpumptech)

---

## 🌐 Project Links & Submission Overview

* **Live Web Application:** [https://memefios.com](https://memefios.com)
* **Cloud Run Preview:** [https://ais-pre-pui6ag2iv4o6xlym7chb34-364432142619.us-east1.run.app](https://ais-pre-pui6ag2iv4o6xlym7chb34-364432142619.us-east1.run.app)
* **Target Protocol:** ClawPump (`clawpump.tech`) on Solana
* **Target Track:** Autonomous Agents & Meme Coin Infrastructure (#AnsemHack 2026)
* **Official Hashtags & Mentions:** `#AnsemHack` `#Solana` `#ClawPump` `#MemeCoin` `@clawpumptech` `@MemeFi_OS`

---

## ⚡ What MemeFI OS Executes

MemeFI OS replaces the chaotic, manual meme coin launch process with an end-to-end multi-agent pipeline governed by strict Human-in-the-Loop (HITL) approval gates.

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│     AGENT 01    │ ──> │     AGENT 02     │ ──> │     AGENT 03      │ ──> │     AGENT 04      │
│  Trend & Lore   │     │  Mascot & Memes  │     │  Community Engine │     │ Token Micro-Site  │
└─────────────────┘     └──────────────────┘     └───────────────────┘     └───────────────────┘
         │                       │                         │                         │
         ▼                       ▼                         ▼                         ▼
  Ticker, Story,          512x512 Mascot,          Telegram Dispatches,      Live Curve Tracker,
  Tweet Pack & Lore       Canvas Meme Studio       1-Click Twitter Intent    Holder Stream & FAQ
```

---

### 1. 🤖 The 4-Agent Pipeline

1. **Agent 01 (Trend & Narrative Strategist):**
   * Synthesizes 100% unique 3–5 letter tickers derived from user sentiment or trend input.
   * Generates viral scores, multi-paragraph launch lore, 3-season narrative arcs, and launch tweet packs.
   * Enforces zero fabricated financial promises and sanitizes blacklisted terms.

2. **Agent 02 (Visual Content & Meme Studio):**
   * Synthesizes high-contrast vector SVG mascots and generative image prompts.
   * Renders instant HTML5 canvas meme overlays (*Breaking News*, *God Candle Chart*, *Distracted Degen*, *Laser Eyes Matrix*, and *16:9 Social Headers*).
   * Direct 1-click PNG/SVG download or Solana on-chain inscription formatting.

3. **Agent 03 (Community Mobilizer & Social Launch Engine):**
   * Generates formatted Telegram community alerts, green candle notifications, and whale buy broadcasts.
   * Builds 1-click URL-encoded X (Twitter) launch intents and community mobilization dispatches targeting `@blknoiz06`, `#AnsemHack`, and `#Solana`.

4. **Agent 04 (Dedicated Token Micro-Sites):**
   * Instantly creates standalone `/token/:mintAddress` live ecosystem pages for every deployed coin.
   * Displays real-time bonding curve progression toward the 85 SOL Raydium migration threshold.
   * Includes interactive Meme Lore AI chat widget, on-chain buy feed, holder rewards calculator, and FAQ.

---

### 2. 🛡️ Non-Custodial Security & Human-in-the-Loop (HITL)

* **100% Non-Custodial Architecture:**
  * Private keys are **never** held or transmitted to any server.
  * All transaction bytecode is formatted client-side and signed directly by the user's browser wallet.
* **Supported Wallets:**
  * **Phantom** & **Solflare** for live Solana mainnet deployments.
  * **Devnet Sandbox Keypair** with built-in 1-click SOL faucet for risk-free testing.
* **Human-in-the-Loop (HITL) Workflow:**
  * The user reviews, customizes, and approves every AI-generated element (ticker, lore, tweet pack, and mascot artwork) at each step.
  * No contract is deployed or broadcast until the user explicitly reviews the pre-flight checklist and clicks to sign with their wallet.

---

### 3. 🌊 ClawPump Bonding Curve Specifications

* **Fair Launch Parameter:** 100% community distribution with 0% presale or insider allocations.
* **Mint Authority:** Permanently revoked (`Option::None`) upon creation to enforce a fixed non-inflationary 1B supply.
* **Freeze Authority:** Permanently revoked (`Option::None`) to prevent blacklisting and honeypots.
* **Genesis LP Defense:** 100% of initial liquidity pool tokens are routed to the verified Solana Incinerator dead address upon Raydium migration.
* **Jito Anti-Snipe & Anti-MEV:** Optional private mempool bundle formatting to defend block-0 transactions against sandwich attacks.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite | Fast, responsive Single Page Application with dynamic client routing (`/token/:mintAddress`). |
| **UI & Styling** | Tailwind CSS, Lucide Icons, Canvas Confetti | Terminal-themed interface with high contrast and smooth micro-animations. |
| **AI Multi-Agent Core** | Google Gemini SDK (`@google/genai`) | Multi-agent generation with server-side proxying and deterministic offline fallbacks. |
| **Blockchain** | Solana Web3.js, ClawPump Program v2 | Non-custodial wallet adapters, transaction builders, and bonding curve telemetry. |
| **Backend API** | Node.js, Express | Server-side endpoints for AI synthesis, rate limiting, and parameter verification. |

---

## 🔌 Backend Endpoints (Express Server)

* `POST /api/generate-full-campaign` — Synthesizes complete 4-agent campaign package from user input.
* `POST /api/generate-narrative` — Executes Agent 01 narrative and ticker synthesis.
* `POST /api/generate-image` — Generates visual mascot art via Gemini with deterministic SVG fallback.
* `POST /api/generate-telegram-raid` — Formats Agent 03 community dispatches and social intent URLs.
* `POST /api/deploy-token` — Validates deployment parameters and constructs Solana transaction metadata.
* `POST /api/mascot-lore-chat` — Interactive mascot lore persona chat widget.
* `GET /api/security/audit-health` — Real-time security and compliance verification inspector.

---

## 🚀 Quickstart (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
# Set GEMINI_API_KEY if you wish to use live Gemini API calls in development
```

### 3. Start Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

---

## 🏆 #AnsemHack Pitch Summary (Quick Cheat Sheet)

If asked by hackathon judges or community members:
1. **What is MemeFI OS?**  
   It's a full-stack, non-custodial multi-agent platform on Solana that transforms any idea into a verified token brand with viral lore, vector mascots, community tweet kits, and ClawPump bonding curves.
2. **Where does the AI run?**  
   The AI agents run via Google Gemini on a Node.js backend proxy with resilient client-side fallbacks so users never get blocked by rate limits.
3. **How does wallet signing work?**  
   It is 100% non-custodial. The frontend builds the transaction instructions and passes them to Phantom, Solflare, or a local Devnet burner keypair to sign directly against Solana.
4. **How does ClawPump integrate?**  
   Tokens deploy to ClawPump constant-product bonding curves with revoked mint and freeze authority and 100% LP incinerator burns upon Raydium migration.
