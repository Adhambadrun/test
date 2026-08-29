# BREAK — Master Build Prompt
### Definitive Combined Edition · Neo‑Apple Liquid Glass

**Premium Multi-Team Sales-Floor Break Management Web App**
Deployed at **break.vercel.app** · Developer: **Adham Badran**

---

### What changed in this edition

This merges the two prior master-prompt drafts into one authoritative document — same 30-part structure, same RBAC hierarchy, same Firestore schemas and security rules, same business logic (WC limits, warning thresholds, bonus break rules). Nothing functional was cut.

Two things were upgraded:

1. **Part 6 (Visual Design System) is rewritten from scratch.** The old direction was "Cyberpunk 2077 neon." The new direction is **Neo-Apple Liquid Glass** — modeled on Apple's actual current material language (the system that shipped across iOS 26 / iPadOS 26 / macOS Tahoe and has been refined through iOS 27): layered translucent glass, concentric geometry, spring-driven motion, restrained color. Full implementation tokens included — CSS variables, a Tailwind extension, and a base component — not just moodboard language.
2. **Part 23 (Animations) is rewritten** to run on the same motion system as Part 6, with named, reusable spring/easing presets instead of one-off numbers scattered across the doc.

Every other part carries the small terminology updates needed for consistency (glass, not neon panels; spring, not linear ease) plus two small factual additions pulled from the earlier draft: the detailed animation parameters and the mobile swipe-gesture note.

**How to use this document if you are the AI building this app:** read Part 6 in full before writing a single component. It is the aesthetic contract for everything else here — wherever a later part says "glow," "panel," or "flash," resolve it through Part 6's material and motion tokens, not through generic dark-mode defaults.

---

## TABLE OF CONTENTS

1. Project Vision & Philosophy
2. Complete Technology Stack
3. Complete File Structure
4. Organizational Structure & Access Hierarchy
5. Authentication (Google One Tap + Sign-In Button)
6. **Visual Design System — Neo-Apple Liquid Glass**
7. Header (Pixel-Perfect Spec)
8. SNN Live Ticker
9. Circular Agent Pod
10. Hover-to-Select Break Reason Menu
11. Break Start/End Animations (Frame-by-Frame)
12. Warning System
13. WC Punch System
14. Privacy Matrix
15. Core Break Logic
16. Supervisor/Admin Controls
17. Developer God Mode
18. Settings Panel
19. 26 Extra Features (A–Z)
20. Firestore Complete Schemas
21. Firestore Security Rules
22. Storage Rules
23. **Motion & Animation System**
24. Responsive Design
25. Profile Picture Management
26. Deployment (Step-by-Step)
27. Testing Requirements
28. Final Completion Checklist
29. Role-Based Access Control (RBAC) — Definitive Hierarchy
30. Final Directive

---

═══════════════════════════════════════════════════════════
## PART 1: PROJECT VISION & PHILOSOPHY
═══════════════════════════════════════════════════════════

**WHAT THIS APP IS:**
A next-generation break punch-in/punch-out web app for an elite night-shift SALES TEAM (not a call center). Operates 10 PM to 6 AM Egypt time. Manages 4 teams (~40 agents), 4 supervisors (one per team), 2 admins, and 1 developer (Adham). Every break tracked with military precision. Automatic rule enforcement with humor. Agent privacy sacred. Supervisors get full oversight. Developer has god-tier control.

