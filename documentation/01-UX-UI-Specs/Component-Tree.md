# Component Tree

## Overview

This document outlines the hierarchical structure of views and components in the MimoSe frontend application.

---

## Root Structure

```
App
├── ThemeProvider (Innerverse/Outerverse context)
├── BridgeTransition (framer-motion AnimatePresence)
│
├── Layout
│   ├── InnerverseLayout (Dark theme wrapper)
│   │   ├── Header
│   │   ├── Navigation
│   │   └── ContentArea
│   │
│   └── OuterverseLayout (Light theme wrapper)
│       ├── Header
│       ├── Navigation
│       └── ContentArea
│
└── Views
    ├── Home
    │   ├── InnerHome (Energy/Mood Dashboard)
    │   └── OuterHome (Tasks/Goals Dashboard)
    │
    ├── Journal
    │   ├── InnerJournal (Reflection entries)
    │   └── OuterJournal (Action planning)
    │
    └── Orbit
        ├── InnerOrbit (Self-connections)
        └── OuterOrbit (Social connections)
```

---

## Layout Components

### `InnerverseLayout`
- Dark theme container
- Cool color accents (Blue/Purple)
- Calming visual hierarchy

### `OuterverseLayout`
- Light theme container
- Warm color accents (Orange/Yellow)
- Action-oriented visual hierarchy

---

## View Components

### Home View
| Mode | Component | Purpose |
|------|-----------|---------|
| Inner | `EnergyMeter` | Display current energy level |
| Inner | `MoodTracker` | Log and view mood patterns |
| Outer | `TaskList` | Active tasks and priorities |
| Outer | `GoalProgress` | Goal tracking widgets |

### Journal View
| Mode | Component | Purpose |
|------|-----------|---------|
| Inner | `ReflectionEditor` | Write reflection entries |
| Inner | `InsightCards` | AI-generated insights |
| Outer | `ActionPlanner` | Plan next steps |
| Outer | `CommitmentTracker` | Track commitments |

### Orbit View
| Mode | Component | Purpose |
|------|-----------|---------|
| Inner | `SelfOrbit` | Personal growth areas |
| Outer | `SocialOrbit` | Relationship management |
| Outer | `OrbitMover` | Adjust relationship proximity |

---

## Bridge Transition

The Bridge uses `framer-motion` for smooth mode transitions:

```tsx
// Conceptual implementation
<AnimatePresence mode="wait">
  <motion.div
    key={currentMode}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    {currentMode === 'inner' ? <InnerverseLayout /> : <OuterverseLayout />}
  </motion.div>
</AnimatePresence>
```

### Transition Effects
- **Color morphing** — CSS custom properties animated via `framer-motion`
- **Scale breathing** — Subtle scale animation during crossing
- **Staggered children** — Child components animate in sequence

---

## Shared Components

Components used across both modes:

- `BridgeToggle` — Mode switch button/gesture
- `Avatar` — User profile display
- `Card` — Generic content card (themed)
- `Button` — Themed action button
- `Modal` — Overlay dialogs
- `Toast` — Notification system

---

*Component tree will evolve as features are implemented.*
