# MimoSe — Frontend Client

> **"Leading Self"** — A dual-mode ecosystem for introspection (Innerverse) and action (Outerverse).

This repository contains the **Frontend Client** for MimoSe, built with modern web technologies and designed for smooth, animated transitions between modes.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Framer Motion** | Animations (Bridge transitions) |

---

## Documentation

| Document | Description |
|----------|-------------|
| [PRD Summary](./documentation/00-Product-Context/PRD-Summary.md) | Product context, modes, and Bridge mechanics |
| [Component Tree](./documentation/01-UX-UI-Specs/Component-Tree.md) | View and component hierarchy |
| [Design System](./documentation/01-UX-UI-Specs/Design-System.md) | Colors, typography, and theme tokens |
| [User Flows](./documentation/01-UX-UI-Specs/User-Flows.md) | Navigation paths and user journeys |
| [API Contracts](./documentation/02-Integration/API-Contracts.md) | Backend API endpoints and responses |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
src/
├── components/       # Reusable UI components
├── layouts/          # Innerverse & Outerverse layouts
├── views/            # Page-level components
├── hooks/            # Custom React hooks
├── contexts/         # Theme & mode context providers
├── services/         # API integration layer
└── styles/           # Global styles & theme tokens
```

---

## Related Repositories

- **Backend API** — *(link to backend repo)*

---

## Vite Configuration

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