**CORE PHILOSOPHY:**
- Simplicity for agents (one hover + one tap to punch in/out)
- Power for supervisors and admins (sleek control interfaces)
- God-tier control for developer (raw system access)
- Privacy sacred (agents cannot see each other's break details)
- Real-time everywhere (no page refreshes ever)
- 60fps animations always
- Mobile-first responsive
- WCAG 2.1 AA accessible
- Bilingual (English + Arabic RTL)
- Progressive Web App installable
- **Every surface is glass, not paint** — depth and light carry meaning that flat color used to carry alone

**DESIGN INSPIRATION (revised):**
- **Apple's Liquid Glass material system** (iOS 26 / iPadOS 26 / macOS Tahoe, refined through iOS 27) — the primary reference for *how surfaces behave*: translucent, refractive, concentrated on controls rather than content
- **Apple Watch activity rings** — the pod's circular-progress DNA
- **Apple Music / Apple TV dark chrome** — true-black backdrops with color used as a rare, deliberate accent, never wallpaper
- **Apple Card & Wallet** — soft elevation, calm confident tap feedback, restraint
- **F1 pit wall / mission-control dashboards** — the information density for supervisor, admin, and developer telemetry views
- **Discord** — real-time presence energy for messaging, status dots, typing indicators
- **Netflix** — cinematic, spring-driven page and panel transitions

This is deliberately *not* the generic "AI dark mode" template — a flat near-black canvas with a single decorative accent color and hard 1px borders. See Part 6 for what replaces it.

═══════════════════════════════════════════════════════════
## PART 2: COMPLETE TECHNOLOGY STACK (EXACT VERSIONS)
═══════════════════════════════════════════════════════════

**CORE:**
- Next.js 14.2.0+ (App Router, Server Components)
- TypeScript 5.3+ (strict mode)
- React 18.3+

**STYLING:**
- Tailwind CSS 3.4+
- tailwindcss-animate, @tailwindcss/forms, @tailwindcss/typography
- clsx + tailwind-merge
- `figma-squircle` (or equivalent) for true concentric/superellipse corners on hero surfaces — see Part 6.4

**ANIMATIONS:**
- Framer Motion 11+ (all spring/easing presets defined once in Part 6.7 and Part 23, imported everywhere — no ad-hoc transition objects scattered through components)
- Lottie React 2.4+
- React Confetti 6.1+
- react-spring 9.7+ (optional, only if a specific physics need Framer Motion can't cover)

**BACKEND:**
- Firebase 10.7+ (Auth, Firestore, Storage, FCM, Analytics)
- firebase-admin (server-side)
- Google Identity Services (One Tap)

**STATE:**
- React Context (auth)
- Zustand 4.4+ (UI state)
- SWR 2.2+ or TanStack Query 5+ (cache)

**UI:**
- Lucide React 0.300+ (icons — see Part 6.9 for stroke/weight rules)
- Radix UI primitives (@radix-ui/react-dialog, dropdown-menu, popover, tooltip, toast, tabs, switch, slider)
- react-hot-toast or Sonner
- cmdk (command palette)

**DATA VIZ:** Recharts 2.10+
**DATE/TIME:** date-fns 3+ and date-fns-tz 2+
**FORMS:** react-hook-form 7.48+ + zod 3.22+ + @hookform/resolvers
**UPLOADS:** react-dropzone 14.2+ + react-image-crop 11+
**I18N:** next-intl 3+
**UTILITIES:** lodash, nanoid, react-use
**TESTING:** Vitest, @testing-library/react, Playwright
**DEPLOYMENT:** Vercel (break.vercel.app), GitHub Actions (CI/CD)

═══════════════════════════════════════════════════════════
## PART 3: COMPLETE FILE STRUCTURE (ALL PAGES/ROUTES)
═══════════════════════════════════════════════════════════

```
/break-app
├── /app
│   ├── /(auth)
│   │   ├── /login (page.tsx, loading.tsx, error.tsx)
│   │   ├── /unauthorized (page.tsx)
│   │   └── layout.tsx
│   ├── /(main)
│   │   ├── /dashboard (page.tsx, loading.tsx, error.tsx)        ← ALL roles
│   │   ├── /supervisor (page.tsx, /reports, /handover)          ← supervisor, admin, developer
│   │   ├── /admin (page.tsx, /agents, /teams, /warnings,
│   │   │           /analytics, /competitions)                    ← admin, developer
│   │   ├── /developer (page.tsx, /logs, /audit, /system, /rally) ← developer ONLY
│   │   ├── /profile (page.tsx)                                   ← ALL roles (own profile)
│   │   ├── /messages (page.tsx, /[conversationId])               ← ALL roles (own conversations)
│   │   ├── /settings (page.tsx)                                  ← ALL roles (own settings)
│   │   └── layout.tsx
│   ├── /api
│   │   ├── /auth (/session, /verify)
│   │   ├── /breaks (/start, /end, /force-end, /queue)
│   │   ├── /warnings (/issue, /appeal, /dismiss)
│   │   ├── /agents (/create, /update, /remove)
│   │   ├── /reports (/monthly, /export)
│   │   ├── /broadcasts, /notifications
│   │   └── /cron (/auto-warning-check, /monthly-report, /leaderboard-update)
│   ├── layout.tsx, page.tsx, globals.css, manifest.json, not-found.tsx, error.tsx
│   ├── favicon.ico, icon.png, apple-icon.png, og-image.png
├── /components
│   ├── /auth (GoogleAuth, SignInButton, SignOutButton, UnauthorizedScreen, AuthProvider)
│   ├── /pods (PodGrid, AgentPod, PodRadialMenu, AdminRadialMenu, PodTimer, PodProgressRing,
│   │          PodSlotIndicators, PodBadges, PodBreakTypeIcon, PodConfirmationModal,
│   │          PodAnimationLayer, PodGlowEffect)
│   ├── /header (TopHeader, ShiftClock, TeamLogo, CapacityIndicator, TeamBreakTimeIndicator,
│   │            UserProfileDropdown, GodModeIcon, LanguageToggle, NotificationBell,
│   │            ThemeToggle, WeatherWidget)
│   ├── /ticker (SNNTicker, LiveBadge, HeadlineMarquee, HeadlineItem, NewsPanel,
│   │            HeadlineFilter, HeadlineGenerator)
│   ├── /supervisor (SupervisorDashboard, ShiftHandoverEditor, AgentMonthlyReport,
│   │                TeamWellnessOverview, LateEarlyTracker, SupervisorSettings)
│   ├── /admin (AdminDashboard, AgentDetailSidePanel, LiveAgentsTable, BreaksOverTimeChart,
│   │           TopBreakTakers, TeamSelector, WarningLevelsPanel, BroadcastComposer,
│   │           CompetitionManager, AgentRosterManager, TeamCreator, BulkActionsBar,
│   │           InsightsCards, LeaderboardDisplay, ExportDataModal)
│   ├── /developer (GodModePanel, SystemOverview, LiveFirestoreLogs, AuditLogViewer,
│   │               QuickActionsGrid, SystemInfo, DatabaseViewer, FeatureToggles,
│   │               RallyModeControl, MaintenanceModeToggle, BackupRestorePanel,
│   │               PerformanceMetrics, CommandPalette)
│   ├── /modals (WarningModal, BonusBreakModal, ForceEndModal, BlockAgentModal,
│   │            ChangePictureModal, EditAgentModal, RemoveAgentModal, AppealWarningModal,
│   │            ConfirmationModal, EmergencyBroadcastModal, BirthdayCelebrationModal,
│   │            GoalSettingModal, ShiftReplayModal, AddAgentModal, CreateTeamModal,
│   │            UploadTeamLogoModal, CustomWarningTemplateModal, KeyboardShortcutsModal)
│   ├── /messaging (MessagesPanel, ConversationList, ChatWindow, MessageBubble, MessageInput,
│   │               TypingIndicator, EmojiPicker, AttachmentUploader)
│   ├── /notifications (NotificationCenter, NotificationItem, ToastProvider, ToastCustom,
│   │                    PushNotificationHandler)
│   ├── /shared (LoadingSpinner, LoadingSkeleton, ErrorBoundary, ParticleBackground,
│   │            EmbersEffect, **GlassPanel** ← implements the 5-tier Liquid Glass materials
│   │            from Part 6; every panel in the app composes this, nothing hand-rolls
│   │            backdrop-blur inline, NeonBorder → **SpecularEdge** (Part 6.3 highlight),
│   │            AnimatedNumber, OdometerDisplay, ProgressBar, CircularProgress, PulsingDot,
│   │            GradientText, ScreenShake, ConfettiExplosion, LightningEffect, CountdownTimer,
│   │            LiveTimer, UserAvatar, RoleBadge, StatusBadge, TooltipCustom, DropdownCustom,
│   │            Button variants, Input variants, EmptyState, OfflineBanner, MaintenanceScreen,
│   │            SoundManager, **RoleGuard** ← see Part 29)
│   ├── /settings (SettingsLayout, GeneralSettings, BreakRulesConfig, CapacitySettings,
│   │              WarningLevelsConfig, SoundAlertsConfig, UICustomization,
│   │              IntegrationsConfig, LanguagePreferences, ThemePreferences,
│   │              NotificationPreferences, AccessibilityPreferences, PrivacySettings,
│   │              DataManagement)
│   ├── /leaderboards (LeaderboardCard, PodiumDisplay, RankingList, CompetitionScoreboard)
│   ├── /replay (ShiftReplayPlayer, ReplayTimeline, ReplayControls, ReplayAgentRow)
│   └── /animations (BreakStartAnimation, BreakEndAnimation, BonusCelebration, WarningFlash,
│                     ForceEndLasso, RallyModeOverlay, EmergencyOverlay, BirthdayConfetti,
│                     AnniversaryCrown, AchievementUnlock, LevelUpEffect, GoldenSparkle,
│                     VibeAnimations/BeachMode|GameTime|SpaceWalk|FireBreak|VibeMode|
│                     PowerNap|CoffeeRun|GymBreak)
├── /lib
│   ├── /firebase (config, admin, auth, firestore, storage, messaging, analytics)
│   ├── /hooks (useAuth, useUser, useTeam, useBreak, useBreakStart, useBreakEnd,
│   │          useWCTracking, useShiftStatus, useCapacity, useWarnings, useNotifications,
│   │          useMessages, useBroadcasts, useRealtime, useFirestore, useMediaQuery,
│   │          useKeyboardShortcut, useHover, useLocalStorage, useDebounce, useThrottle,
│   │          useInterval, useTimeout, useOnClickOutside, useEscapeKey, useTheme,
│   │          useLanguage, useSound, useConnectionStatus, usePermissions, useAudit,
│   │          useAnalytics, **useReducedTransparency** ← Part 6.12 accessibility fallback)
│   ├── /utils (timezone, formatters, validators, permissions, breakCalculations,
│   │          warningLogic, emailSanitizer, uuid, colorUtils, animationHelpers,
│   │          soundEffects, notificationHelpers, exportHelpers, analyticsHelpers,
│   │          auditLogger, errorHandler, retryLogic, rateLimiter, cacheManager, constants)
│   ├── /stores (authStore, uiStore, modalStore, panelStore, notificationStore, settingsStore)
│   ├── /types (user, team, break, warning, shift, notification, message, broadcast, goal,
│   │          leaderboard, competition, report, audit, firestore, api)
│   ├── /constants (roles, breakTypes, warningLevels, config, colors, **designTokens** ←
│   │              material/radius/shadow tokens from Part 6, animations, sounds,
│   │              shortcuts, icons, funnyHeadlines, breakAnimations)
│   ├── /server (auth, firestore-admin, validations, notifications-send, audit-log)
│   └── /i18n (config, request, navigation)
│   └── **middleware.ts** ← route protection, see Part 29
├── /public
│   ├── /logos (team logos), /sounds (mp3 files), /icons (PWA icons),
│   │   /animations (Lottie JSON), /images
│   ├── manifest.json, robots.txt, sitemap.xml, sw.js
├── /styles (themes.ts, **motion-presets.ts** ← Snap/Glide/Ambient from Part 6.7 & Part 23,
│            **liquid-glass.css** ← material tokens + `.liquid-glass` utility from Part 6.11,
│            rtl.css)
├── /locales (/en, /ar with common, dashboard, breaks, warnings, admin, developer, settings,
│             messages, notifications, errors, funny)
├── /tests (/unit, /integration, /e2e, setup.ts)
├── /scripts (seed-database, generate-icons, build-locales, deploy.sh)
├── firestore.rules, firestore.indexes.json, storage.rules
├── .env.example, .env.local, .gitignore, .eslintrc.json, .prettierrc, .husky/
├── next.config.js, tailwind.config.ts, postcss.config.js, tsconfig.json
├── package.json, vercel.json, vitest.config.ts, playwright.config.ts
├── README.md, CHANGELOG.md, CONTRIBUTING.md, LICENSE, SECURITY.md
```

**ROUTE ↔ ROLE QUICK REFERENCE** (full matrix + middleware code in Part 29):

| Route | Agent | Supervisor | Admin | Developer |
|---|:---:|:---:|:---:|:---:|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ |
| `/supervisor` | ❌ | ✅ (own team) | ✅ | ✅ |
| `/admin` | ❌ | ❌ | ✅ | ✅ |
| `/developer` | ❌ | ❌ | ❌ | ✅ EXCLUSIVE |
| `/profile`, `/messages`, `/settings` | ✅ (own only) | ✅ (own only) | ✅ (own only) | ✅ (own only) |

═══════════════════════════════════════════════════════════
## PART 4: ORGANIZATIONAL STRUCTURE & ACCESS HIERARCHY
═══════════════════════════════════════════════════════════

**CORE RULE:** Access flows **strictly top-down**. Each tier has full control over every tier below it. No tier can view or modify anything above it. This is enforced identically at four layers — UI, routes, API, and Firestore rules — see **Part 29** for the complete enforcement spec.

```
┌─────────────────────────────────────────────────┐
│  TIER 1: DEVELOPER (Adham Badran)                │  ← MAXIMUM ACCESS
│  adhambadraan@gmail.com / adhambadraan@icloud.com │     Controls EVERYTHING — God Mode ⚡
└──────────────────┬────────────────────────────────┘
                    │ controls ↓
┌──────────────────▼────────────────────────────────┐
│  TIER 2: ADMINS (2 people)                         │  ← FULL SYSTEM ACCESS
│  Controls all supervisors, agents, teams           │     Cross-team power
└──────────────────┬────────────────────────────────┘
                    │ controls ↓
┌──────────────────▼────────────────────────────────┐
│  TIER 3: SUPERVISORS (4, one per team)             │  ← TEAM-ONLY ACCESS
│  Controls only their team's agents                 │     Team-isolated
└──────────────────┬────────────────────────────────┘
                    │ controls ↓
┌──────────────────▼────────────────────────────────┐
│  TIER 4: AGENTS (~40 total)                        │  ← LEAST ACCESS
│  Controls only their own breaks + profile           │     Self-only
└─────────────────────────────────────────────────────┘
```

**TIER 1 — DEVELOPER** (God Mode, hardcoded, cannot be removed):
- Adham Badran — `adhambadraan@gmail.com` and `adhambadraan@icloud.com`
- Role: `'developer'`
- Access: EVERYTHING, no exceptions
- Capabilities: All admin capabilities + raw Firestore read/write/delete + system overrides + feature toggles + Rally Mode + emergency broadcasts + backup/restore + maintenance mode + audit log + performance monitoring + cross-team god view + create/remove admins

**TIER 2 — ADMINS** (2 people, managed by Developer only):
- Role: `'admin'`
- Access: All 4 teams, every supervisor, every agent
- Capabilities: Create/delete teams, assign supervisors, add/remove agents anywhere, issue warnings anywhere, grant bonuses, force-end breaks, block/unblock, broadcast to all, cross-team analytics, export data, create competitions
- Cannot: create/remove other admins, access `/developer`, view raw Firestore logs or the audit log, toggle system features, enable Rally Mode, backup/restore the database

**TIER 3 — SUPERVISORS** (4 people, 1 per team):
- Role: `'supervisor'`
- Access: their assigned team only — complete isolation from the other 3 teams
- Capabilities: full team visibility, issue warnings, grant bonuses, force-end, block/unblock, change agent pictures, add/remove team agents, monthly reports, team analytics, message their team, shift handover notes, upload team logo
- Cannot: see other teams' data anywhere, assign/reassign supervisors, modify global shift rules, access admin/developer panels, create competitions

**TIER 4 — AGENTS** (~40 total, ~10 per team):
- Role: `'agent'`
- Access: own data + basic teammate visibility (name/avatar/status only)
- Capabilities: start/end own breaks, change own picture, set preferences, set daily goals, message supervisor/admin/developer, appeal own warnings, view own monthly reports, see teammates' status (no durations)
- Cannot: see teammates' break durations/types/warnings/history, see other teams at all, issue warnings, grant bonuses, force-end anyone's break, access supervisor/admin/developer panels

**TEAMS (4 total):**
- Each: unique `teamId` (UUID), editable name (1–30 chars), uploadable logo (GIF/PNG/JPG, max 5MB), team color from 8 presets (Crimson #FF003C, Cyan #00E5FF, Gold #FFCC00, Purple #8338EC, Green #00FF88, Orange #FF8800, Pink #FF006E, Blue #3A86FF)
- One supervisor per team (unique)
- 5–15 agents per team
- Default language, competition score, active status

**TEAM ISOLATION:**
- Agents in Team A cannot query/view/subscribe to Teams B, C, D
- Firestore rules enforce isolation at the database level (not just hidden in the UI)
- Client queries filtered by `teamId`
- SNN ticker filtered by team for agents/supervisors
- Admins/Developer see a team selector dropdown

═══════════════════════════════════════════════════════════
## PART 5: AUTHENTICATION (GOOGLE ONE TAP + SIGN IN WITH GOOGLE BUTTON)
═══════════════════════════════════════════════════════════

**STRICT REQUIREMENTS:**
- Use REAL Firebase Auth with Google Sign-In ONLY
- Implement BOTH Google One Tap AND the official Sign In with Google button
- Use the official Google Identity Services (GIS) library
- Integrate with Firebase Auth after receiving the Google JWT
- NO demo mode. NO fake login. NO "Auto-Detect Google Profile" text
- Button text MUST be: **"Sign in with Google"**
- Do not restyle Google's own rendered button — only the glass card around it is ours to design

**LOAD GIS SCRIPT** (in `app/layout.tsx`):
```tsx
import Script from "next/script";
<Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" async />
```

**LOGIN PAGE UI (Neo-Apple Liquid Glass treatment):**
- A single **Thick-material** glass card (Part 6.2), centered, floating on the pure-black `--gradient-background` with the particle field drifting slowly beneath it
- Animated STRIKERS team logo GIF (looping, 200px) sitting slightly *above* the card's top edge, as if resting on the glass
- Title: "BREAK" in Orbitron `text-4xl`, gradient crimson→gold `bg-clip-text`
- Subtitle: "Sign in with your work Google account to continue."
- Google button render target: `<div id="google-signin-button" />` — unstyled, official
- Helper text: "Use the Google account signed into this browser profile."
- Error area for: popup blocked, unauthorized email, missing client id, Firebase not configured
- Card entrance: **Glide** spring (Part 6.7) scaling up from 0.96→1 with a fade, not a slide

**CLIENT COMPONENT:** `components/auth/GoogleAuth.tsx`

```tsx
"use client";
import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithCredential, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

declare global {
  interface Window { google: any; handleCredentialResponse: any; }
}

export default function GoogleAuth() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const ok = await isAuthorizedEmail(user.email);
      if (!ok) {
        await signOut(auth);
        setError(`Access Denied: ${user.email} is not authorized.`);
        return;
      }
      router.replace("/dashboard");
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    async function setup() {
      if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        setError("Google Sign-In is not configured.");
        return;
      }
      await waitForGoogle();
      if (cancelled) return;

      const handleCredentialResponse = async (response: { credential: string }) => {
        try {
          setLoading(true);
          setError(null);
          const auth = getAuth();
          const cred = GoogleAuthProvider.credential(response.credential);
          await signInWithCredential(auth, cred);
        } catch (e) {
          setError("Sign-in failed. Please try again.");
        } finally { setLoading(false); }
      };
      window.handleCredentialResponse = handleCredentialResponse;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        auto_select: true,
        cancel_on_tap_outside: false,
        context: "signin",
        ux_mode: "popup",
        itp_support: true,
        use_fedcm_for_prompt: true,
      });

      const el = document.getElementById("google-signin-button");
      if (el) {
        window.google.accounts.id.renderButton(el, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 320,
        });
      }

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Button stays visible as fallback
        }
      });
    }
    setup();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="liquid-glass liquid-glass--thick w-full max-w-md mx-auto p-8 rounded-concentric-xl">
      <h1 className="text-center text-3xl font-bold text-white mb-2 font-orbitron">BREAK</h1>
      <p className="text-center text-sm text-zinc-400 mb-6">
        Sign in with your work Google account to continue.
      </p>
      <div id="google-signin-button" className="flex justify-center min-h-[44px]" />
      {loading && <p className="text-center text-sm text-zinc-300 mt-4">Signing you in…</p>}
      {error && <p className="text-center text-sm text-red-400 mt-4">{error}</p>}
      <p className="text-center text-xs text-zinc-500 mt-6">
        Use the Google account signed into this browser profile.
      </p>
    </div>
  );
}
```

**AUTH FLOW (8 STAGES):**
1. App loads → `onAuthStateChanged` fires
2. If user null → invoke Google One Tap
3. One Tap detects Chrome profile → silent auto-sign-in OR shows One Tap card
4. If One Tap blocked/dismissed → visible "Sign in with Google" button (`renderButton`)
5. User clicks button → popup account chooser → returns credential
6. Handle credential → `GoogleAuthProvider.credential(idToken)` → `signInWithCredential(auth, credential)`
7. Load user context from Firestore `team_members/{sanitizedEmail}`
   - If not found: check hardcoded DEVELOPER emails (`adhambadraan@gmail.com` / `@icloud.com`) → create with role `'developer'`
   - Otherwise: `signOut()` + redirect to `/unauthorized` with "🛑 Access Denied: {email} is not authorized"
8. Redirect based on role (all roles land on `/dashboard`; controls differ by role — see Part 29)

**SIGN OUT FLOW:**
- Click avatar → dropdown → "Sign Out"
- Confirmation modal (Regular-material glass, Part 6.2): "Sign out?"
- On confirm: `auth.signOut()` + `google.accounts.id.disableAutoSelect()` + clear state + redirect `/login`

**PREREQUISITES:**
- Firebase project created
- Google Auth enabled
- Authorized domains: `break.vercel.app`, `localhost`
- OAuth 2.0 Web Client ID with authorized JavaScript origins matching domains
- Env vars: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` + all Firebase config

═══════════════════════════════════════════════════════════
## PART 6: VISUAL DESIGN SYSTEM — NEO-APPLE LIQUID GLASS
═══════════════════════════════════════════════════════════

> Picture a slab of obsidian floating in total black. Every panel, every pod, every button is a pane of the same glass, lit only by four colors — crimson, gold, cyan, and the cool white of the timer digits underneath. Nothing is flat. Nothing is fully opaque except the black behind everything. That's BREAK.

This section is the aesthetic law for the entire build. It replaces the old "neon-drenched cyberpunk" framing with a real material system, borrowed deliberately from Apple's own current design language — the one that shipped across iOS 26 / iPadOS 26 / macOS Tahoe and has continued to be refined through iOS 27 (Apple keeps tuning it: recent releases added a user-facing transparency control after early legibility complaints, and extended the effect so refraction continues under content as it scrolls rather than cutting off at a panel's edge). The STRIKERS brand palette (crimson/gold/cyan/black) does **not** change. What changes is how it's *rendered*: through layered translucency, concentric geometry, and spring motion instead of flat neon fills and linear fades.

**This is deliberately not the generic "AI dark mode" template** — a flat `#111` canvas with one decorative accent and hard 1px borders. If a surface in this app could be recreated with `background: #111` and nothing else, it's wrong. Every panel needs blur, saturation, and a highlight from above, or it isn't glass.

### 6.1 Borrowed rules (non-negotiable)

- **Glass is a functional-layer material, not decoration.** It belongs on controls, bars, and floating panels — the things people touch or that float over content. Actual content — avatars, timer digits, chart data, message text — sits on a solid or near-solid backing underneath, never directly on raw blurred glass, so legibility never depends on what happens to be behind it.
- **Corners are concentric, not arbitrary.** A shape nested inside a rounded container derives its own radius by subtracting the parent's padding from the parent's radius (see 6.4), so curves nest cleanly instead of looking pinched or flared. Circles (pods, avatars, radial-menu buttons) are trivially concentric — leave them alone.
- **Glass reacts to what's behind it.** Its tint shifts subtly with the content it floats over; when content scrolls beneath a sticky bar (the header, the ticker), the blur should visibly continue under the bar rather than cut off hard at its edge.
- **Motion communicates space, not decoration.** Things come from somewhere and go somewhere: the radial menu expands *from* the pod's center, a modal grows *from* the control that opened it, the ticker's News Panel rises *from* the ticker bar itself. Nothing simply fades into existence in place.
- **There's a performance budget.** No more than ~4 simultaneously-blurred layers on screen at once, and no glass-on-glass stacking — a glass panel's own children sit on a solid inner backing, they don't get their own nested `backdrop-filter`.
- **It respects the person's settings.** When `prefers-reduced-transparency` or `prefers-reduced-motion` is set, every glass surface falls back to its solid dark equivalent (see Part 19.W) and every spring collapses to a plain 150ms fade.

### 6.2 Material tokens (five weights, like Apple's own material scale)

| Material | Use for | Blur | Saturate | Background | Border highlight |
|---|---|---|---|---|---|
| **Ultra-Thin** | Tooltips, radial-menu buttons, small popovers | 16px | 160% | `rgba(20,20,24,0.25)` | `rgba(255,255,255,0.10)` |
| **Thin** | Header bar, SNN ticker, nav elements — floats over content that must stay legible through it | 24px | 170% | `rgba(18,18,22,0.45)` | `rgba(255,255,255,0.12)` |
| **Regular** | Cards, agent-detail side panel, pod backgrounds, dropdowns | 34px | 180% | `rgba(16,16,20,0.68)` | `rgba(255,255,255,0.14)` |
| **Thick** | Modals, confirmation dialogs, the warning modal, login card, settings panel | 46px | 190% | `rgba(12,12,15,0.82)` | `rgba(255,255,255,0.16)` |
| **Ultra-Thick** | Full-screen overlays — Rally Mode, Emergency Broadcast, God Mode command deck | 60px | 200% | `rgba(6,6,8,0.92)` | `rgba(255,255,255,0.18)` |

Rule of thumb: the more a surface needs to *block* attention or guarantee legibility (a blocking modal, an emergency overlay), the thicker its material. The more a surface needs to feel *present but secondary* (a tooltip, a radial button), the thinner.

### 6.3 Elevation & lighting model

Every glass surface gets the same three-part treatment, in this order:
1. **Specular highlight** — a 1px inner border, bright (`rgba(255,255,255,0.4)`) at the top edge, fading to transparent by ~30% down the surface — simulating a single light source from directly above. Implemented as a masked gradient border (see 6.11), not a flat `border-top`.
2. **Ambient shadow** — a soft, wide, low-opacity drop shadow beneath (`0 20px 60px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35)`) that implies the panel floats above the black, not sits flush against it.
3. **State glow, not state fill** — when a signal color needs to indicate status (on-break cyan, warning yellow/orange/red, bonus gold), it appears as a soft outer bloom (large blur radius, low opacity, `box-shadow`, never a `background-color`) plus, optionally, a thin 1–2px rim light on the element's own edge. Signal colors never fill a large surface at full saturation — see 6.5.

### 6.4 Corner radius system — concentric, not arbitrary

| Tier | Shape | Radius rule |
|---|---|---|
| Pods, avatars, radial-menu buttons, status dots | Circle | 50% — inherently concentric, never override |
| Small controls (icon buttons, slot dots, chips) | Fixed | 10px |
| Pill buttons, toggles, sliders | Capsule | 50% of the control's own height |
| Cards, side panels (agent detail, settings) | Fixed | 24px |
| Modals, confirmation dialogs | Fixed | 32px |
| Full-bleed overlays (Rally Mode, Emergency, God Mode) | Fixed | 0 on desktop; 32px top corners only as a mobile bottom sheet |
| **Anything nested inside one of the above** | Concentric | `child radius = parent radius − parent padding` |

Worked example: a button inside the 480px agent detail panel (24px radius, 16px padding) gets `24 − 16 = 8px` radius, not a default 6/8/12px picked at random. Apply this formula everywhere instead of eyeballing nested radii — it's the single detail that separates "glassy" from "looks slightly off."

### 6.5 Color system — signal colors as light sources, not paint

**Neutrals** (the black the glass floats on):
```css
--color-black-pure: #000000
--color-black-base: #050505
--color-charcoal: #121212
--color-slate: #1A1A1F
```

**Signal colors** (unchanged hex values — brand identity is not up for debate, only how they're applied):
```css
--color-crimson: #FF003C   /* primary brand, force-end, L3 warning, danger */
--color-gold:    #FFCC00   /* bonus, achievement, developer God Mode */
--color-cyan:    #00E5FF   /* on-break / active state */
--color-green:   #00FF88   /* success, available */
--color-yellow:  #FFD700   /* L1 warning */
--color-orange:  #FF8800   /* L2 warning */
```

**Application rule:** a signal color is always one of — (a) a soft outer glow bloom behind/around an element, (b) a 1–2px rim light on an edge, (c) sparing text/icon tint, or (d) a small badge fill (badges are allowed to be a solid signal color because they're small, discrete, and *meant* to read as a sticker on the glass, not as the glass itself). A signal color is **never** a large flat background fill. This single rule is what keeps four saturated brand colors from reading as "neon soup" once everything else is calm, translucent, and dark.

### 6.6 Typography

| Role | Face | Where | Never for |
|---|---|---|---|
| Display / hero numerals | **Orbitron** | Pod countdown timers, header capacity & break-time numbers, hero dashboard stats, shift countdown | Body copy, button labels, paragraphs |
| Secondary athletic numerals | **Teko** | Mid-weight stat numbers (pod label "45m / 60m", side-panel stat cards) | Anything Orbitron already owns, or body copy |
| UI / body | **Inter** (variable, 400/500/600/700) | Everything else — labels, descriptions, menus, settings | Timers, hero numbers |
| Data / logs | **JetBrains Mono** | God Mode live logs, audit log, terminal-style views | UI chrome |

Set heading tracking to `-0.01em` to `-0.02em` — tighter than Inter's default — so it reads closer to a system-font warmth than a generic web-font default. Type scale: `text-2xs` (10px) through `text-9xl` (128px) on a 4px base spacing unit, unchanged from the original scale.

### 6.7 Motion language

Two spring presets for discrete state changes (something has a start and a settled end), one eased loop for anything continuous. Springs settle; loops don't, so don't force a spring onto a breathing dot or drifting ember — use the loop preset instead.

```ts
// /styles/motion-presets.ts
export const SNAP  = { type: "spring", stiffness: 500, damping: 30, mass: 0.9 }; // ~150–220ms — tap feedback, toggles, badge pops, hover states
export const GLIDE = { type: "spring", stiffness: 300, damping: 28, mass: 1   }; // ~350–450ms — modals, side panels, dropdowns, pod-flip settle
export const AMBIENT_LOOP = {
  repeat: Infinity, repeatType: "mirror", ease: "easeInOut", duration: 2,
}; // status-dot breathing, ember drift, capacity-bar liquid shimmer — never a spring
```

**Documented exception:** the pod's 3D coin-flip (Part 11) keeps its eased cubic-bezier `[0.19, 1, 0.22, 1]` at 800ms rather than a spring — a controlled, no-overshoot settle reads better for a flip than a bounce. A touch of `SNAP`-flavored overshoot is fine for the *bonus-break* flip specifically, since that one is meant to feel celebratory rather than crisp.

**Rule:** no linear easing anywhere, no default `ease-in-out` picked out of habit. Every transition is `SNAP`, `GLIDE`, `AMBIENT_LOOP`, or the one documented flip exception. See Part 23 for the full animation-by-animation mapping.

### 6.8 Sound design

Cues stay short (<150ms), pitched like glass and metal — a soft tap, a light chime — never an arcade "whoosh" or "blast." Default volume low. Map the existing sound list from Part 18 (break start, end chime, bonus celebration, warning alert, rally alarm, message, notification) to this character; the rally alarm is the one deliberate exception allowed to be loud and urgent, since it exists specifically to interrupt.

### 6.9 Iconography

Lucide throughout. 1.5px stroke at 20px+ sizes, 2px stroke below that for legibility. Rounded line caps/joins (Lucide default — keep it). Size scale: 16 / 20 / 24 / 28 / 32 / 40px. Tint with a signal color only to indicate state — never decoratively.

### 6.10 Do's and don'ts

✅ Every panel has blur + saturation + a top highlight + an ambient shadow
✅ Signal colors glow or rim-light; they don't fill
✅ Nested radii are computed (6.4), not guessed
✅ Text sits on a solid backing inside glass panels, never raw blur behind small type
✅ Content visibly continues/refracts under sticky glass bars when scrolled
✅ Motion has a spring or documented exception behind every transition

❌ `background: rgba(0,0,0,0.7)` with no blur and calling it "glass"
❌ A fully-saturated crimson or cyan rectangle as a panel background
❌ Two stacked `backdrop-filter` layers
❌ A hard 1px flat-white border standing in for the specular highlight
❌ `transition: all 0.3s ease` as a catch-all

### 6.11 Implementation: base tokens & utility

```css
/* /styles/liquid-glass.css */
:root {
  --glass-blur-ultrathin: 16px;  --glass-blur-thin: 24px;
  --glass-blur-regular: 34px;    --glass-blur-thick: 46px;
  --glass-blur-ultrathick: 60px; --glass-saturate: 180%;

  --glass-bg-ultrathin: rgba(20,20,24,0.25);
  --glass-bg-thin: rgba(18,18,22,0.45);
  --glass-bg-regular: rgba(16,16,20,0.68);
  --glass-bg-thick: rgba(12,12,15,0.82);
  --glass-bg-ultrathick: rgba(6,6,8,0.92);

  --glass-border-highlight: rgba(255,255,255,0.14);
  --glass-border-highlight-strong: rgba(255,255,255,0.4);
  --glass-shadow-ambient: 0 20px 60px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35);

  --radius-fixed-sm: 10px; --radius-fixed-md: 16px;
  --radius-fixed-lg: 24px; --radius-fixed-xl: 32px;
}

.liquid-glass {
  position: relative;
  background: var(--glass-bg-regular);
  backdrop-filter: blur(var(--glass-blur-regular)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur-regular)) saturate(var(--glass-saturate));
  border-radius: var(--radius-fixed-lg);
  border: 1px solid var(--glass-border-highlight);
  box-shadow: var(--glass-shadow-ambient);
}
.liquid-glass--thin    { background: var(--glass-bg-thin);    backdrop-filter: blur(var(--glass-blur-thin)) saturate(var(--glass-saturate)); }
.liquid-glass--thick   { background: var(--glass-bg-thick);   backdrop-filter: blur(var(--glass-blur-thick)) saturate(var(--glass-saturate)); }
.liquid-glass--ultrathick { background: var(--glass-bg-ultrathick); backdrop-filter: blur(var(--glass-blur-ultrathick)) saturate(var(--glass-saturate)); }

/* specular highlight: masked gradient border, not a flat top border */
.liquid-glass::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(180deg, var(--glass-border-highlight-strong) 0%, transparent 30%, transparent 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
}

@media (prefers-reduced-transparency: reduce) {
  .liquid-glass, .liquid-glass--thin, .liquid-glass--thick, .liquid-glass--ultrathick {
    backdrop-filter: none; -webkit-backdrop-filter: none;
    background: var(--color-charcoal);
  }
}
```

```ts
// tailwind.config.ts (extend)
export default {
  theme: {
    extend: {
      colors: {
        crimson: '#FF003C', gold: '#FFCC00', cyan: '#00E5FF',
        success: '#00FF88', warnL1: '#FFD700', warnL2: '#FF8800',
      },
      backdropBlur: { ultrathin: '16px', thin: '24px', regular: '34px', thick: '46px', ultrathick: '60px' },
      borderRadius: { 'concentric-sm': '10px', 'concentric-md': '16px', 'concentric-lg': '24px', 'concentric-xl': '32px' },
      boxShadow: {
        ambient: '0 20px 60px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35)',
        'glow-crimson': '0 0 32px rgba(255,0,60,0.35)',
        'glow-cyan': '0 0 32px rgba(0,229,255,0.35)',
        'glow-gold': '0 0 32px rgba(255,204,0,0.35)',
      },
    },
  },
};
```

`GlassPanel.tsx` (in `/components/shared`) wraps this utility with a `material` prop (`ultrathin | thin | regular | thick | ultrathick`) and a `glow` prop (`none | cyan | crimson | gold | warnL1 | warnL2`). Every panel in the app — pods, header, ticker, modals, side panels, God Mode deck — composes `GlassPanel`, never hand-rolled `backdrop-blur-xl` classNames. This is what keeps five materials consistent across ~80 components instead of drifting.

### 6.12 Accessibility hook

```ts
// /lib/hooks/useReducedTransparency.ts
export function useReducedTransparency() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-transparency: reduce)');
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);
  return reduced;
}
```
`GlassPanel` reads this (and `useReducedMotion` from Framer Motion) and swaps to the flat CSS fallback in 6.11 automatically — components never need their own reduced-transparency branch.

═══════════════════════════════════════════════════════════
## PART 7: MAIN INTERFACE — HEADER (PIXEL PERFECT)
═══════════════════════════════════════════════════════════

- Height: 80px (desktop), 64px (mobile)
- Position: `sticky top-0`, `z-40`
- Material: **Thin** glass (Part 6.2) — content scrolling beneath must stay visible-but-blurred through it, and the blur should visibly continue as pods scroll under it (the scroll-edge effect from 6.1), not cut off hard
- Border-bottom: replaced by the standard specular highlight (6.3) — no flat colored border
- Padding: `12px 24px`, `flex justify-between items-center`

**LEFT SECTION — Shift Clock (~200px):**
- Clock icon (Lucide) 24px crimson
- Label "SHIFT TIME" Inter 10px uppercase gold
- Time "10:00 PM – 6:00 AM" Orbitron 16px silver
- "EGYPT TIME" Inter 10px uppercase muted

**CENTER-LEFT — Team Branding (~280px):**
- Animated GIF team logo 64px looping
- Team name (dynamic) Orbitron 28px black weight, gradient crimson→gold via `bg-clip-text`

**CENTER — Capacity Indicator (~180px):**
- Users icon 20px cyan
- Label "CAPACITY" 10px uppercase muted
- Value "2/5" Teko 32px bold (current gold, max silver)
- Sublabel "ON BREAK" 10px uppercase muted
- Fill bar 100%×4px: a liquid-fill gradient (green→yellow→red by %) inside a capsule track (6.4)

**CENTER-RIGHT — Team Break Time (~200px):**
- Clock icon 20px gold
- Label "TOTAL BREAK TIME"
- Value "01h 24m" Teko 32px silver
- Sublabel "OF 60m (TEAM)"

**RIGHT — User Profile (~240px):**
- 48×48px avatar, gradient border padding (crimson→gold), sitting on a small Ultra-Thin glass chip
- Green status dot 12px bottom-right, `AMBIENT_LOOP` breathing (Part 6.7)
- "Welcome back," Inter 10px muted
- Name Orbitron 14px semibold silver
- ChevronDown 16px muted (rotates 180° with `SNAP`)
- Dropdown: Regular-material glass, 280px, `GLIDE` entrance from the avatar's position, 8 items (View Profile, Settings, Language, Theme, Notifications, Change Picture, Messages, Keyboard Shortcuts, My Stats, Sign Out)

**RIGHT-MOST — God Mode Icon (48px, developer only, see Part 29 RoleGuard):**
- Zap icon 32px gold, on an Ultra-Thin glass circle
- `AMBIENT_LOOP` pulse (not a hard blink)
- Hover: scale 1.1 via `SNAP`, glow intensifies (gold bloom, not a fill)
- Tooltip: "God Mode Command Center ⚡"

**HEADER RENDERING BY ROLE** (full detail in Part 29):
- **Agent:** Logo + Shift Clock + Capacity + Team Break Time + User Dropdown (basic)
- **Supervisor:** Above + Notification Bell + Handover Notes icon
- **Admin:** Above + Team Selector + Broadcast icon + Admin quick actions
- **Developer:** Above + Gold ⚡ God Mode icon + Role Switcher + Command Palette hint

═══════════════════════════════════════════════════════════
## PART 8: SNN LIVE TICKER (COMPLETE)
═══════════════════════════════════════════════════════════

Container: `sticky top-80px`, `z-45`, height 44px, **Thin**-material glass, specular highlight top+bottom instead of flat red borders

**LEFT BADGE (160px):**
- Crimson gradient bg with clip-path arrow shape (badges are allowed a solid fill — see 6.5)
- Pulsing white dot 10px, `AMBIENT_LOOP`
- "SNN LIVE TICKER" Orbitron 11px bold white uppercase

**CENTER MARQUEE (flex-1):**
- Overflow hidden, continuous right-to-left scroll
- Speed: 30s normal / 20s urgent / paused critical
- `@keyframes marquee`: `0% translateX(100%)` → `100% translateX(-100%)`
- Headlines separated by `" ||| "` in gold
- Each headline: category icon (16px colored) + timestamp + text

**CATEGORY ICONS:**
- ⚡ Break events (cyan) · ⚠️ Warnings (yellow) · 🎁 Bonus (gold) · 👑 Achievements (gold)
- 🚨 Alerts (crimson) · 😂 Fun (white) · 🌡️ Weather (cyan) · 🎂 Birthday (pink)

**PRIORITY STYLES:**
- Normal: default
- Urgent: soft yellow glow bloom behind the text (not a flat highlight fill), faster scroll
- Critical: crimson edge-glow pulse + a restrained 200ms `SNAP` rubber-band shake — a nudge, not a strobe

**RIGHT — "VIEW ALL" button (120px):** gold accent, opens News Panel

**NEWS PANEL (expanded view):**
- **Thick**-material glass, rises from the ticker bar itself (`GLIDE`) to 70vh — it visibly grows from where it was tapped, not from the bottom of the screen
- Filter tabs: All / Breaks / Warnings / Bonuses / Achievements / Fun
- Search bar
- Chronological headline list, load more on scroll

**PRIVACY-AWARE HEADLINES** (enforces Part 14's privacy matrix in ticker copy):

For AGENTS (no durations):
- "SOLOMON started a break"
- "ZAYN is on break"
- "FABIOLA earned a bonus break!"

For SUPERVISORS/ADMINS/DEVELOPER (full details):
- "SOLOMON started break (Regular) — Slot 2/5"
- "ZAYN on break (8m 47s elapsed) — 12m remaining"
- "LEO exceeded WC limit (22m/20m) — auto Level 1 warning"

**FUNNY FILLER (rotate every 15s):**
- "🌯 Local: Shawarma prices in Cairo remain stable"
- "☕ Investigation: Who drank the last coffee? Suspects: everyone"
- "🐈 Cairo stray cat spotted near office. No comment"
- "🧠 Blinking is important. You've been staring at this ticker too long"
- "🕐 It's late. No, you can't go home yet"
- "💡 Fun fact: You're doing better than you think"
- "🔥 Motivation levels remain critically high"
- "🎯 Reminder: The competition is sleeping. You're not"
- "🌙 The moon is out. So is your commission"
- "💎 You are the diamond. Breaks are the polishing"

═══════════════════════════════════════════════════════════
## PART 9: CIRCULAR AGENT POD (EVERY LAYER)
═══════════════════════════════════════════════════════════

**DIMENSIONS:**
- Desktop `lg+`: 180px diameter, container 220×260px
- Tablet `md`: 140px diameter, container 180×220px
- Mobile: 90–110px diameter

**POD LAYERS (z-index bottom to top):**

*Layer 1 — Background disc (Regular-material glass, Part 6.2):*
- SVG radial-gradient center `rgba(20,20,25,0.9)` to `rgba(5,5,5,1)` behind the glass, so the pod reads as a lit disc of glass over black, not a flat circle
- `drop-shadow(0 4px 12px rgba(0,0,0,0.5))` (the standard ambient shadow, 6.3)

*Layer 2 — Progress Ring (outer):*
- SVG circle `stroke-width` 6px, `stroke-linecap` round
- `stroke-dashoffset` animated with `GLIDE` (Part 6.7), 800ms
- Colors by usage: 0–30% green → 30–60% yellow → 60–90% orange → 90–100% red, `AMBIENT_LOOP` pulsing at the red end, always rendered as a soft glow trailing the stroke — not a hard neon line
- `transform rotate(-90deg)` start from top

*Layer 3 — Border Glow (state bloom, per 6.3 — never a fill):*
- Available: faint white glow
- On Break: cyan bloom, `AMBIENT_LOOP`
- Blocked: crimson bloom
- Bonus: gold shimmer
- Warning L1/L2/L3: yellow/orange/crimson bloom

*Layer 4 — Profile Picture OR Timer (center, pod diameter − 40px, on a solid inner backing per 6.1):*
- Available: circular photo, 2px border, cover fit
- On Break: Orbitron digital timer `MM:SS` on a subtle dark scrim (never raw glass behind small type), dynamic color green→yellow→orange→red, with a heartbeat pulse (`SNAP`, one beat) at 13–15min

*Layer 5 — Slot Indicators (inner bottom arc):*
- 5 dots 10px each at angles 200°, 220°, 250°, 280°, 310°
- Unused: transparent with 1.5px white 20% opacity border
- Used: filled gold `#FFCC00` with a small glow (badges may fill, per 6.5)
- Active (current break): `AMBIENT_LOOP` pulsing gold

*Layer 6 — Break Type Icon (top-center when on break):*
- 24px icon (Coffee/Toilet/UtensilsCrossed/Phone/Gift) on an Ultra-Thin glass chip, 32px
- 2px rim light matching the current state's signal color

*Layer 7 — Orbiting Badges (all badges may use a solid signal-color fill — see 6.5):*
- Top-Left "YOU" Badge (own pod only): 40×24px, gradient gold, capsule radius, "YOU" Orbitron 10px bold black, subtle `AMBIENT_LOOP` bounce
- Top-Right Warning Badge (if warning): 32×32px circle, 2px black border, L1 yellow ⚠️ / L2 orange 🔶 / L3 red 🟥, hover tooltip with warning details
- Right-Edge Bonus Badge (if bonus granted): 44×24px gradient green, 🎁 + "+10m" Orbitron 10px bold, `AMBIENT_LOOP` glow
- Top-Center Achievement Badge (temporary): "LEVEL UP!" — flies in with `GLIDE`, floats up + fades over 3s
- Birthday effects (all day on birthday): soft confetti drift around the pod (a shower, not an explosion — see Part 23), 🎂 icon appears

**POD LABEL (below pod, centered):**
- Name Orbitron 16px bold silver uppercase
- Time Teko 20px medium gold "45m / 60m"
- Status Orbitron 10px uppercase (ON BREAK cyan / BLOCKED red / AVAILABLE green)
- Personal motto (hover): Inter 11px italic muted max 50 chars
- Power emoji next to name

**POD INTERACTION BY ROLE** (see Part 29 for the enforcement details):
- Agent hovering OWN pod: break-reason radial menu (5 buttons)
- Agent hovering OTHER pod: name + status only (no menu)
- Supervisor hovering ANY pod in OWN team: admin radial menu (8 buttons)
- Supervisor hovering OTHER team's pod: BLOCKED — pod not even visible
- Admin hovering ANY pod: admin radial menu (8 buttons)
- Developer hovering ANY pod: admin radial menu + "Impersonate" option

═══════════════════════════════════════════════════════════
## PART 10: HOVER-TO-SELECT BREAK REASON MENU
═══════════════════════════════════════════════════════════

**TRIGGER (agent's own pod):**
- `user.email === pod.agentEmail`
- Shift active
- Not on break
- Available slots > 0
- Not blocked
- Not restricted hour (for regular)

**HOVER TIMING:**
- 300ms delay before menu appears
- 500ms delay before menu closes (returns if cursor re-enters)

**RADIAL MENU CONTAINER:**
- Position absolute, radius 100px from pod center, expanding *from* the pod (per 6.1's motion rule)
- Pointer-events on individual buttons only

**BUTTON POSITIONING (5 buttons at 12/2/5/7/10 o'clock, 72° apart):**
Angle calc: `left/top = 50% ± 100px × sin/cos(angle)`

**BUTTONS (56×56px circles, Ultra-Thin glass, Part 6.2):**
- Position 12 (top) — ☕ Regular Break: Coffee icon cyan, "Counts toward your 60-min budget"
- Position 2 — 🚻 WC / Toilet: Toilet icon blue, "20-min daily limit", disabled if WC daily reached
- Position 5 — 🍽️ Meal Break: UtensilsCrossed orange, "Counts toward budget"
- Position 7 — 📞 Personal Call: Phone purple, "Counts toward budget"
- Position 10 — 🎁 Bonus Break (only if granted): Gift gold, "Free 10m, doesn't count!"

**BUTTON ENTRANCE:**
- `SNAP` spring per button, stagger 0.05s between buttons, total ~400–500ms

**CONFIRMATION MODAL (in center of pod):**
- Thick-material glass circle, `GLIDE` scale-up from the pod's own center
- Title "Start [Reason]?" Orbitron 14px
- "Confirm" (glowing per 6.3) / "Cancel" (ghost)

**ADMIN/SUPERVISOR/DEVELOPER RADIAL MENU (8 buttons at 45° apart)** — access gated per Part 29:
- Position 12 — 🛑 FORCE END (crimson)
- Position 1:30 — 🚫 BLOCK/UNBLOCK (crimson/green toggle)
- Position 3 — 🎁 BONUS BREAK (gold)
- Position 4:30 — ⚠️ WARNING (opens modal L1/L2/L3)
- Position 6 — 📷 CHANGE PICTURE (purple)
- Position 7:30 — 📊 VIEW REPORT (cyan)
- Position 9 — ✏️ EDIT AGENT (blue)
- Position 10:30 — 🗑️ REMOVE AGENT (crimson, requires typing name)

═══════════════════════════════════════════════════════════
## PART 11: BREAK START/END ANIMATIONS (FRAME-BY-FRAME)
═══════════════════════════════════════════════════════════

**BREAK START (1200ms total):**
- 0ms: Confirmation modal fades out (150ms, `SNAP`)
- 150ms: Pod starts 3D coin flip (`rotateY 0→180`, 800ms, cubic-bezier `[0.19,1,0.22,1]` — the documented exception from Part 6.7; add a touch of `SNAP` overshoot only if this is the bonus-break flip)
- 250ms: Content swaps (`backface-visibility hidden` trick)
- 950ms: Flip complete, timer visible starting "00:00"
- 950–1200ms: Progress ring starts filling (`GLIDE`), border transitions to cyan bloom, slot dot pulses, break type icon appears
- Parallel: pod `scale 1→1.1→1` breath (`SNAP`), soft cyan particle drift (not a burst — see Part 23), whoosh-free soft chime, toast "Break started!"

**BREAK END (1000ms):**
- 0ms: User clicks timer
- 100ms: Timer enlarges then shrinks (`SNAP`)
- 200ms: Pod 3D reverse flip
- 500ms: Content swaps back
- 800ms: Avatar visible
- 1000ms: "Welcome back!" toast, slot marks used, ring updates
- If efficient (<10min): a light, brief celebration shimmer — restrained, not the full bonus confetti treatment

═══════════════════════════════════════════════════════════
## PART 12: WARNING SYSTEM (COMPLETE)
═══════════════════════════════════════════════════════════

**WARNING TRIGGERS (AUTO):**
- Slot overrun 1–3 min → Auto L1
- Slot overrun 3–5 min → Auto L2
- Total breaks > 60 min → Auto L2
- WC daily > 20 min → Auto L1
- Restricted hour attempts (3+ in shift) → Auto L1
- 3+ L1s in a week → Auto L2 escalation
- 2+ L2s in a week → Auto L3 escalation

**LEVEL 1 — "Gentle Reminder" (Yellow ⚠️ #FFD700):**
- Penalty: NONE (just badge)
- Expires: 3 clean shifts
- Tone: friendly, funny
- Example: "Hey Solomon, you've been warned! 👋 Level 1. Keep it clean 😊"

**LEVEL 2 — "Manager Alert" (Orange 🔶 #FF8800):**
- Penalty: Budget 60→50 min, Max slots →4
- Expires: 5 clean shifts
- Example: "Okay Solomon, Level 2 😠 Budget cut to 50 min, 4 slots. Don't push it to L3."

**LEVEL 3 — "Escalate to Admin" (Red 🟥 #FF003C):**
- Penalty: Budget 40 min, Max slots 4, admins notified
- Expires: 7 clean shifts
- Example: "Solomon. Level 3. 🟥 40 min, 4 slots. Resets after 7 clean shifts. Admins notified."

**MANUAL WARNING MODAL:**
- Thick-material glass, 480px, "Issue Warning to {Agent}"
- 3 large level buttons with penalty previews
- Reason dropdown (presets + custom)
- Custom note textarea (300 chars)
- Preview section
- "Issue Warning" / "Cancel"
- Only supervisor+ can issue (see Part 29 API protection); supervisors restricted to their own team

**APPEAL SYSTEM:**
- Agent receives warning notification with "Appeal" button
- Modal: warning details + textarea (200 chars required)
- Max 2 appeals per shift per agent
- All admins/supervisors notified of appeal
- Approve: warning dismissed + penalties removed + SNN "Justice served!"
- Deny: warning stands + SNN "Appeal denied"

**WARNING EXPIRATION:**
- Daily cron at midnight checks all active warnings
- Counts clean shifts since issuance
- If >= threshold: status→expired, penalties removed, notify agent "Fresh slate! 🎉"

**TONE GUIDELINES:**
- Firm but funny, never corporate
- Use: "oops", "nice try", "the audacity", "we see you", "math is hard"
- Never: "violation", "disciplinary", "HR"

═══════════════════════════════════════════════════════════
## PART 13: WC PUNCH SYSTEM (COMPLETE LOGIC)
═══════════════════════════════════════════════════════════

**RULES:**
- Max 20 min total per calendar day (midnight–midnight Egypt time)
- Does NOT count toward the 60-min regular budget
- Does NOT use regular slots
- Allowed 24/7 during shift (no restricted hours)
- Team capacity 5 still applies
- Unlimited number of visits (only total time capped)

**WC FLOW:**
1. Agent hovers own pod → sees 🚻 option
2. System checks: WC daily < 20m? capacity < 5?
3. If blocked: tooltip explanation, no action
4. Otherwise: confirmation modal → break starts
5. Pod flips to timer with 🚻 icon
6. Agent returns, clicks timer, break ends
7. Duration added to daily WC total
8. If cumulative > 20 min: auto L1 warning + notification

**EDGE CASES:**
- Break crosses midnight: split time between days
- Approaching limit warnings: 15m ("5 min left"), 18m ("2 min left")
- Single WC session can exceed 20 min if daily was 0, but triggers auto-warning

**WC ANALYTICS (supervisor/admin visible):**
- Daily WC time per agent
- Weekly WC trend (bar chart)
- Monthly WC total (line chart)
- Average WC break duration
- WC time distribution heatmap
- Agents likely to exceed (predictive)

═══════════════════════════════════════════════════════════
## PART 14: PRIVACY MATRIX (WHO SEES WHAT)
═══════════════════════════════════════════════════════════

**AGENT viewing OWN data:**
✅ All own break details, timers, slots, warnings, WC time, monthly reports

**AGENT viewing OTHER teammates:**
✅ Names, avatars, status (Available/On Break)
❌ Durations, break types, total time, slots, warnings, bonuses, history

**AGENT viewing OTHER TEAMS:**
❌ Nothing (completely isolated)

**SUPERVISOR (their team only):**
✅ Everything for their team's agents — real-time durations, break types, full warning history, WC details, monthly reports, patterns, late/early tracking
❌ Other teams

**ADMIN (all teams):**
✅ Everything supervisors see, across ALL teams, plus team selector dropdown and cross-team analytics
❌ God Mode / raw Firestore logs

**DEVELOPER (Adham):**
✅ Everything admins see, plus raw Firestore logs, system overrides, audit log, Rally Mode, feature toggles, backup/restore, maintenance mode

═══════════════════════════════════════════════════════════
## PART 15: CORE BREAK LOGIC
═══════════════════════════════════════════════════════════

**SHIFT:** 10 PM – 6 AM Egypt Time (Africa/Cairo), server-synced
- Before shift: countdown "Shift starts in 2h 15m"
- During shift: elapsed + remaining progress bar

**RESTRICTED HOURS (regular breaks only, not WC):**
- No breaks 10–11 PM (first hour)
- No breaks 5–6 AM (last hour)
- Break window: 11 PM – 5 AM (6 hours)

**LIMITS PER AGENT (regular):**
- Max 60 min total per shift
- Max 5 slots
- Max 15 min per slot (auto-end enforced)
- If used 50m in 4 slots, slot 5 auto-caps at 10m

**CAPACITY:** Max 5 agents on break per team (adjustable)

**BONUS BREAK:**
- Admin/supervisor granted, exactly 10 min
- Does NOT count toward 60m, 5 slots, or 20m WC
- Max 1 per agent per shift (developer can override)
- Gold badge appears on pod
- Rule note: "Bonus Break Qualification: Take at least 10 BQ leads and actually work on them. No leads, no snacks. Your admin is watching. 👀🍕"

**SECURITY:**
- Agents can ONLY start/end own breaks
- Firestore rules enforce this (see Part 21 and Part 29)
- Rate limit: 1 break start per 5 seconds

═══════════════════════════════════════════════════════════
## PART 16: SUPERVISOR/ADMIN CONTROLS
═══════════════════════════════════════════════════════════

**AGENT DETAIL SIDE PANEL** (slides right when admin/supervisor clicks a pod):
- 480px width, **Regular**-material glass, backdrop overlay, `GLIDE` entrance from the pod's own position
- Large avatar 120px with glowing border
- Name + role badge + team + online status dot

*Current Session (grid, 6 cards):*
- Total Break Time 45m/60m with progress
- Slots Used (5 dots)
- Warnings 1 (Level 1) with badge
- Bonus Time +10m
- Status On Break cyan
- Break Started 10:42 PM
- (If on break) Current Slot Time 8m 47s live

*WC Tracking:*
- "🚻 WC Time Today" progress bar 12m/20m
- Today's WC list with timestamps
- Weekly total

*Monthly Overview:*
- Total Breaks 145, Average Break Length 8m 20s, Warnings Received 3, Bonus Breaks 5
- Late Arrivals 2, Early Departures 0
- Mini chart: breaks per day
- "View Full Report" button

*Actions Grid (role-gated per Part 29):*
- 🛑 Force End (if on break) · 🚫 Block/Unblock · 🎁 Grant Bonus · ⚠️ Issue Warning
- 📷 Change Picture · ✏️ Edit Details · 📊 View Full Report · 💬 Send Message · 🗑️ Remove from Team

*Recent Activity Timeline:* last 10 events with timestamps

**ADMIN DASHBOARD OVERVIEW (below pod grid):**

*Top Stats Row (5 cards, Regular-material glass):*
- Capacity 2/5 Agents on break (cyan) · Total Break Time 01h 24m (gold)
- Breaks Today 28 ▲12% (green) · Warnings Today 2 ▲50% (yellow) · System Status ONLINE (green)

*Left Nav (256px, Thin-material glass):* Dashboard, Agents, Breaks, Warnings, Reports, Rally Mode, System Logs, Settings

*Live Agents Status Table:*
- Agent | Status | Total Time | Slots | Warnings | Bonus | Actions
- Real-time rows, color-coded, sortable, filterable
- Click row → side panel

*Breaks Over Time Chart* (Recharts line, 300px height): X = shift time, Y = total minutes, gold gradient line, updates every minute

*Top Break Takers:* podium for top 3 (gold/silver/bronze), 4–10 as list rows

═══════════════════════════════════════════════════════════
## PART 17: DEVELOPER GOD MODE (COMMAND CENTER)
═══════════════════════════════════════════════════════════

**Access:** Gold ⚡ icon in header (developer ONLY — see Part 29 `RoleGuard`)

Full-screen **Ultra-Thick**-material overlay — an obsidian glass command deck. Not literal spaceship kitsch: a black backdrop, thick glass panels, gold accents on interactive elements only, and log/terminal panels rendered as solid matte-black JetBrains Mono surfaces (per 6.1's "content never sits on raw glass" rule) so the data stays legible against the chrome around it.

**TABS:**

*Dashboard:*
- System Overview (Capacity, Agents Online, Total Break Time, Uptime %)
- All 4 teams as cards with mini stats
- Real-time Firestore write counter
- Active sessions counter

*Live Logs:*
- Terminal-style, font-mono, matte-black bg, green text — a solid panel, not glass
- Auto-scroll (with pause button)
- Format: `HH:MM:SS event_type agent_email details`
- Examples:
  - `22:31:45 break_started solomon@bcflights.com Regular`
  - `22:31:32 bonus_break_given fabiola@bcflights.com +10m`
  - `22:30:11 warning_issued leo@bcflights.com Level 1`
- Filter by event type, search, export, clear (with confirmation)

*Quick Actions (large crimson buttons):*
- 🔄 RESET ALL BREAKS (double confirmation) · ⚙️ SET CUSTOM CAPACITY
- 🚨 RALLY MODE (blocks all, red overlay 5/10/15 min) · 📢 SEND MOTIVATIONAL BLAST
- 💾 BACKUP DATABASE · 🧹 CLEAR CACHE · 🔧 MAINTENANCE MODE · 📊 EXPORT ALL DATA (JSON)

*Settings:*
- All `shift_config` editable
- Feature toggles for every feature (on/off switches)
- Warning thresholds, break rules, theme customization

The one allowed embellishment here is the gold particle cursor trail (developer only, Part 23) — kept slim, more comet-tail than glitter, so it stays premium rather than novelty.

═══════════════════════════════════════════════════════════
## PART 18: SETTINGS PANEL (COMPLETE)
═══════════════════════════════════════════════════════════

**TABS:**

*General Settings:* app name, default language (EN/AR), default theme, timezone, date/time format

*Break Rules:*
- Shift Start/End Time (dropdowns)
- Max Break Time Per Slot (default 15)
- Max Breaks Per Shift (default 5)
- Max Total Break Time (default 60)
- Max Agents On Break (default 5)
- Max WC Time Per Day (default 20)
- Restricted hours toggles
- Save Changes button

*Warning Levels:* configure L1/L2/L3 — name, color, expiration days, penalties; custom warning templates

*Sound & Alerts:*
- Master toggle
- Individual sounds: break start, end chime, bonus celebration, warning alert, rally alarm, message, notification — tuned to the glassy/soft character in Part 6.8
- Volume slider, upload custom sounds

*UI Customization:*
- Primary/secondary/accent color pickers (signal colors only — see 6.5, no free-form background fills)
- Font size scale (S/M/L/XL)
- Animation speed (Slow/Normal/Fast/Off — scales `SNAP`/`GLIDE` durations, never removes the spring itself)
- Reduce motion mode (ties to `useReducedTransparency`/`prefers-reduced-motion`, Part 6.12), high contrast mode

*Integrations:* Google Calendar sync, Slack/Discord webhooks, email notifications, external API keys

**OTHER QUICK ACTIONS:**
- 📥 Export Data (CSV/JSON/PDF with date range, filters)
- 📋 System Logs
- 👥 Manage Agents (add/edit/bulk import via CSV)
- 💾 Backup Database (manual + scheduled)
- 🏥 System Health (metrics, error rates, response times)
- 🗑️ Clear Cache

*(All settings-panel tabs are gated by role — General/Break Rules/Warning Levels/Integrations require admin+; Sound & UI Customization are per-user and available to all roles. See Part 29.)*

═══════════════════════════════════════════════════════════
## PART 19: 26 EXTRA FEATURES (A–Z) — ALL IMPLEMENTED
═══════════════════════════════════════════════════════════

**A) MULTI-LANGUAGE (i18n):** EN + AR with next-intl, full RTL for Arabic, all UI translatable

**B) SMART PUSH NOTIFICATIONS:** Web Push API + Firebase Cloud Messaging
- Types: break auto-end warning (2m before), bonus granted, warning issued, message received, rally mode, emergency broadcast
- Silent hours setting, sound effects per type

**C) SHIFT HANDOVER NOTES:** Supervisor prompted at shift end, rich text editor, categories (General/Warning/Praise/Alert), timestamped, visible to next supervisor

**D) LATE ARRIVAL & EARLY DEPARTURE:** Detects login >10:15 PM (late), logout <5:45 AM (early), 15-min grace, red/yellow badges, tracked in monthly reports

**E) BREAK REQUEST QUEUE:** When capacity 5/5, agents can "Request Break", FIFO queue, 30-sec countdown notification when slot frees

**F) HEALTH & WELLNESS:** Burnout indicator (no break in 4+ hours), weekly wellness score (0–100), color badge green/yellow/red

**G) LEADERBOARDS (Weekly/Monthly):**
- Cleanest Record (fewest warnings), Team Player (admin-marked), Perfect Attendance, Break Champion (efficient)
- Winners get gold star badge on pod for following period, podium display

**H) SHIFT REPLAY (Time Machine):** Select past shift, timeline visualization, agent rows with break blocks, warning markers, playback controls (Play/Pause/2x/4x)

**I) TEAM COMPETITIONS:** Admin creates competitions (fewest warnings, best attendance, etc.), live leaderboard, trophy badge for winning team

**J) PRIVATE MESSAGING:**
- Chat panel slides in from right
- Contacts based on hierarchy (see Part 29 for who can message whom)
- Text + emoji + image attachments, read receipts, typing indicators, unread badges, real-time via Firestore

**K) EMERGENCY BROADCAST:** Admin/Dev only, full-screen crimson overlay (Ultra-Thick material), required acknowledgment, tracks who acknowledged

**L) BREAK PATTERNS INSIGHTS:** Auto-generated weekly (statistical, not AI) — e.g. "Team B has 30% more warnings than Team A", "Peak break time is 1:30 AM" — displayed as cards in admin dashboard

**M) PROFILE CUSTOMIZATION:** personal motto (50 chars), power emoji (single), pod color theme (5 presets), default break animation

