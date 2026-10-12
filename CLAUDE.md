# Sahara AI - Project Context for Claude Code

## Product in 10 lines

- **Sahara AI** (सहारा AI): voice-first, mobile-first PWA that helps first-time smartphone users in India finish confusing digital tasks in **English (default) or Hindi**, switchable with one tap on the "EN · हिंदी" pill.
- The user shows a **paper form**, a **website form** (screenshot or URL) or a **bill / bank message**. The app explains it in simple spoken language and guides **one field at a time**, with a **yellow highlighter swipe** landing on the exact box (signature feature).
- Features (priority): F1 physical form guide (P0), F2 message/bill explainer with fraud check (P0), F3 voice in/out (P0), F4 website form guide (P1), F5 My Profile on-device (P2), F6 Family Setup demo (P2).
- Hard safety rules: never ask for or store OTP, PIN, password, CVV, card number or Aadhaar number; never submit, pay or book anything; images are processed in memory and never stored; API keys only on the server; fraud verdicts are advisory ("looks suspicious"), never absolute.
- Non-goals: controlling other apps, reading SMS, payments, native apps, accounts/login, languages other than English and Hindi.
- Hackathon demo: 3 minutes, must work end to end with sample inputs even offline (mock mode) and with live AI on stable Wi-Fi.

## Working agreement

1. **Phases in order.** Finish and verify a phase before starting the next. Never skip Phase 0.
2. **No questions.** Choose the best option per this spec and the PRD, note the decision in `PROGRESS.md`. Stop and ask only for: missing secrets (`ANTHROPIC_API_KEY`), destructive actions on the user's machine, or a conflict that cannot be resolved from the docs.
3. **Plan first inside each phase** (short checklist in the task list), then implement, then verify.
4. **Verification is mandatory** per phase: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, plus the phase's browser checks. Fix failures before moving on.
5. **Small commits**, one per phase minimum, message format `phase N: summary`. Do not commit `.env*`, secrets or images of real documents.
6. **Do not rewrite finished work** unless the phase says so or it is broken. Extend minimally.
7. **Keep `PROGRESS.md` current**: status checklist per phase, file map, decisions, known issues, next phase.
8. **Never invent data.** No fake government logos, no real department names in sample assets.
9. **Security defaults**: validate every input with zod, limit body sizes, no secrets in client bundles, no logging of images/base64/user text.
10. **Both languages every time.** Any new visible string is added to `lib/i18n.ts` in English and Hindi in the same change.

## Tech stack

Next.js App Router, TypeScript (strict), Tailwind CSS, shadcn/ui, framer-motion, lucide-react. Fonts: **Mukta** (UI, English display) and **Tiro Devanagari Hindi** (Hindi display). Backend: Next.js route handlers, `@anthropic-ai/sdk`, `zod`, `cheerio`, `vitest`, `@playwright/test`, `@axe-core/playwright`. Hosting: Vercel.

## Design system

**Concept:** "A helpful hand and a highlighter pen." Bold deep-forest surfaces, bright mint accent, paper-white content sheets, and the yellow highlighter as the only warm colour and the one memorable motif.

**Tokens** (never hardcode hex in components):
- forest-950 / 900 / 800: `#072A28` / `#0B3B38` / `#0F4D47`
- mint / mint-soft: `#1FC2AA` / `#CFF3EB`
- on-dark / on-dark-muted: `#EAF7F4` / `#A9CBC5`
- paper / paper-2: `#F6FBF9` / `#E3F1ED`
- ink: `#0D2321`
- peacock / peacock-d: `#0B7F72` / `#076359`
- marker / marker-soft: `#FFD23F` / `#FFF1B8` (**only** for highlights)
- alert / alert-soft: `#D93C30` / `#FCE9E6`
- ok / ok-soft: `#1E8F54` / `#DFF3E7`

**Type:** 18px base, display uses Tiro Devanagari Hindi in Hindi mode and Mukta 800 in English mode. The "सहारा" wordmark is always Devanagari.

**Motion:** Only the ten motions specified in the design system (section 4 of master spec). Easing `cubic-bezier(0.22, 1, 0.36, 1)`.

## Data contracts

All types in `lib/types.ts`. Every API request carries `language` (`"en"` or `"hi"`). Fields with `_hindi` suffix contain text in the requested language (kept for compatibility).

Routes: `/` Home, `/form`, `/message`, `/website`, `/profile`, `/family`, plus dev-only `/dev/states`.

## Environment

- **Windows, PowerShell** - project root `D:\saharaai`
- **npm only** (pnpm is broken on this machine)
- Use PowerShell-compatible commands: `Remove-Item` not `rm -rf`, `;` not `&&` chaining

## Full spec

docs/MASTER_SPEC.md
