# User Flows

## Overview

This document describes the primary navigation paths and user journeys within the MimoSe application.

---

## Entry Points

### App Launch
```
Launch → Splash Screen → Check Auth
                              ├── Not Authenticated → Login/Register
                              └── Authenticated → Restore Last Mode → Home
```

### Deep Links
- `/inner/home` → Innerverse Home
- `/outer/home` → Outerverse Home
- `/inner/journal` → Innerverse Journal
- `/outer/orbit` → Outerverse Orbit

---

## Core Navigation

### Main Navigation Structure
```
[Bridge Toggle]
     │
     ├── INNERVERSE
     │   ├── Home (Energy/Mood)
     │   ├── Journal (Reflections)
     │   └── Orbit (Self)
     │
     └── OUTERVERSE
         ├── Home (Tasks/Goals)
         ├── Journal (Actions)
         └── Orbit (Social)
```

---

## Key User Flows

### Flow 1: Mode Transition (The Bridge)

```
User in Innerverse → Tap Bridge Toggle
                          │
                          ▼
                    Bridge Animation
                    (framer-motion)
                          │
                          ▼
                    Outerverse Loads
                    (same view, different mode)
```

**Notes:**
- Transition preserves current view context
- If user is on Inner/Home → transitions to Outer/Home
- Animation duration: 700ms

---

### Flow 2: Reflection to Action

```
Innerverse Journal → Write Reflection
                          │
                          ▼
                    "Ready to Act?" prompt
                          │
                    ┌─────┴─────┐
                    │           │
                    ▼           ▼
               Stay Inner   Cross Bridge
                    │           │
                    ▼           ▼
              Continue      Outerverse Journal
              Reflecting    (Create Action Item)
```

---

### Flow 3: Energy Check-in

```
App Launch → Innerverse Home
                  │
                  ▼
           Energy Check-in Modal
           "How's your energy?"
                  │
                  ▼
           Log Energy Level (1-10)
                  │
                  ▼
           Dashboard Updates
           AI Insights Generate
```

---

### Flow 4: Social Orbit Management

```
Outerverse Orbit → View Social Connections
                        │
                        ▼
                  Select Contact
                        │
                        ▼
                  "Move in Orbit"
                  (closer/further)
                        │
                        ▼
                  API: POST /social-orbit/move
                        │
                        ▼
                  Orbit Visualization Updates
```

---

## Authentication Flows

### Login
```
Login Screen → Enter Credentials → Validate
                                       │
                                 ┌─────┴─────┐
                                 │           │
                              Success      Error
                                 │           │
                                 ▼           ▼
                            Fetch User   Show Error
                            Preferences  Message
                                 │
                                 ▼
                            Navigate to
                            Last Mode/Home
```

### Registration
```
Register Screen → Enter Details → Validate
                                      │
                                      ▼
                               Create Account
                                      │
                                      ▼
                               Onboarding Flow
                               (Choose Initial Mode)
                                      │
                                      ▼
                               Navigate to Home
```

---

## Error States

| Scenario | User Flow |
|----------|-----------|
| Network Error | Show retry option with cached data |
| Auth Expired | Redirect to login, preserve intended destination |
| API Error | Show error toast, log for debugging |
| 404 View | Redirect to current mode's Home |

---

## Accessibility Considerations

- All flows support keyboard navigation
- Screen reader announcements for mode transitions
- Reduced motion option disables Bridge animation
- Focus management during modal flows

---

*User flows will be refined based on user testing feedback.*