**N) DAILY GOAL TRACKER:** Agent sets goal at shift start, progress bar on pod, update during shift, end-of-shift celebration if 100%

**O) CAIRO WEATHER WIDGET:** Open-Meteo API (no key needed), current temp + 6 AM forecast + sunrise, small widget in header, fun outfit suggestion

**P) BIRTHDAY & ANNIVERSARY:** store birthday/hire date; birthday = soft confetti drift + 🎂 badge all day + team notification; anniversary = gold crown badge + years display

**Q) OFFLINE MODE INDICATOR:** detects Firestore connection, banner "OFFLINE — Actions sync on reconnect", actions queue in IndexedDB, prevents duplicate logs

**R) SESSION RECORDING (AUDIT):** every admin action logged with timestamp, email, IP, user agent; immutable (no updates/deletes); developer only reads; search, filter, export

**S) KEYBOARD SHORTCUTS:**
- `Ctrl+B` Start regular break · `Ctrl+W` Start WC break · `Ctrl+M` Start meal break · `Ctrl+E` End current break
- `Ctrl+D` Open developer panel · `Ctrl+Shift+A` Open admin panel · `Ctrl+/` Show all shortcuts
- `Escape` Close modal · Arrow keys Navigate pods

**T) PROGRESSIVE WEB APP (PWA):** manifest.json, service worker, installable, home screen icon, splash screen, full-screen mode, push notifications

