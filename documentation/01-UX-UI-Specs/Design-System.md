# Aura Self — Brand & Design System

Status: living document. This is the first version — it documents decisions already made in code (the `coach-*` design tokens, the Aura mascot direction) and sets the rules for everything built from here on. Update it whenever the palette, mascot, or voice guidelines change; don't let the code drift ahead of it again.

## 1. Brand story & positioning

**Self** is the user — the person doing the understanding. **Aura** is a companion character, not a job title.

> Aura is who you talk to. Coaching is one of the things Aura does with you, in a session — it is never Aura's fixed identity.

The product must never introduce itself by declaring a role first ("I am your AI Coach"). It introduces itself as a companion, and coaching only comes up as *what happens in this session*, offered warmly and specifically. This is a direct, deliberate response to a real risk: opening with "Coach" reads as clinical and can make a first-time user hesitate to open up. Opening with a companion who's simply *there with you* does not.

Canonical tone reference (product owner's own words, kept verbatim as the north star for anyone writing Aura's voice):

> "một người bạn đồng hành là Aura và Self là bạn, đến với phiên coach hôm nay, tôi sẽ lắng nghe và đặt câu hỏi cùng bạn, sẽ cùng bạn lưu lại hành trình..."

Derived openers usable across the product (adapt, don't copy verbatim everywhere — see §5 for the pattern):
- "Mình là Aura. Hôm nay mình sẽ lắng nghe và đặt câu hỏi cùng bạn."
- "Aura ở đây, đồng hành cùng bạn trong hành trình hiểu chính mình."
- "Đến với phiên trò chuyện hôm nay, mình và bạn sẽ cùng nhau lưu lại những gì quan trọng."

## 2. Color system

The `coach-*` Tailwind v4 tokens (`src/styles/tailwind.css`, `@theme` block) are the **official, documented palette** as of this document. They were introduced for the Coach/Dashboard/Onboarding surfaces and already match the sample homepage design (cream background, dark forest-green primary, warm clay accent) — this document promotes them from "the newer system" to *the* system.

| Token | Hex | Usage |
|---|---|---|
| `coach-bg` | `#f7f5f2` | Page background |
| `coach-surface` | `#ffffff` | Cards, panels, inputs |
| `coach-primary` | `#3f5c52` | Primary CTA, headings accents, active/selected states |
| `coach-primary-light` | `#6b8a7e` | Primary hover state, secondary map nodes |
| `coach-accent` | `#c98a5e` | Sparing warm highlight (small dots, badges) — not for large surfaces |
| `coach-text` | `#26302c` | Body/heading text |
| `coach-text-muted` | `#6b7570` | Secondary text, captions, placeholders |
| `coach-border` | `#e3e0da` | Borders, dividers, dashed connector lines |

**Deprecated / legacy — do not use in new work:** the `--garden-*` custom properties in `src/styles/_variables.scss` (`--garden-sky`, `--garden-grass`, `--garden-earth`, `--garden-bloom`, etc.), and the `--c-*` aliases built on top of them. They belong to the pre-rebrand garden-journal concept.

Known remaining migration debt (not addressed by this round of work — flagged here so it isn't lost):
- `MimoHeader` (site header/nav) is still on legacy garden styling.
- `src/index.scss` still carries a legacy global `button:hover` reset tied to `--c-secondary` — always go through the `Button`/`ButtonLink`/`ButtonAnchor` components (`src/components/Button/Button.tsx`), which explicitly override it; never hand-roll a `<button>` class string.

## 3. Typography

- **Body / UI**: `Be Vietnam Pro` (`--font-family-primary`) — chosen for solid Vietnamese diacritic support. Use for all body text, labels, and UI chrome.
- **Headings**: `Lora` (`--font-family-heading`) — a serif used to give headings a warmer, less corporate feel than the sans body text. Canonical usage pattern:
  ```
  <h1 className="text-2xl font-bold text-coach-text [font-family:var(--font-family-heading)]">
  ```
  (see `CoachChatPage.tsx`'s and the redesigned `GardenHero.tsx`'s `<h1>`).
- Both are loaded via Google Fonts `<link>` in `index.html` — no separate loading work needed for new pages.

## 4. Aura mascot — visual spec

Aura is a small, cute, 3D-rendered toy-robot companion (users describe it as penguin/owl-like — lean into that warmth, not a "device" or "assistant" look).

- **Body**: rounded, soft white/cream shell.
- **Accents**: dark navy/teal panels on chest, hands, and feet.
- **Head**: two thin antennae topped with small teal balls; a dark oval face-plate holding two large, glowing light-blue eyes (the single most expressive feature — most poses should be readable from the eyes alone); a small teal nose/mouth nub, no other facial detail.
- **Hands**: soft, mitten-shaped, teal-tipped.
- **Staging**: often shown standing on a small round pedestal, with soft glowing teal/purple neon connection-line accents in the background — this directly echoes the relationship-map node-graph motif and should be treated as Aura's "home" visual environment, not just decoration.
- **Lighting/finish**: soft studio lighting, gentle drop shadow, no hard edges.

### Where Aura currently appears (revised — see rationale below)

The homepage originally carried a large, prominent "waving hello" mascot moment in the hero. That was traded for a lighter touch after review: a big hero character added scroll height without adding clarity, and the more useful job for the mascot is signaling *"this preview is Aura, the same one you'll talk to"* — not performing a welcome animation. Current placements:

| Placement | Treatment | Purpose |
|---|---|---|
| Homepage — Chat preview card, AI turn (`HomePreviewGrid/ChatPreviewCard.tsx`) | ~36px circular avatar beside the AI reply bubble (standard chat avatar-next-to-bubble pattern) | Makes the character-to-message link legible at a glance — "this reply is Aura talking", not just a decorative header icon |
| Coach chat page header (`CoachChatPage.tsx`) | Small (~40px) circular avatar, next to the page `<h1>` | Same association, carried into the live chat experience |
| `MimoCharacter` component (`src/components/MimoCharacter/MimoCharacter.tsx`) | Larger floating/glowing full presence (no small-badge mode) | Not currently used anywhere — kept available, undocumented-as-live, for a possible future full-screen moment (e.g. an onboarding welcome step) |

Do not add new mascot placements or poses speculatively — if a future surface needs one, define it here first, then implement.

### Asset hand-off contract

No production art exists yet for Aura — the reference used to write this spec was a still frame from a concept video, not an export. Until final art is delivered:

- Folder: `src/assets/aura/`
- File in place today: `aura-idle.gif` — the placeholder asset (moved from the old `src/assets/mimo.gif`), used by every current placement above.
- When final art arrives, replace this file (keep the same name, or update the small number of import sites: `MimoCharacter.tsx`, `ChatPreviewCard.tsx`, `CoachChatPage.tsx`) — no structural changes needed.
- Format assumption: a static `<img>`-compatible file (PNG/WebP/GIF). A Lottie file or short video would need a small rendering-wrapper change at each of the three import sites above — not a redesign, just noting it's not pre-built for that today.

## 5. Voice & tone guidelines

Principles (build on `brand.description`'s existing "không phán xét, không áp đặt lời khuyên" — no judgment, no imposed advice):
- **Companion first, coach second.** Never open a surface by naming a role. Open by being present, then let the activity (a coaching session) emerge naturally.
- **First person, warm, specific.** Aura speaks as "mình", not as a system or a brand. Avoid imperative/instructional phrasing ("Hãy bắt đầu bằng cách...") in favor of an invitation ("Bạn muốn bắt đầu từ đâu?").
- **Do not regress toward the old garden-metaphor tone.** `documentation/MimoSe-copy-audit.md` documents the pre-rebrand voice (garden/journal metaphors) — useful as a historical reference for *what not to write now*, not a style to blend in.

Before/after (applied in this round, `coach.*` and `brand.*` i18n keys):

| Context | Before | After |
|---|---|---|
| Coach page title | "Coach" | "Aura" |
| Coach page subtitle | "Một không gian để bạn tự đào sâu suy nghĩ của mình" (clinical, role-first) | "Mình là Aura. Đến với phiên trò chuyện hôm nay, mình sẽ lắng nghe và đặt câu hỏi cùng bạn — không phán xét, không áp đặt lời khuyên — và cùng nhau lưu lại hành trình này." |
| Empty state | "Bắt đầu bằng cách chia sẻ điều đang ở trong đầu bạn lúc này." (imperative) | "Bạn cứ thoải mái bắt đầu — chia sẻ điều đang ở trong đầu bạn lúc này, mình ở đây để lắng nghe." (invitation, first-person presence) |
| Homepage description (`brand.description`) | "...tự động dựng nên bản đồ mối quan hệ và những insight về chính bạn — không phán xét, không áp đặt lời khuyên." | "...tự động dựng nên bản đồ mối quan hệ và những insight về chính bạn." (the "không phán xét, không áp đặt lời khuyên" reassurance moved to the Coach page subtitle above — it describes *how a session feels*, which matters more once someone is actually in one than as a marketing line competing for attention on the homepage) |

Functional micro-copy (`coach.inputPlaceholder`, `coach.send`, `coach.endSession`, `coach.sendError`) is intentionally left alone — it's utilitarian, not identity-bearing, and doesn't need Aura's voice.

## 6. Persistent chat invitation

A floating action button (`src/components/ChatFab/ChatFab.tsx`), fixed to the bottom-right corner, is rendered globally in `MainLayout` so a one-click path into the AI Coach chat is always available, not just on the homepage. It hides itself on the Coach chat route (`APP_ROUTES.COACH_CHAT`), where it would be redundant. On mobile it clears `MobileFooter`'s bottom tab bar via the `--nav-height-mobile` token.

## 7. Relationship map — future direction

Nodes in both the real `RelationshipMap` and the homepage preview are currently plain colored circles (no avatar imagery). A library-driven avatar picker (letting a user choose a face/icon per person) is a planned future enhancement, not built in this round — noted here so it isn't lost.

## 8. Logo — known gap

`public/logo.svg` is the only brand mark in the repo: a single, bloated (277KB) file wrapping an embedded base64 PNG with color-matrix filters, used only as the favicon. There is no wordmark, no light/dark variant, no `/branding` folder. This is a known gap, explicitly **out of scope** for this round (no new logo asset was designed or provided) — flagged here so it isn't forgotten.

## 9. Where these decisions live in code

- Colors: `src/styles/tailwind.css` (`@theme` block).
- Buttons: `src/components/Button/Button.tsx` — the only correct way to render a clickable action.
- Mascot: `src/components/MimoCharacter/MimoCharacter.tsx` (reserved, not currently used) + small inline avatars in `src/components/HomePreviewGrid/ChatPreviewCard.tsx` and `src/pages/CoachChatPage/CoachChatPage.tsx` + shared asset `src/assets/aura/`.
- Homepage: `src/pages/MimoLandingPage/` (compact `GardenHero` + `HomePreviewGrid`).
- Persistent chat CTA: `src/components/ChatFab/ChatFab.tsx`, mounted in `src/layouts/MainLayout/MainLayout.tsx`.
- Coach voice: `src/i18n/locales/{vi,en}.json`, `coach.*` block; nav/breadcrumb/mobile-footer labels now say "AI Coach" rather than "Coach" (`nav.coach`, `breadcrumb.coach`, `mobileFooter.coach`).
