# Sahara AI: Progress
## Status
- [x] T0 Foundation
- [x] R0 Retrofit (palette v2 + English-default languages + bilingual data layer)
- [x] T1 Home
- [ ] R1 Responsive layout + professional visual upgrade
- [ ] T2 Voice system
- [ ] T3 Form capture + scanning
- [ ] T4 Guided steps + highlight
- [ ] T5 Message explainer
- [ ] T6 Website form
- [ ] T7 Profile + storage
- [ ] T8 Family setup
- [ ] T9 Polish pass
## Next task
R1 Responsive layout + professional visual upgrade (authorized in the resume request).
## T1 resume verification
- Restored the supplied ZIP. The previous checklist was stale: all Home components and recent-task helpers already existed.
- Passed frozen-lockfile installation/supply-chain policy, all 13 regression tests, and TypeScript checking.
- Browser checked the Home layout, local mic toggle, expanded input, unknown-intent reply, typed form navigation, English/Hindi switch, and 360px overflow. No T1 functional repairs were needed.
- Later-task destinations intentionally use the existing translated not-found screen. Real recognition remains T2; no new routes or voice features were added.
## File map
- app/globals.css: exact Sahara color tokens, Tailwind v4 mappings, display utility, base typography, focus and reduced-motion styles.
- app/layout.tsx: English-default document, LanguageProvider, Mukta/Tiro next/font variables, metadata, forest viewport color and centered 480px app shell.
- app/page.tsx: temporary dark-forest hero, animated dark Logo, translated Foundation ready heading and top-right language pill; replace only when starting T1.
- components/Logo.tsx: accessible Devanagari wordmark, sm/md/lg sizing, light/dark tones and optional one-time 500ms highlighter stroke.
- components/LanguageProvider.tsx: useLanguage() context with language, setLanguage, bound t(key) and ready; persisted choice and document language synchronization.
- components/LanguageSwitch.tsx: EN · हिंदी pill, light/dark tones, 36px visual height and 48x48px targets.
- lib/i18n.ts: typed English/Hindi dictionary; t(key, language = 'en') for non-component use.
- lib/motion.ts: shared easing [0.22, 1, 0.36, 1].
- lib/types.ts: exact master-prompt API interfaces.
- lib/mock.ts: bilingual scholarship form, bill/scam explanations, website form, intent replies and language-aware getters; raw SMS remains English.
- lib/api.ts: four mock-by-default adapters, required final Language argument, language in every POST body, localized fallback errors and request timeout.
- lib/api-guards.ts: runtime validation for responses from future backend routes.
- lib/storage.ts: SSR-safe JSON get/set/remove, clearSaharaStorage and same-tab change event.
- lib/image.ts: canvas resizing, maximum edge 1600px, JPEG quality 0.82, object URL cleanup.
- lib/speech.ts: public exports for both speech hooks.
- lib/speech-types.ts: browser recognition interfaces including prefixed support.
- hooks/useSpeechRecognition.ts: useSpeechRecognition(language), en-IN/hi-IN recognition, interim transcript, lifecycle cleanup, support/error states and reset on language change.
- hooks/useSpeech.ts: useSpeech(language, options?), en-IN/hi-IN synthesis and voice selection, cancellation on language change, support state, rate and mute settings.
- public/mock/sample-form.svg: fictional 800x1100 scholarship paper; field-1 through field-10 rectangles match MOCK_FORM.
- public/mock/sample-bill-sms.svg: exact sample bill text in a BIJLI-VIB message bubble.
- public/mock/sample-scam-sms.svg: exact sample scam text, inert link text, clearly labelled as a sample.
- public/icons/sahara.svg: forest-900 background, mint ring and yellow highlighter source artwork; public/icon.svg uses the same artwork.
- scripts/generate-icons.mjs: generates the 192/512px PWA PNGs, 180px Apple icon and 32px favicons using Next.js's Sharp dependency.
- public/icons/icon-192.png: 192px raster icon generated from the SVG artwork.
- public/icons/icon-512.png: 512px raster icon generated from the SVG artwork.
- public/manifest.webmanifest: unchanged Devanagari app identity, English description/default language, forest theme/background, standalone display and maskable icons.
- scripts/embed-sample-fonts.mjs: embeds Mukta into SVG assets so Hindi renders without installed device fonts; optional file arguments support later samples.
- .env.example: NEXT_PUBLIC_USE_MOCK=true.
- next.config.mjs: baseline response headers; production TypeScript checks enabled.
- package.json: framer-motion dependency, tsx test runner, test and typecheck scripts.
- pnpm-workspace.yaml: existing workspace policy plus explicit esbuild build permission for tsx.
- tests/foundation.test.ts: nine regression tests covering both dictionaries, bilingual contracts/fixtures, unchanged SVG geometry/text, intent detection, SSR storage, isolated mock responses and real-mode language POST/error handling.
## Decisions
- T0 + R0 only: no T1 Home features, inner routes, guide UI, settings UI, API handlers or real model calls have been built. Next task remains T1.
- Exact v2 palette retains existing token names and adds forest-950/900/800, mint/mint-soft and on-dark/on-dark-muted. Dark hero/header surfaces use forest-900; light content uses paper. Yellow stays reserved for the highlighter/logo swipe. Desktop backdrop is paper-2; device dark mode does not override the palette.
- Tiro Devanagari Hindi 400 uses --font-display; Mukta 400/500/600/700/800 uses --font-ui. Both include devanagari and latin. The font-display utility uses Mukta 800 in English and Tiro 400 in Hindi; the Logo always uses Tiro and keeps सहारा in both languages.
- Language defaults to en during SSR and first launch. LanguageProvider restores a valid stored choice via lib/storage at sahara.settings.language, synchronizes html lang and listens for storage changes. Invalid/cleared values fall back to en; unavailable storage still permits in-session switching.
- Components obtain t(key) from useLanguage(); shared code uses t(key, language). All new visible text and accessible labels have dictionary entries. Language labels retain their native EN/हिंदी forms in both modes.
- The language pill is visually 36px high with 48x48px targets, aria-pressed state and visible keyboard focus. Dark active state is mint/forest-950; light active state is mint-soft/peacock.
- API functions require Language last and include language in every request. Compatibility fields containing hindi now hold the requested language. Mock exports are bilingual records plus _HI/_EN fixtures and cloning getters; sample SVGs, raw SMS and box coordinates remain unchanged.
- Local storage and mock data are explicitly required by the master prompt; no database or external runtime integration is needed for this frontend foundation.
- Storage API: get<T>(key, fallback?), set(key, value), remove(key), clearSaharaStorage(); writes/removals return boolean. Same-tab notifications use STORAGE_EVENT. Clear removes only sahara.* keys.
- Speech settings contract for later tasks: sahara.settings contains muted: boolean and rate: number (default 0.95). Hooks read these at speak time; muting cancels current speech. Hook implementations live in hooks/ and are re-exported from the requested lib/speech.ts.
- Mock mode is enabled unless NEXT_PUBLIC_USE_MOCK is exactly false; responses wait 1200–2200ms and return independent copies. Real mode posts documented input plus language and validates JSON responses. Backend errors are passed through; network, timeout and malformed-response fallbacks use the requested language.
- Website keywords take priority over generic form keywords so mixed phrases such as वेबसाइट फ़ॉर्म select the website task.
- Mock image classification recognizes the supplied SVG samples/paths; embedded font bytes are excluded from text matching. Arbitrary photos return fixed fixtures, not real OCR or safety analysis.
- All ten scholarship coordinates are computed from exact pixel rectangles divided by 800x1100. SVGs contain embedded Mukta fonts and require no external image/font fetch at runtime.
- PWA assets include PNG icons generated from the local inline SVG; no service worker or offline app caching was requested in T0.
- Verification passed: frozen-lockfile installation and supply-chain policy, production build, TypeScript check, seven regression tests, browser rendering at 1216x682/360x780/390x844, reduced-motion state, Hindi sample rendering, manifest and 192/512px icon delivery. No browser errors observed.
- R0 verification passed: frozen-lockfile installation and supply-chain policy, all nine regression tests, TypeScript check and production build. Browser checked at 390x844, 360x780 and 1280x800: English first launch, instant Hindi switch, persisted Hindi after reload, keyboard switch back to English, html lang, Mukta 800, 48x48px targets, visible 3px focus outline and no horizontal overflow/browser errors.
- Actual microphone permission and device speech output remain for T2 interactive verification; the temporary home deliberately exposes no microphone UI.
## Known issues
- No known T0/R0 defects. Real backend endpoints are intentionally absent; keep mock mode enabled until backend handoff.
- Speech recognition, Hindi voices and autoplay availability depend on the browser/device. Hooks fail silently when unsupported; visible fallbacks belong to T2.
## Mock data
- MOCK_FORM / MOCK_FORM_HI / MOCK_FORM_EN: bilingual record and individual ten-field scholarship fixtures with unchanged normalized boxes and four checklist items.
- MOCK_BILL_SMS: exact English electricity bill SMS, unchanged in both modes.
- MOCK_BILL / MOCK_BILL_HI / MOCK_BILL_EN: bilingual ₹840 electricity bill explanations, localized due date and sender.
- MOCK_SCAM_SMS: exact English KYC/OTP scam example, unchanged in both modes.
- MOCK_SCAM / MOCK_SCAM_HI / MOCK_SCAM_EN: bilingual suspicious explanation, warning, reasons and safe next steps.
- MOCK_WEBSITE_FORM / MOCK_WEBSITE_FORM_HI / MOCK_WEBSITE_FORM_EN: bilingual six-field portal fixtures with null boxes for URL mode.
- getMockForm(language), getMockBill(language), getMockScam(language), getMockWebsiteForm(language): isolated fixture copies in the requested language.
- mockDetectIntent(transcript, language): Hindi/English keyword routing with friendly localized replies and unknown fallback.