**U) ANALYTICS EXPORT:** formats CSV, PDF (with charts), JSON; custom date range; filter by team/agent/event type; email export directly

**V) DARK/LIGHT MODE:** default dark, toggle in dropdown, smooth 500ms transition, persistent per user. If light mode ships, it gets its own pass on Part 6 — same material tiers, inverted neutrals, same rule that signal colors glow rather than fill

**W) ACCESSIBILITY (WCAG 2.1 AA):** full keyboard nav, ARIA labels, screen reader announcements, high contrast mode (flattens all glass to solid per 6.11/6.12), font size adjustments, `prefers-reduced-motion` and `prefers-reduced-transparency` both respected app-wide, focus indicators, color-blind palettes

**X) TIME-BASED THEMES:** 10 PM–12 AM Twilight (purple accents) · 12 AM–3 AM Deep Night (blue accents) · 3 AM–6 AM Pre-Dawn (orange accents), smooth transitions — the glass tint shifts subtly with each, per 6.1's "glass reacts to what's behind it"

**Y) CUSTOM WARNING TEMPLATES:** admin creates templates (title, default level, reason, note), speeds up issuance

**Z) GDPR DATA RETENTION:** data export request (JSON), deletion request (soft delete + 30-day purge), auto purge after 12 months (configurable), consent tracking, cookie banner

