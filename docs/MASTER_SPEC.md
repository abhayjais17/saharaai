# Sahara AI: Claude Code Master Spec (self-contained: spec + PRD + copy deck + mock data)

**Who reads this:** Claude Code, running in the terminal inside the Sahara AI repo (Next.js project exported from v0).
**Goal:** finish the whole product: audit what v0 already built, complete every remaining screen, build the real backend with Claude vision, integrate, test, polish and deploy.
**Source of truth:** the PRD in **Appendix A** at the end of this same file. Exact bilingual UI strings are in **Appendix B** (copy deck); exact mock data and sample-asset requirements are in **Appendix C**. Everything you need is in this one file. Do NOT look for, create or rewrite `PRD.md` or any other planning document, and never invent product requirements: if something is unclear, follow the PRD, then this spec's technical decisions. If this file and the PRD disagree, the PRD wins on product behaviour; the spec sections win on technical decisions.

**Environment facts:** Windows, PowerShell, project root `D:\saharaai`. The project uses **npm only** (`npm install` is already done). pnpm is broken on this machine and must not be used; ignore `pnpm-lock.yaml`. Use PowerShell-compatible commands (no `rm -rf`, no `&&` chaining assumptions; use `;` or separate commands, `Remove-Item`, `Get-ChildItem`, `Select-String`).

---

## 0. First actions (do these before Phase 0)

1. Save this file's content as `docs/MASTER_SPEC.md` if it is not already there (create `docs/` if needed), so later sessions can reload it.
2. Create `CLAUDE.md` in the repo root from sections 1 to 5 of this file, plus the environment facts above (npm only, Windows/PowerShell) and one line: "Full spec: docs/MASTER_SPEC.md".
3. Delete `pnpm-lock.yaml` and `pnpm-workspace.yaml` (read `pnpm-workspace.yaml` first; if it holds a setting still needed, move the equivalent into `package.json` or `.npmrc`). Remove any `"packageManager"` / `"pnpm"` entries from `package.json`. Keep `package-lock.json`. Replace pnpm mentions in docs and scripts with npm.
4. `.gitignore` must ignore `node_modules`, `.next`, `.env*` (except `.env.example`) and `*.tsbuildinfo`.
5. `git init` if needed and commit the current state as the baseline (`baseline: v0 export`).
6. Then start Phase 0.

---

## 1. Product in 10 lines

- **Sahara AI** (सहारा AI): voice-first, mobile-first PWA that helps first-time smartphone users in India finish confusing digital tasks in **English (default) or Hindi**, switchable with one tap on the "EN · हिंदी" pill.
- The user shows a **paper form**, a **website form** (screenshot or URL) or a **bill / bank message**. The app explains it in simple spoken language and guides **one field at a time**, with a **yellow highlighter swipe** landing on the exact box (signature feature).
- Features (priority): F1 physical form guide (P0), F2 message/bill explainer with fraud check (P0), F3 voice in/out (P0), F4 website form guide (P1), F5 My Profile on-device (P2), F6 Family Setup demo (P2).
- Hard safety rules: never ask for or store OTP, PIN, password, CVV, card number or Aadhaar number; never submit, pay or book anything; images are processed in memory and never stored; API keys only on the server; fraud verdicts are advisory ("looks suspicious"), never absolute.
- Non-goals: controlling other apps, reading SMS, payments, native apps, accounts/login, languages other than English and Hindi.
- Hackathon demo: 3 minutes, must work end to end with sample inputs even offline (mock mode) and with live AI on stable Wi-Fi.

---

## 2. Working agreement (how Claude Code must behave)

1. **Phases in order.** Finish and verify a phase before starting the next. Never skip Phase 0.
2. **No questions.** Choose the best option per this spec and the PRD, note the decision in `PROGRESS.md`. Stop and ask only for: missing secrets (`ANTHROPIC_API_KEY`), destructive actions on the user's machine, or a conflict that cannot be resolved from the docs.
3. **Plan first inside each phase** (short checklist in the task list), then implement, then verify.
4. **Verification is mandatory** per phase: `npm run typecheck` (add the script if missing: `tsc --noEmit`), `npm run lint`, `npm test`, `npm run build`, plus the phase's browser checks (section 11). Fix failures before moving on. Never mark a phase done with a failing check; list real known issues instead.
5. **Small commits**, one per phase minimum, message format `phase N: summary`. Do not commit `.env*`, secrets or images of real documents.
6. **Do not rewrite finished work** unless the phase says so or it is broken. Extend minimally. One component per file, thin route files, hooks in `/hooks`, shared code in `/lib`, components in `/components`.
7. **Keep `PROGRESS.md` current**: status checklist per phase, file map, decisions, known issues, next phase. A new session must be able to continue from it.
8. **Never invent data.** No fake government logos, no real department names in sample assets. Sample assets stay fictional.
9. **Security defaults**: validate every input with zod, limit body sizes, no secrets in client bundles (`NEXT_PUBLIC_*` only for the mock flag), no logging of images, base64 or user text, no `dangerouslySetInnerHTML`.
10. **Both languages every time.** Any new visible string is added to `lib/i18n.ts` in English and Hindi in the same change.

---

## 3. Tech stack (fixed)

Next.js App Router, TypeScript (strict), Tailwind CSS, shadcn/ui (only components actually used), framer-motion, lucide-react. Fonts via `next/font/google`: **Mukta** (UI, English display) and **Tiro Devanagari Hindi** (Hindi display). Backend: Next.js route handlers, `@anthropic-ai/sdk`, `zod`, `cheerio` (HTML extraction), `vitest` + `@testing-library/react`, `@playwright/test` (Chromium is preinstalled in some environments; otherwise install it with the project's normal tooling), `@axe-core/playwright`. Hosting: Vercel (HTTPS needed for camera and mic).

Environment variables (`.env.example` must list all):
```
ANTHROPIC_API_KEY=            # server only
ANTHROPIC_MODEL=claude-sonnet-5-5   # confirm against current Anthropic docs before deploy
NEXT_PUBLIC_USE_MOCK=true     # switch to false when all routes work
RATE_LIMIT_PER_MIN=20         # per IP, per route group
DEMO_CACHE=false              # true = serve cached sample responses for known demo inputs
```

---

## 4. Design system (permanent)

**Concept:** "A helpful hand and a highlighter pen." Bold deep-forest surfaces, bright mint accent, paper-white content sheets, and the yellow highlighter as the only warm colour and the one memorable motif. It must read as a finished, professional product, not a template and not a phone mock-up.

**Tokens** (CSS variables in `globals.css`, mapped into Tailwind; never hardcode hex in components):

| Token | Hex | Use |
|---|---|---|
| forest-950 / 900 / 800 | `#072A28` / `#0B3B38` / `#0F4D47` | deepest dark / hero, header, image stage / raised dark |
| mint / mint-soft | `#1FC2AA` / `#CFF3EB` | accent on dark, active states / soft fills on light |
| on-dark / on-dark-muted | `#EAF7F4` / `#A9CBC5` | text on dark |
| paper / paper-2 | `#F6FBF9` / `#E3F1ED` | content sheets / dividers |
| ink | `#0D2321` | text on light |
| peacock / peacock-d | `#0B7F72` / `#076359` | primary buttons on light / pressed |
| marker / marker-soft | `#FFD23F` / `#FFF1B8` | **only** highlights, current-step marks, logo swipe |
| alert / alert-soft | `#D93C30` / `#FCE9E6` | warnings |
| ok / ok-soft | `#1E8F54` / `#DFF3E7` | success |

[Content continues with all sections through Appendix C...]
