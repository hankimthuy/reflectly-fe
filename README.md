# Reflectly / MimoSe Frontend

> **"Leading Self"** — React SPA for personal journaling (Innerverse / Outerverse).

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI |
| TypeScript | 5.9 | Type safety |
| Vite | 7 | Dev server & build |
| MUI | 7 | Components |
| TanStack React Query | 5 | Server state |
| axios | 1.12 | HTTP client |
| @react-oauth/google | 0.12 | Google auth code flow |
| Vitest | 4 | Unit tests |
| Sass | — | Styling |

## Project Structure

```
src/
├── routes/           AppRoutes, ProtectedRoute
├── pages/            Login, Entries, Profile, marketing pages
├── providers/        AuthProvider, ThemeContext, SnackbarProvider
├── services/         axios + API calls (source of truth for endpoints)
├── queries/          React Query hooks
├── components/       Shared UI
├── layouts/          MainLayout, MimoHeader, MobileFooter
├── constants/        Routes, storage keys
├── i18n/             EN / VI locales
└── styles/           SCSS variables & mixins
```

## Local Setup

### Prerequisites

- Node.js >= 20
- Backend running at `http://localhost:8080`
- Google OAuth Web client ID (same as backend)

### 1. Install & configure

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 2. Run

```bash
npm run dev      # http://localhost:5173
npm test         # Vitest
npm run build    # production build
```

## Auth Flow

1. **Google:** `@react-oauth/google` with `flow: 'auth-code'` → `POST /api/auth/google`
2. **Credentials:** username/password → `POST /api/auth/login` or `/signup`
3. Backend JWT stored in `localStorage` key `auth_token`
4. axios interceptor attaches `Authorization: Bearer <token>`
5. 401 → clear token, redirect to `/login`

Key files: [`AuthProvider.tsx`](./src/providers/AuthProvider.tsx), [`authService.ts`](./src/services/authService.ts), [`axiosSetup.ts`](./src/services/axiosSetup.ts).

## Routes

| Path | Auth | Page |
|------|------|------|
| `/login`, `/signup` | Public | Auth |
| `/`, `/innerverse`, `/outerverse`, `/mimo-method` | Public | Marketing |
| `/home`, `/entries/*`, `/profile`, `/statistics`, `/quotes` | Protected | App |

## Branches & Deployment

| Branch | Deploy target | Workflow |
|--------|---------------|----------|
| `develop` | AWS EC2 `/var/www/mimose/client/` | `aws-deploy-frontend.yml` |
| `main` | Azure Static Web Apps | `azure-static-web-apps-*.yml` |

**Release flow:** develop → test → PR to `main` → Azure production deploy.

### GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `VITE_API_URL` | Backend API URL (e.g. `https://<be-host>/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `FE_HEALTH_URL` | Optional frontend URL for post-deploy smoke check |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_*` | Azure SWA deploy |
| `EC2_*` | AWS staging deploy |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 5173) |
| `npm run build` | Typecheck + production build |
| `npm run build:dev` | Build with `.env.dev` |
| `npm run build:prod` | Build with `.env.prod` |
| `npm test` | Run Vitest |
| `npm run lint` | ESLint |

## Documentation

| Document | Notes |
|----------|-------|
| [API Contracts](./documentation/02-Integration/API-Contracts.md) | **Outdated** — use `src/services/` instead |
| [Component Tree](./documentation/01-UX-UI-Specs/Component-Tree.md) | UX reference |
| [Design System](./documentation/01-UX-UI-Specs/Design-System.md) | Theme tokens |

## Related Repository

- Backend: [reflectly-be](https://github.com/hankimthuy/reflectly-be)