═══════════════════════════════════════════════════════════
## PART 20: FIRESTORE COMPLETE SCHEMAS
═══════════════════════════════════════════════════════════

**Collection: `teams`**
```
{
  teamId: string (UUID),
  teamName: string (1-30 chars),
  teamLogo: string (Storage URL),
  teamColorAccent: string (hex from 8 presets),
  supervisorEmail: string,
  defaultLanguage: 'en' | 'ar',
  agentCount: number,
  competitionScore: number,
  createdAt: Timestamp,
  createdBy: string,
  updatedAt: Timestamp,
  isActive: boolean,
  settings: { customBreakCapacity, customMaxTotalBreakTime, customMaxWCTime }
}
```

**Collection: `team_members`** (Doc ID: sanitized email)
```
{
  name, email, role: 'agent'|'supervisor'|'admin'|'developer', teamId,
  avatarUrl, googleAvatarUrl,
  personalMotto (50 chars), powerEmoji (1 emoji), podColorTheme,
  preferredLanguage, themeMode, notificationsEnabled, soundEnabled,
  reducedMotion, reducedTransparency, fontSize, keyboardShortcutsEnabled, silentHours,
  birthday (MM-DD), hireDate (YYYY-MM-DD), yearsOfService,
  isActive, isOnline, lastSeen,
  createdAt, createdBy, updatedAt, updatedBy,
  totalBreaksTaken, totalBreakTime, totalWarnings, totalBonusReceived,
  currentStreak, longestStreak,
  fcmToken
}
```

**Collection: `shifts/{YYYY-MM-DD}/breaks`**
```
{
  breakId, agentEmail, agentName, teamId,
  breakType: 'regular'|'wc'|'meal'|'personal'|'bonus',
  slotNumber, animationChoice,
  startTime, endTime, duration, scheduledEndTime,
  isActive, isBonus, isAutoEnded, isForcedEnded,
  grantedBy, forcedEndBy,
  createdAt, updatedAt, timeOfDay, dayOfWeek
}
```

**Collection: `shifts/{YYYY-MM-DD}/wc_tracking`** (Doc ID: agent email)
```
{
  agentEmail, agentName, teamId, date,
  totalWCTime (seconds), wcBreakCount, lastWCBreakAt,
  hasReceivedLimitWarning,
  wcBreaks: [{ breakId, startTime, endTime, duration }]
}
```

**Collection: `shift_config`** (Doc: "current")
```
{
  breakCapacity: 5, maxSlots: 5, maxSlotDuration: 15, maxTotalBreakTime: 60, maxWCTime: 20,
  shiftStartHour: 22, shiftEndHour: 6, shiftStartMinute: 0, shiftEndMinute: 0,
  restrictedFirstHour: true, restrictedLastHour: true, restrictedHoursApplyToWC: false,
  masterBreakBlock, blockedAgents: string[],
  maintenanceMode, maintenanceMessage,
  rallyModeActive, rallyModeStartedBy, rallyModeEndsAt, rallyModeMessage,
  featuresEnabled: { bonusBreaks, warnings, ticker, animations, messaging, competitions, goals, weather, birthdays, leaderboards },
  autoWarningThresholds: { slotOverrunL1Min: 1, slotOverrunL1Max: 3, slotOverrunL2Max: 5, l1EscalationCount: 3, l2EscalationCount: 2 },
  lastUpdatedBy, lastUpdatedAt
}
```

**Collection: `warnings`**
```
{
  warningId, agentEmail, agentName, teamId,
  level: 1|2|3, reason, customNote,
  issuedBy, issuedByName, issuedAt, issuedDuringShift,
  expiresAt, cleanShiftsCount, requiredCleanShifts,
  status: 'active'|'dismissed'|'appealed'|'expired',
  appealText, appealSubmittedAt, appealDecision, appealDecisionBy, appealDecisionAt, appealDecisionReason,
  penalties: { maxBreakTime, maxSlots, appliedAt, removedAt },
  createdAt, updatedAt
}
```

**Collection: `snn_headlines`**
```
{
  headlineId, headlineText, category, priority,
  relatedAgent, relatedAgentName, teamId,
  timestamp, expiresAt,
  isPinned, isGodMessage,
  visibility: 'all'|'admin_only'|'supervisor_only'|'team_only',
  createdBy, createdAt
}
```

**Collection: `audit_log`** (immutable)
```
{
  logId, timestamp,
  action, actionCategory,
  performedBy, performedByName, performedByRole,
  targetUser, targetUserName, targetTeamId,
  details: {},
  ipAddress, userAgent, sessionId
}
```

**Collection: `monthly_reports`** (Doc ID: `{agentEmail}_{YYYY-MM}`)
```
{
  reportId, agentEmail, agentName, teamId, month,
  totalBreaks, totalBreakTime, averageBreakLength,
  regularBreaks, wcBreaks, mealBreaks, personalCallBreaks, bonusBreaks,
  totalWCTime, daysWCLimitExceeded,
  warningsReceived: [], warningCount: { l1, l2, l3, total },
  shiftsWorked, lateArrivals, earlyDepartures, perfectAttendanceDays,
  patterns: { mostActiveHour, leastActiveHour, averageStartTime, averageEndTime, peakBreakDay },
  goalsSet, goalsCompleted, goalCompletionRate,
  wellnessScore, disciplineScore, overallGrade,
  generatedAt, generatedBy: 'SYSTEM'
}
```

**Collection: `shift_notes`**
```
{
  noteId, supervisorEmail, supervisorName, teamId,
  noteText, category: 'general'|'warning'|'praise'|'alert'|'handover',
  timestamp, forShiftDate, visibleUntil,
  isPinned, isRead: { supervisorEmail: boolean },
  mentionedAgents: string[],
  createdAt, editedAt
}
```

**Collection: `break_queue`**
```
{
  queueId, agentEmail, agentName, teamId,
  requestedAt, breakType, position, estimatedWaitTime,
  status: 'waiting'|'notified'|'accepted'|'expired'|'cancelled',
  notifiedAt, acceptanceDeadline, respondedAt
}
```

**Collection: `competitions`**
```
{
  competitionId, name, description,
  startDate, endDate,
  metric, customMetricLogic,
  scores: { teamId: number }, currentLeaderTeamId,
  prizeDescription,
  createdBy, createdAt, isActive, isCompleted, winnerTeamId, completedAt
}
```

**Collection: `conversations`**
```
{
  conversationId, participants: string[], participantNames, participantRoles,
  lastMessage, lastMessageAt, lastMessageBy,
  unreadCount: { email: number },
  typingStatus: { email: Timestamp },
  createdAt, isArchived
}
```

**Subcollection: `conversations/{convId}/messages`**
```
{
  messageId, senderEmail, senderName, recipientEmail,
  messageText, attachments: [{ type, url, fileName, fileSize }], emojis: string[],
  timestamp, read, readAt, edited, editedAt, deleted,
  replyToMessageId,
  reactions: { emoji: string[] }
}
```

**Collection: `broadcasts`**
```
{
  broadcastId, messageType, message, richContent,
  target, targetTeamId,
  sentBy, sentByName, sentAt,
  requireAcknowledgment, acknowledgments: { email: Timestamp },
  priority, displayDuration, soundEnabled, fullScreen
}
```

**Collection: `goals`**
```
{
  goalId, agentEmail, agentName, teamId,
  date, goalText, targetValue, currentProgress, unit,
  completed, completedAt, celebrationShown,
  createdAt, updatedAt
}
```

**Collection: `leaderboards`**
```
{
  leaderboardId, period: 'weekly'|'monthly', category,
  startDate, endDate, weekOf,
  rankings: [{ rank, agentEmail, agentName, teamId, score, change }],
  topThree: [{ rank, agentEmail, agentName, score, badgeAwarded }],
  generatedAt, isFinalized
}
```

**Collection: `notifications`**
```
{
  notificationId, recipientEmail,
  type, title, body, icon,
  actionLink, actions: [{ label, action }],
  read, readAt, dismissed, dismissedAt,
  timestamp, expiresAt,
  sentAsPush, pushSentAt
}
```

**Collection: `birthdays_and_anniversaries`**
```
{
  id, agentEmail, type: 'birthday'|'work_anniversary',
  date, yearsCount,
  celebratedThisYear, celebrationDate,
  wantsPublicCelebration
}
```

═══════════════════════════════════════════════════════════
## PART 21: FIRESTORE SECURITY RULES (COMPLETE)
═══════════════════════════════════════════════════════════

These rules are the ground-truth enforcement layer — they must independently reproduce the RBAC hierarchy from Part 4/Part 29, not just trust the UI or API layer.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() { return request.auth != null; }
    function sanitizeEmail(email) { return email.lower().replace('@', '-at-').replace('.', '-'); }
    function getUserDoc() { return get(/databases/$(database)/documents/team_members/$(sanitizeEmail(request.auth.token.email))).data; }
    function getUserRole() { return getUserDoc().role; }
    function getUserTeam() { return getUserDoc().teamId; }
    function isDeveloper() { return isSignedIn() && (request.auth.token.email == 'adhambadraan@gmail.com' || request.auth.token.email == 'adhambadraan@icloud.com'); }
    function isAdmin() { return isSignedIn() && (getUserRole() == 'admin' || isDeveloper()); }
    function isSupervisor() { return isSignedIn() && (getUserRole() == 'supervisor' || isAdmin()); }
    function isOwnEmail(email) { return isSignedIn() && request.auth.token.email == email; }
    function isSameTeam(teamId) { return isSignedIn() && getUserTeam() == teamId; }
    function isSupervisorOfTeam(teamId) { return isSupervisor() && (getUserTeam() == teamId || isAdmin()); }

    match /team_members/{email} {
      allow read: if isSignedIn();
      allow create: if isAdmin();
      allow update: if (isOwnEmail(resource.data.email) && onlyPreferencesChanged()) || (isSupervisor() && isSameTeam(resource.data.teamId)) || isAdmin();
      allow delete: if isDeveloper();
    }

    function onlyPreferencesChanged() {
      let allowedFields = ['personalMotto', 'powerEmoji', 'podColorTheme', 'preferredLanguage', 'themeMode', 'notificationsEnabled', 'soundEnabled', 'reducedMotion', 'reducedTransparency', 'fontSize'];
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(allowedFields);
    }

    match /shifts/{date}/breaks/{breakId} {
      allow read: if isSignedIn() && (isOwnEmail(resource.data.agentEmail) || (isSupervisor() && isSameTeam(resource.data.teamId)) || isAdmin() || isSameTeam(resource.data.teamId));
      allow create: if isSignedIn() && isOwnEmail(request.resource.data.agentEmail) && validBreakCreation();
      allow update: if isSignedIn() && ((isOwnEmail(resource.data.agentEmail) && validBreakEnd()) || (isSupervisor() && isSameTeam(resource.data.teamId)));
      allow delete: if isDeveloper();
    }

    function validBreakCreation() {
      let data = request.resource.data;
      return data.breakType in ['regular', 'wc', 'meal', 'personal', 'bonus'] && data.startTime == request.time && data.isActive == true && data.endTime == null && data.duration == 0;
    }

    function validBreakEnd() {
      return request.resource.data.isActive == false && request.resource.data.endTime != null && request.resource.data.duration > 0;
    }

    match /shifts/{date}/wc_tracking/{docId} {
      allow read: if isSignedIn() && (isOwnEmail(resource.data.agentEmail) || isSupervisor());
      allow write: if isSignedIn() && (isOwnEmail(request.resource.data.agentEmail) || isSupervisor());
    }

    match /shift_config/{doc} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    match /warnings/{warningId} {
      allow read: if isSignedIn() && (isOwnEmail(resource.data.agentEmail) || (isSupervisor() && isSameTeam(resource.data.teamId)));
      allow create: if isSupervisor() && isSameTeam(request.resource.data.teamId);
      allow update: if (isOwnEmail(resource.data.agentEmail) && onlyAppealChanged()) || (isSupervisor() && isSameTeam(resource.data.teamId));
      allow delete: if isAdmin();
    }

    function onlyAppealChanged() {
      let allowedFields = ['appealText', 'appealSubmittedAt', 'status'];
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(allowedFields) && request.resource.data.status == 'appealed';
    }

    match /snn_headlines/{headlineId} {
      allow read: if isSignedIn() && (resource.data.visibility == 'all' || (resource.data.visibility == 'admin_only' && isAdmin()) || (resource.data.visibility == 'supervisor_only' && isSupervisor()) || (resource.data.visibility == 'team_only' && isSameTeam(resource.data.teamId)));
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }

    match /audit_log/{logId} {
      allow read: if isDeveloper();
      allow create: if isSignedIn() && request.resource.data.performedBy == request.auth.token.email;
      allow update, delete: if false;
    }

    match /teams/{teamId} {
      allow read: if isSignedIn();
      allow create, delete: if isAdmin();
      allow update: if isSupervisorOfTeam(teamId);
    }

    match /monthly_reports/{reportId} {
      allow read: if isSignedIn() && (isOwnEmail(resource.data.agentEmail) || (isSupervisor() && isSameTeam(resource.data.teamId)));
      allow write: if false;
    }

    match /shift_notes/{noteId} {
      allow read: if isSupervisor() && isSameTeam(resource.data.teamId);
      allow create: if isSupervisor() && isSameTeam(request.resource.data.teamId);
      allow update, delete: if isSupervisor() && request.auth.token.email == resource.data.supervisorEmail;
    }

    match /break_queue/{queueId} {
      allow read: if isSignedIn() && isSameTeam(resource.data.teamId);
      allow create: if isSignedIn() && isOwnEmail(request.resource.data.agentEmail);
      allow update, delete: if isSignedIn() && (isOwnEmail(resource.data.agentEmail) || isSupervisor());
    }

    match /competitions/{compId} {
      allow read: if isSignedIn();
      allow create, update, delete: if isAdmin();
    }

    match /conversations/{convId} {
      allow read: if isSignedIn() && request.auth.token.email in resource.data.participants;
      allow create: if isSignedIn() && request.auth.token.email in request.resource.data.participants;
      allow update: if isSignedIn() && request.auth.token.email in resource.data.participants;
      allow delete: if false;

      match /messages/{messageId} {
        allow read: if isSignedIn() && request.auth.token.email in get(/databases/$(database)/documents/conversations/$(convId)).data.participants;
        allow create: if isSignedIn() && request.resource.data.senderEmail == request.auth.token.email;
        allow update: if isSignedIn() && resource.data.senderEmail == request.auth.token.email && onlyEditableFields();
        allow delete: if false;
      }
    }

    function onlyEditableFields() {
      let allowedFields = ['messageText', 'edited', 'editedAt', 'reactions'];
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(allowedFields);
    }

    match /broadcasts/{broadcastId} {
      allow read: if isSignedIn();
      allow create: if isAdmin();
      allow update: if isSignedIn() && onlyAcknowledgmentAdded();
      allow delete: if isAdmin();
    }

    function onlyAcknowledgmentAdded() {
      let email = request.auth.token.email;
      return request.resource.data.acknowledgments[email] != null && resource.data.diff(request.resource.data).affectedKeys().hasOnly(['acknowledgments']);
    }

    match /goals/{goalId} {
      allow read: if isSignedIn() && (isOwnEmail(resource.data.agentEmail) || (isSupervisor() && isSameTeam(resource.data.teamId)));
      allow create: if isSignedIn() && isOwnEmail(request.resource.data.agentEmail);
      allow update: if isSignedIn() && (isOwnEmail(resource.data.agentEmail) || isSupervisor());
      allow delete: if isAdmin();
    }

    match /leaderboards/{leaderboardId} {
      allow read: if isSignedIn();
      allow write: if false;
    }

    match /notifications/{notificationId} {
      allow read: if isSignedIn() && isOwnEmail(resource.data.recipientEmail);
      allow create: if isSignedIn();
      allow update: if isSignedIn() && isOwnEmail(resource.data.recipientEmail) && onlyReadStatusChanged();
      allow delete: if isSignedIn() && isOwnEmail(resource.data.recipientEmail);
    }

    function onlyReadStatusChanged() {
      let allowedFields = ['read', 'readAt', 'dismissed', 'dismissedAt'];
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(allowedFields);
    }

    match /birthdays_and_anniversaries/{id} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}
```

═══════════════════════════════════════════════════════════
## PART 22: STORAGE RULES
═══════════════════════════════════════════════════════════

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{email}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (request.auth.token.email == email || isSupervisor() || isAdmin()) && validImageUpload();
    }
    match /team_logos/{teamId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if isSupervisor() && validImageUpload();
    }
    match /sounds/{fileName} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    match /message_attachments/{conversationId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && validAttachmentUpload();
    }
    match /exports/{email}/{fileName} {
      allow read: if request.auth != null && request.auth.token.email == email;
      allow write: if request.auth != null;
    }

    function validImageUpload() { return request.resource.size < 5 * 1024 * 1024 && request.resource.contentType.matches('image/.*'); }
    function validAttachmentUpload() { return request.resource.size < 10 * 1024 * 1024; }
    function isSupervisor() {
      return firestore.get(/databases/(default)/documents/team_members/$(request.auth.token.email.replace('@', '-at-').replace('.', '-'))).data.role in ['supervisor', 'admin', 'developer'];
    }
    function isAdmin() {
      return firestore.get(/databases/(default)/documents/team_members/$(request.auth.token.email.replace('@', '-at-').replace('.', '-'))).data.role in ['admin', 'developer'];
    }
  }
}
```

═══════════════════════════════════════════════════════════
## PART 23: MOTION & ANIMATION SYSTEM
═══════════════════════════════════════════════════════════

Every animation in the app resolves to one of the three presets from Part 6.7 — `SNAP`, `GLIDE`, `AMBIENT_LOOP` — plus the single documented coin-flip exception. This part maps every animation moment in the spec to one of those, with the specific parameters, so no component invents its own one-off transition.

**Pod animations:**
- ☐ Pods stagger in on load: `GLIDE`, `staggerChildren: 0.05`
- ☐ Pod hover (own): radial break menu expands orbital from pod center, `SNAP` per button, 0.05s stagger
- ☐ Pod hover (admin): radial admin menu expands, same as above
- ☐ Pod click: 3D coin flip revealing timer — `rotateY 0→180°`, 800ms, documented bezier exception `[0.19,1,0.22,1]` (Part 6.7)
- ☐ Pod restricted: a single, restrained `SNAP` rubber-band wobble (not a repeated shake) + a brief crimson edge glow — a nudge, not a strobe
- ☐ Break timer: color transitions green→yellow→orange→red over 15min, continuous — `AMBIENT_LOOP` for the heartbeat pulse at 13–15min
- ☐ Progress ring fills: `GLIDE`, SVG `stroke-dashoffset`, 800ms

**Break animations:**
- ☐ Break start: coin flip + soft cyan particle drift (not a burst) + `SNAP` scale breath 1→1.1→1
- ☐ Break end: reverse flip + "Welcome back!" toast (`GLIDE` entrance)
- ☐ 13-min mark: one `SNAP` heartbeat pulse (scale 1→1.15→1), not a repeating strobe
- ☐ Auto-end at 15 min: a firm but single `SNAP` snap-back + brief crimson glow — no harsh flash

**Badge & number animations:**
- ☐ Bonus granted: confetti shower (react-confetti, ~180 pieces, 2.5s, gentle downward drift — a shower, not an explosion) + gold glow ring around the pod
- ☐ Warning issued: pod glows with the warning's signal color for 3 pulses (`AMBIENT_LOOP`-style, 200ms each) — a pulse, not a strobe-flash
- ☐ Force end: `SNAP` pull-back (scale 1→0.85→1) with a small rotation wobble — think a rubber band, not a lasso yank
- ☐ Numbers: odometer flip, each digit rotates independently, `SNAP`, ~250ms per digit

**Overlay animations:**
- ☐ Rally Mode: Ultra-Thick overlay enters with `GLIDE` (scale from center) + restrained lightning-flicker accents at the screen edges, not a full-screen strobe
- ☐ Emergency broadcast: Ultra-Thick crimson overlay, `GLIDE` entrance, single firm `SNAP` shake (not repeated), pulsing border via `AMBIENT_LOOP`
- ☐ Birthday: soft confetti drift around the pod, continuous but sparse, all day

**UI animations:**
- ☐ Toast: `GLIDE` slide-in from top-right with a progress bar that drains linearly (the one place a literal linear animation is correct — it's communicating elapsed time, not motion quality)
- ☐ Modal: backdrop fade (200ms) + content `GLIDE` scale-up from 0.96→1, growing from whatever control opened it
- ☐ Ticker: CSS marquee (linear, by necessity — a constant-speed scroll), urgent = soft glow bloom, critical = single restrained `SNAP` shake, not a repeated strobe
- ☐ Background: floating embers/sparks, `AMBIENT_LOOP`, 20–30 particles desktop / 10 mobile, slow upward drift
- ☐ Sidebar nav hover: icon `SNAP` (rotate ±5°) + glow
- ☐ Loading: shimmer skeleton, `AMBIENT_LOOP` sweep, tinted per Part 6.5 (glow, not neon fill)
- ☐ Custom scrollbar: thin 6px, crimson at low opacity, transparent track
- ☐ Status dots: `AMBIENT_LOOP` breathing (scale + opacity)
- ☐ Capacity bar: liquid-fill shimmer, `AMBIENT_LOOP` during fill, `GLIDE` for the fill-level change itself

**Special animations:**
- ☐ Developer cursor trail (God Mode only): a slim gold particle trail — a comet's tail, not glitter
- ☐ Level up: full-screen achievement reveal, badge `GLIDE`-scales up from 0 with a touch of `SNAP` overshoot, confetti shower, auto-dismiss 3s
- ☐ Weather widget: `AMBIENT_LOOP` matching conditions (rain drops / sun glow / clouds drift)
- ☐ Anniversary: gold crown badge, `GLIDE` sparkle entrance
- ☐ Achievement unlock: badge flies in from bottom-right (`GLIDE`), settles with a light `SNAP` bounce

**Vibe animations (break customization, all `AMBIENT_LOOP`-based):**
- ☐ BeachMode: waves + palm trees · GameTime: retro pixel rain · SpaceWalk: floating stars + nebula
- ☐ FireBreak: rising flame particles · VibeMode: music-note particles · PowerNap: Z letters floating up
- ☐ CoffeeRun: steam rising · GymBreak: dumbbell bounce

*(Frame-by-frame break start/end sequences are specified in Part 11.)*

═══════════════════════════════════════════════════════════
## PART 24: RESPONSIVE DESIGN (BREAKPOINTS)
═══════════════════════════════════════════════════════════

**Breakpoints:**
- `xs`: 0–639px (mobile portrait)
- `sm`: 640–767px (mobile landscape)
- `md`: 768–1023px (tablet)
- `lg`: 1024–1279px (desktop)
- `xl`: 1280–1535px (large desktop)
- `2xl`: 1536px+ (extra large)

**Mobile (xs–sm):**
- Header condensed with hamburger
- Pod grid: 2 columns; Pod: 100px diameter
- Ticker sticky
- Panels: full-screen overlays (Thick material, corners concentric to the device's own screen corners — no arbitrary radius, per 6.4)
- Tap replaces hover (tap-to-reveal menu)
- Swipe gestures for panels (swipe to dismiss side panels and modals)
- Bottom nav bar with icons
- Reduced particle count (10 max)
- Touch targets 44px+

**Tablet (md):**
- Full header width, condensed
- Pod grid: 3–4 columns; Pod: 130–140px diameter
- Panels: 60% width slide-in
- Both tap and hover supported

**Desktop (lg+):**
- Full featured layout
- Pod grid: 5 columns; Pod: 160–180px diameter
- Side panels: 480px
- All hover interactions
- Keyboard shortcuts active

═══════════════════════════════════════════════════════════
## PART 25: PROFILE PICTURE MANAGEMENT
═══════════════════════════════════════════════════════════

**WHO CAN CHANGE:**
✅ Agent themselves (own picture) · ✅ Supervisor (their team's agents) · ✅ Admin (any agent) · ✅ Developer (anyone)
❌ Other agents

**UPLOAD FLOW:**
1. Click "Change Picture" (self dropdown or admin radial menu)
2. Modal opens (Thick material) with drag-drop area or "Browse" button
3. Preview with circular crop tool
4. Confirm upload
5. Firebase Storage upload with progress
6. Firestore write: updates `team_members.avatarUrl`
7. Real-time updates across all clients via `onSnapshot`
8. Toast: "Profile picture updated ✅"

═══════════════════════════════════════════════════════════
## PART 26: DEPLOYMENT (STEP-BY-STEP)
═══════════════════════════════════════════════════════════

**PHASE 1: FIREBASE SETUP**
1. console.firebase.google.com → Create project "break-app-prod"
2. Enable Authentication → Google provider
3. Set project support email
4. Add authorized domains: `break.vercel.app`, `localhost`
5. Create Firestore Database (production mode, europe-west location)
6. Enable Storage (same location)
7. Generate Cloud Messaging VAPID key
8. Get Firebase config from Project settings → General

**PHASE 2: GOOGLE ONE TAP SETUP**
1. console.cloud.google.com → Select Firebase project
2. APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application):
   - Name: "Break App Web"
   - Authorized JavaScript origins: `https://break.vercel.app`, `http://localhost:3000`
   - Authorized redirect URIs: same
4. Copy Client ID

**PHASE 3: LOCAL DEVELOPMENT**
1. Clone repo, `cd break-app`
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. Fill all env vars:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
   NEXT_PUBLIC_FIREBASE_APP_ID=xxx
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=xxx
   NEXT_PUBLIC_FIREBASE_VAPID_KEY=xxx
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx
   FIREBASE_ADMIN_PROJECT_ID=xxx
   FIREBASE_ADMIN_CLIENT_EMAIL=xxx
   FIREBASE_ADMIN_PRIVATE_KEY=xxx
   ```
5. `firebase deploy --only firestore:rules,storage,firestore:indexes`
6. `npm run dev`
7. Open `http://localhost:3000`

**PHASE 4: SEED INITIAL DATA**
1. Sign in as Adham (developer)
2. Open God Mode → Manage Agents
3. Create 4 teams (name, logo, color, supervisor assignment)
4. Add 2 admins
5. Add 4 supervisors (assign to teams)
6. Add ~40 agents (distribute across teams)
7. Upload team logos
8. Configure shift rules
9. Test with different role accounts

**PHASE 5: DEPLOY TO VERCEL**
1. Push to GitHub
2. vercel.com → Import project
3. Configure: Framework Next.js, Build command `npm run build`, Output `.next`
4. Add all environment variables
5. Configure domain: `break.vercel.app`
6. Deploy
7. Update Firebase authorized domains (add production URL)
8. Update Google OAuth origins (add production URL)
9. Test authentication flow end-to-end

**PHASE 6: MONITORING**
1. Set up Vercel Analytics
2. Set up Sentry for error tracking
3. Configure Firebase Alerts (quota, auth errors)
4. Set up automated backups
5. Configure performance monitoring
6. Set up CI/CD via GitHub Actions

═══════════════════════════════════════════════════════════
## PART 27: TESTING REQUIREMENTS
═══════════════════════════════════════════════════════════

**UNIT TESTS (Vitest):**
- All utility functions: 100% coverage
- Business logic: 90%+
- Hooks: 80%+
- Files: `breakCalculations`, `warningLogic`, `permissions`, `formatters`, `validators`, `timezone`, `emailSanitizer`

**INTEGRATION TESTS:**
- Auth flow (One Tap + button)
- Break start/end flow
- Warning issuance and expiration
- Multi-user real-time updates
- WC tracking
- Bonus break granting
- **Role-permission matrix** — every role × every route × every API endpoint (see Part 29)

**E2E TESTS (Playwright):**
- Complete agent journey: login → hover → punch break → end break
- Supervisor issues warning
- Admin grants bonus
- Developer accesses God Mode
- Multi-tab real-time sync
- Mobile responsive
- Accessibility (keyboard nav, screen reader, `prefers-reduced-motion`/`prefers-reduced-transparency` fallbacks)
- **Cross-role access attempts** — verify each blocked action returns 403/redirects to `/unauthorized`

**PERFORMANCE:**
- Initial load < 2s
- Time to interactive < 3s
- Real-time updates < 500ms latency
- All animations 60fps
- No more than ~4 simultaneously-blurred layers on screen at once (Part 6.1 budget) — profile the pod grid + header + ticker + any open modal together
- Lighthouse score 90+

**BROWSER SUPPORT:**
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile Safari iOS 14+, Chrome Android (last 2)

═══════════════════════════════════════════════════════════
## PART 28: FINAL COMPLETION CHECKLIST
═══════════════════════════════════════════════════════════

☐ All files created (see Part 3)
☐ Firebase project set up (Auth, Firestore, Storage, FCM)
☐ Google One Tap configured with OAuth client ID
☐ All environment variables set
☐ Firestore security rules deployed and tested (Part 21)
☐ Storage rules deployed and tested (Part 22)
☐ All indexes created
☐ Initial data seeded (4 teams, users)
☐ Real Google authentication (One Tap + "Sign in with Google" button, NO demo mode)
☐ Auto Chrome profile detection working via One Tap
☐ Multi-team isolation working
☐ Privacy matrix fully enforced (agents can't see others' durations)
☐ WC punch system with 20-min limit + auto-warning
☐ Auto-warning system functional (all 7 triggers)
☐ Manual warning issuance working
☐ Appeal system working
☐ Warning expiration cron job
☐ All 26 features (A–Z) implemented
☐ Hover radial menu (own pod for agents, admin menu for supervisors+)
☐ Break start/end animations smooth (60fps)
☐ SNN ticker scrolling with privacy-aware headlines
☐ God Mode command center with all sections
☐ Multi-language support (EN + AR with RTL)
☐ PWA installable with manifest + service worker
☐ All accessibility features (keyboard, screen reader, high contrast, reduced motion)
☐ Mobile responsive at all breakpoints
☐ Dark mode default, light mode optional
☐ Notifications (in-app toasts + push via FCM)
☐ Message system functional
☐ Broadcast system with acknowledgments
☐ Shift replay feature
☐ Analytics dashboard with Recharts
☐ Export data (CSV, PDF, JSON)
☐ Audit log immutable
☐ 4 teams functional with complete isolation
☐ **RBAC enforced identically at UI + routes + API + Firestore rules (Part 29)**
☐ **`middleware.ts` route matrix matches Part 29 exactly**
☐ **`RoleGuard` wraps every role-gated component**

**Neo-Apple Liquid Glass design QA (Part 6):**
☐ `GlassPanel` is the only source of `backdrop-filter` in the codebase — no inline hand-rolled blur
☐ All five materials (ultrathin/thin/regular/thick/ultrathick) implemented and mapped per 6.2's table
☐ Every glass surface shows the specular highlight + ambient shadow, not just a flat border
☐ Nested corner radii are computed via the concentric formula (6.4), not default Tailwind values
☐ No large surface anywhere is filled with a fully-saturated signal color (6.5 audit)
☐ Every transition traces to `SNAP`, `GLIDE`, `AMBIENT_LOOP`, or the documented flip exception — no stray `ease-in-out`
☐ `prefers-reduced-transparency` and `prefers-reduced-motion` both verified with DevTools emulation, app-wide
☐ Performance budget respected: ≤4 blurred layers on screen simultaneously, verified with the pod grid + header + ticker + a modal open at once

☐ Deploy to Vercel at `break.vercel.app`
☐ Domain configured, SSL certificate active
☐ Monitoring set up (Vercel Analytics + Sentry)
☐ Documentation complete (README, CHANGELOG, CONTRIBUTING)
☐ All tests passing, code linted and formatted
☐ TypeScript strict mode, no errors
☐ Bundle size optimized
☐ Lighthouse score 90+
☐ Ready for production use

═══════════════════════════════════════════════════════════
## PART 29: ROLE-BASED ACCESS CONTROL (RBAC) — DEFINITIVE HIERARCHY
═══════════════════════════════════════════════════════════

*(This is the single source of truth for who can see and do what — Parts 4, 9, 10, 14, 16, and 17 describe the hierarchy conceptually; this part makes it enforceable in code. Every rule below applies at four layers simultaneously — UI, routes, API, and Firestore — so a blocked action is blocked everywhere, not just hidden in a menu.)*

### 29.1 Core Principle
Access flows **strictly top-down**. Each tier has full control over every tier below it. No tier can view or modify anything above it.

```
┌─────────────────────────────────────────────────┐
│  TIER 1: DEVELOPER (Adham Badran)               │  ← MAXIMUM ACCESS
│  adhambadraan@gmail.com                         │     Controls EVERYTHING
│  adhambadraan@icloud.com                        │     God Mode ⚡
└──────────────────┬──────────────────────────────┘
                    │ controls ↓
┌──────────────────▼──────────────────────────────┐
│  TIER 2: ADMINS (2 people)                      │  ← FULL SYSTEM ACCESS
│  Controls all supervisors, agents, teams        │     Cross-team power
└──────────────────┬──────────────────────────────┘
                    │ controls ↓
┌──────────────────▼──────────────────────────────┐
│  TIER 3: SUPERVISORS (4, one per team)          │  ← TEAM-ONLY ACCESS
│  Controls only their team's agents              │     Team-isolated
└──────────────────┬──────────────────────────────┘
                    │ controls ↓
┌──────────────────▼──────────────────────────────┐
│  TIER 4: AGENTS (~40 total)                     │  ← LEAST ACCESS
│  Controls only their own breaks + profile       │     Self-only
└─────────────────────────────────────────────────┘
```

### 29.2 Developer Interface (Tier 1 — Max Access, Adham Badran)

**Hardcoded emails** (cannot be removed, always developer):
- `adhambadraan@gmail.com`
- `adhambadraan@icloud.com`

**UI access:**
✅ `/dashboard` (agent view — can simulate any role) · ✅ `/supervisor` (any team) · ✅ `/admin` (full admin panel)
✅ `/developer` (God Mode command center) — **EXCLUSIVE** · ✅ Gold ⚡ God Mode icon in header — **EXCLUSIVE**
✅ Role Switcher dropdown (view as Agent/Supervisor/Admin for any team) · ✅ Cross-team god view (all 4 teams at once)
✅ Command Palette (`Ctrl+K`) with system commands — **EXCLUSIVE**

**Capabilities (everything):**
All admin capabilities, plus: raw Firestore read/write/delete on ANY collection · system overrides (bypass all rules) · feature toggles (enable/disable any feature globally) · Rally Mode (blocks all breaks with red overlay) · emergency broadcasts (full-screen red overlay to all) · backup/restore database · maintenance mode toggle · live Firestore logs (terminal-style) · immutable audit log viewer · performance monitoring · create/delete/modify ADMINS (only developer can) · impersonate any user · force-clear cache · modify `shift_config` directly · override ANY warning, ban, penalty · reset all breaks system-wide · export ALL data as JSON

**Cannot be blocked from:** any page, panel, action, data, or feature — the developer bypasses all Firestore rules via the Admin SDK.

### 29.3 Admin Interface (Tier 2 — 2 people, Full System Access, No God Mode)

**UI access:**
✅ `/dashboard` (agent-style view of any team via selector) · ✅ `/supervisor` (any of 4 teams via team selector)
✅ `/admin` (full admin dashboard) — **PRIMARY INTERFACE** · ❌ `/developer` (God Mode) — BLOCKED
❌ Gold ⚡ icon — HIDDEN · ✅ Team selector dropdown (switch between 4 teams) · ✅ Cross-team analytics dashboard

**Capabilities:**
Create/delete/modify TEAMS · assign/unassign SUPERVISORS to teams · add/remove/edit AGENTS in any team · issue warnings (L1/L2/L3) to any agent · grant bonus breaks to any agent · force-end any break · block/unblock any agent · change any agent's profile picture · broadcast to specific team OR all teams · emergency broadcast (with dev) · view all monthly reports across all teams · cross-team analytics + insights · export data (CSV/PDF/JSON) for any team · create/manage competitions · create custom warning templates · modify shift rules (via Settings panel) · view live agents table across all teams · approve/deny warning appeals · send messages to any user · configure team logos + colors · set team-specific capacity overrides

**Cannot:** create or delete other ADMINS (developer-only) · access `/developer` · view raw Firestore logs or the audit log · toggle system features · enable Rally Mode (developer-only) · backup/restore database · access God Mode command center · modify feature flags · bypass Firestore rules

### 29.4 Supervisor Interface (Tier 3 — 4 people, 1 per team, Team-Only Access)

**UI access:**
✅ `/dashboard` (view of their team only) · ✅ `/supervisor` (their team dashboard) — **PRIMARY INTERFACE**
❌ `/admin` — BLOCKED · ❌ `/developer` — BLOCKED · ❌ Gold ⚡ icon — HIDDEN
❌ Team selector — HIDDEN (locked to own team) · ❌ Cross-team analytics — BLOCKED

**Capabilities (their team ONLY):**
Full visibility of their team's agents (real-time) · see all break details, durations, break types, WC time · issue warnings (L1/L2/L3) to their team's agents · grant bonus breaks to their team's agents · force-end their team's agents' breaks · block/unblock their team's agents · change their team's agents' profile pictures · add/remove agents from their team · upload/change their team's logo + color · edit their team's name · monthly reports for their team's agents · team analytics + insights (team-scoped) · late/early arrival tracking (their team) · wellness overview (their team) · message their team's agents + admins + developer · shift handover notes (for next supervisor) · approve/deny warning appeals (their team) · view break patterns (their team) · export data for their team only

**Cannot:** see other teams' agents, breaks, warnings, or data · assign/reassign supervisors (admin+ only) · modify global `shift_config` rules · access other teams' data anywhere · broadcast to other teams · create competitions (admin+ only) · access admin/developer panels · view system logs or the audit log · enable Rally Mode or maintenance mode · add/remove admins or other supervisors

### 29.5 Agent Interface (Tier 4 — ~40 people, Least Access, Self-Only)

**UI access:**
✅ `/dashboard` (their team's pod grid with privacy) — **ONLY INTERFACE** · ✅ `/profile` (their own profile)
✅ `/messages` (chat with supervisor/admin/developer) · ✅ `/settings` (their own preferences only)
❌ `/supervisor` — BLOCKED · ❌ `/admin` — BLOCKED · ❌ `/developer` — BLOCKED
❌ Gold ⚡ icon — HIDDEN · ❌ Team selector — HIDDEN

**Capabilities (self-only):**
Start/end their OWN breaks (regular/WC/meal/personal/bonus) · hover their OWN pod → radial break menu · change their OWN profile picture · set their OWN preferences (motto, emoji, pod color, theme, language) · set their OWN daily goal · update their OWN goal progress · appeal their OWN warnings (max 2 per shift) · view their OWN monthly reports · view their OWN WC daily tracking · view their OWN warning history · see teammates' NAMES + AVATARS + STATUS only (Available/On Break) · send messages to supervisor/admin/developer · acknowledge broadcasts · set silent hours + notification preferences · request break when capacity full (queue) · install as PWA

**Cannot (privacy enforced):** see teammates' break durations, break types, total break time, slots used, warnings, bonus breaks, WC time, monthly reports, or history · see OTHER TEAMS at all (complete isolation) · change other agents' pictures or data · issue warnings to anyone · grant bonus breaks · force-end any break · block/unblock anyone · access supervisor/admin/developer panels · modify shift rules · see raw system data · add/remove team members · change team logo or color

### 29.6 Route Protection Matrix (`middleware.ts`)

```
/dashboard          → ALL roles (agent, supervisor, admin, developer)
/supervisor         → supervisor, admin, developer ONLY
/supervisor/*       → supervisor (own team), admin, developer
/admin              → admin, developer ONLY
/admin/*            → admin, developer ONLY
/admin/agents       → admin, developer (view all teams)
/admin/teams        → admin, developer (CRUD teams)
/admin/warnings     → admin, developer (all warnings)
/admin/analytics    → admin, developer (cross-team)
/admin/competitions → admin, developer
/developer          → developer ONLY (exclusive)
/developer/*        → developer ONLY
/developer/logs     → developer ONLY (raw Firestore logs)
/developer/audit    → developer ONLY (audit trail)
/developer/system   → developer ONLY (system controls)
/developer/rally    → developer ONLY (rally mode)
/profile            → ALL roles (own profile only)
/messages           → ALL roles (own conversations)
/settings           → ALL roles (own settings only)
```

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROUTE_PERMISSIONS = {
  '/developer': ['developer'],
  '/admin': ['admin', 'developer'],
  '/supervisor': ['supervisor', 'admin', 'developer'],
  '/dashboard': ['agent', 'supervisor', 'admin', 'developer'],
  '/profile': ['agent', 'supervisor', 'admin', 'developer'],
  '/messages': ['agent', 'supervisor', 'admin', 'developer'],
  '/settings': ['agent', 'supervisor', 'admin', 'developer'],
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const sessionCookie = req.cookies.get('__session')?.value;

  if (!sessionCookie && !path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Verify session + role via API route
  const userRole = await getUserRoleFromSession(sessionCookie);

  for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (path.startsWith(route) && !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/supervisor/:path*', '/admin/:path*', '/developer/:path*', '/profile/:path*', '/messages/:path*', '/settings/:path*'],
};
```

### 29.7 Conditional UI Rendering (React Components)

Every component that shows a privileged action MUST check role before rendering — never rely on the route guard alone, since components can be reused across pages.

```tsx
// components/shared/RoleGuard.tsx
import { useAuth } from '@/lib/hooks/useAuth';

type Role = 'agent' | 'supervisor' | 'admin' | 'developer';

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null
}: {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) return <>{fallback}</>;
  return <>{children}</>;
}

// Usage everywhere:
<RoleGuard allowedRoles={['developer']}>
  <GodModeIcon />
</RoleGuard>

<RoleGuard allowedRoles={['supervisor', 'admin', 'developer']}>
  <AdminRadialMenu agentEmail={pod.email} />
</RoleGuard>

<RoleGuard allowedRoles={['admin', 'developer']}>
  <TeamSelector />
</RoleGuard>
```

**Header rendering rules** (expands Part 7):
- Agent: Logo + Shift Clock + Capacity + Team Break Time + User Dropdown (basic)
- Supervisor: Above + Notification Bell + Handover Notes icon
- Admin: Above + Team Selector + Broadcast icon + Admin quick actions
- Developer: Above + Gold ⚡ God Mode icon + Role Switcher + Command Palette hint

**Pod interaction rules** (expands Part 9):
- Agent hovering OWN pod: break-reason radial menu (5 buttons)
- Agent hovering OTHER pod: name + status only (no menu)
- Supervisor hovering ANY pod in OWN team: admin radial menu (8 buttons)
- Supervisor hovering OTHER team's pod: BLOCKED (can't see it)
- Admin hovering ANY pod: admin radial menu (8 buttons)
- Developer hovering ANY pod: admin radial menu + "Impersonate" option

### 29.8 API Route Protection

Every `/api/*` route MUST verify role server-side — client-side checks are UX only, never security.

```typescript
// app/api/warnings/issue/route.ts
import { verifyIdToken } from '@/lib/firebase/admin';
import { getUserRole, getUserTeam } from '@/lib/server/auth';

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = await verifyIdToken(token);
  const role = await getUserRole(decoded.email);
  const userTeam = await getUserTeam(decoded.email);

  // Only supervisor+ can issue warnings
  if (!['supervisor', 'admin', 'developer'].includes(role)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { agentEmail, level, reason } = await req.json();
  const targetAgent = await getUserByEmail(agentEmail);

  // Supervisors can only warn their own team
  if (role === 'supervisor' && targetAgent.teamId !== userTeam) {
    return Response.json({ error: 'Cross-team action forbidden' }, { status: 403 });
  }

  // Proceed with warning issuance...
}
```

**Critical API routes + required roles:**
```
POST /api/breaks/start          → agent (own only), supervisor+ (their team)
POST /api/breaks/end            → agent (own only), supervisor+ (their team)
POST /api/breaks/force-end      → supervisor+ (their team), admin+, developer
POST /api/warnings/issue        → supervisor (own team), admin, developer
POST /api/warnings/dismiss      → supervisor (own team), admin, developer
POST /api/warnings/appeal       → agent (own warning only)
POST /api/agents/create         → supervisor (own team), admin, developer
POST /api/agents/remove         → supervisor (own team), admin, developer
POST /api/agents/update         → agent (own preferences), supervisor+ (their team)
POST /api/teams/create          → admin, developer
POST /api/teams/delete          → admin, developer
POST /api/broadcasts/send       → admin (any team), developer (system-wide)
POST /api/broadcasts/emergency  → admin, developer
POST /api/system/rally-mode     → developer ONLY
POST /api/system/maintenance    → developer ONLY
POST /api/system/backup         → developer ONLY
GET  /api/audit/log             → developer ONLY
GET  /api/system/logs           → developer ONLY
POST /api/admins/create         → developer ONLY
POST /api/admins/remove         → developer ONLY
```

### 29.9 Firestore Rules Enforcement

Part 21's rules already implement this hierarchy directly — this is the summary:
- `isDeveloper()` → hardcoded email check
- `isAdmin()` → role check OR `isDeveloper()`
- `isSupervisor()` → role check OR `isAdmin()`
- `isSameTeam(teamId)` → team scope check
- `isOwnEmail(email)` → self-only check

Pattern: **developer can do everything; admins can do everything supervisors can plus team management; supervisors can act on their team only; agents can act on themselves only.** If a UI, route, or API change ever needs a new capability, add it to Part 21's rules and this part together — never one without the other.

### 29.10 Role Assignment & Management

**Who can create/modify roles:**
- Developer: can create/remove ANY role (admin, supervisor, agent)
- Admin: can create supervisors + agents; can promote agent → supervisor
- Admin CANNOT: create/remove admins, promote to admin, or remove the developer
- Supervisor: can add agents to their team only
- Supervisor CANNOT: promote agents to any role
- Agent: cannot manage any roles

**Role change flow:**
1. Developer opens God Mode → "Manage Roles"
2. Sees list of all users with role dropdowns
3. Changes role → confirmation modal
4. Firestore write updates `team_members.role`
5. Real-time listener updates the user's session
6. User's UI re-renders with new permissions
7. Audit log entry created (who changed, when, what)

**Promotion examples:**
- Agent → Supervisor (admin+): assign to team, update role
- Supervisor → Admin (developer only): remove from team, grant cross-team access
- Admin → Developer: **BLOCKED** (hardcoded, cannot be granted)

### 29.11 Audit Log (Every Privileged Action Tracked)

Every action by supervisor+ is logged in the `audit_log` collection:
- Action type (`warning_issued`, `break_forced_end`, `agent_removed`, etc.)
- Performed by (email + role)
- Target user
- Timestamp
- IP address + user agent
- Full details JSON

Only the developer can read the audit log. It is immutable — no updates, no deletes, ever (see Part 21's `allow update, delete: if false;`).

### 29.12 Developer-Exclusive Features (Never Accessible to Others)

God Mode Command Center (`/developer`) · Gold ⚡ header icon · live Firestore logs terminal · audit log viewer · raw database viewer · feature toggle switches · Rally Mode activation · maintenance mode toggle · backup/restore controls · command palette (`Ctrl+K` system commands) · impersonate user · role switcher (view as any role) · cross-team god view · bypass all rules via Admin SDK · create/remove admins · reset all breaks system-wide · force cache clear · performance metrics dashboard · system info panel · emergency shutdown

### 29.13 Unauthorized Access Handling

If a user attempts to access a forbidden route or action:

**Client side:**
- Middleware redirects to `/unauthorized`
- Shows: "🛑 Access Denied" — "You don't have permission to access this area."
- Shows current role + required role
- "Return to Dashboard" button
- Logs the attempt to Firestore (`audit_log`)

**Server side:**
- API returns `403 Forbidden`
- Response includes: `{ error: 'Forbidden', requiredRole: 'admin', currentRole: 'supervisor' }`
- Toast notification: "Insufficient permissions"
- Logs the attempt to `audit_log`

**Firestore:**
- Rules reject the write → `PermissionDenied` error
- Client catches it → shows toast
- No data leak — rules block reads too, so a denied user never even receives the payload

═══════════════════════════════════════════════════════════
## PART 30: FINAL DIRECTIVE
═══════════════════════════════════════════════════════════

Build this masterpiece EXACTLY as specified. Every file. Every animation. Every rule. Every pixel. Every edge case. Every privacy check. Every access rule.

**The material is glass, not paint.** Five weights of it — ultra-thin, thin, regular, thick, ultra-thick — each with a specular highlight from above and an ambient shadow below, floating over true black. Every corner is concentric to its parent. Every signal color — crimson, gold, cyan, warning yellow, warning orange — glows or rim-lights; none of them ever fills a surface flat. If you can screenshot a panel and it looks like `#111` with a border, it's wrong. Go back and add the blur, the saturation, the highlight.

**The motion is spring, not linear.** `SNAP` for anything tactile, `GLIDE` for anything that opens or arrives, `AMBIENT_LOOP` for anything that breathes or drifts. One documented exception: the pod's coin-flip keeps its eased curve. Nothing else gets a stray `ease-in-out`.

**The hover-to-select break reason menu is the primary agent interaction** — hover own pod, click break type, confirm, done. It should feel like tapping a button on a physical piece of glass: immediate, tactile, satisfying.

**The access hierarchy is non-negotiable and enforced at every layer (Part 29):**
- **Agents** — least access, self-only: their own breaks and profile, nothing more.
- **Supervisors** — control only their own team's agents; zero visibility into other teams.
- **Admins** — control all supervisors and agents across all 4 teams, but never get God Mode.
- **Developer (Adham Badran, `adhambadraan@gmail.com`)** — has access to everything, system-wide, with no exceptions.

Warnings are firm but funny (never corporate).
WC is separate (20-min daily, auto-warning if exceeded).
Bonus breaks require the "10 BQ leads worked" rule.

The label everywhere on the login page is **"Sign in with Google"** — never "Auto-Detect" or anything else. Real Firebase Auth via Google One Tap + official Sign In with Google button. Real Firestore with real-time listeners everywhere. Real Storage for pictures and logos. Real Cloud Messaging for push notifications. No demo mode, no fake data, no placeholders, no TODOs.

Match the STRIKERS brand: pitch black, crimson red (#FF003C), electric gold (#FFCC00), cyan (#00E5FF) for active states — rendered as light through glass, the way Part 6 specifies, not as flat neon fills.

Every screen makes people say "DAMN, that's clean." Not "that's a lot of neon" — **that's clean.** That's the difference between the old direction and this one.

This is **break.vercel.app**. Ship it now. Complete. Production-ready. No excuses. Make Adham Badran proud.

**END OF MASTER PROMPT — PARTS 1 THROUGH 30.**
