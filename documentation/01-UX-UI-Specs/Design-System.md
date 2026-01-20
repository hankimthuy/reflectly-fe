# Design System

## Overview

MimoSe uses a dual-theme design system that reflects the two modes of the application: **Innerverse** (reflection) and **Outerverse** (action).

---

## Theme Strategy

### 🌙 Innerverse Theme (Dark / Cool)

The Innerverse uses dark, cool colors to create a calming, introspective atmosphere.

#### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--inner-bg-primary` | `#0D1117` | Main background |
| `--inner-bg-secondary` | `#161B22` | Card/surface background |
| `--inner-bg-tertiary` | `#21262D` | Elevated surfaces |
| `--inner-accent-primary` | `#7C3AED` | Primary purple accent |
| `--inner-accent-secondary` | `#3B82F6` | Secondary blue accent |
| `--inner-text-primary` | `#E6EDF3` | Primary text |
| `--inner-text-secondary` | `#8B949E` | Secondary text |
| `--inner-text-muted` | `#6E7681` | Muted/disabled text |
| `--inner-border` | `#30363D` | Borders and dividers |

#### Accent Gradients
```css
--inner-gradient-primary: linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%);
--inner-gradient-glow: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
```

---

### ☀️ Outerverse Theme (Light / Warm)

The Outerverse uses light, warm colors to create an energizing, action-oriented atmosphere.

#### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--outer-bg-primary` | `#FFFBF5` | Main background |
| `--outer-bg-secondary` | `#FFF7ED` | Card/surface background |
| `--outer-bg-tertiary` | `#FFEDD5` | Elevated surfaces |
| `--outer-accent-primary` | `#F97316` | Primary orange accent |
| `--outer-accent-secondary` | `#EAB308` | Secondary yellow accent |
| `--outer-text-primary` | `#1C1917` | Primary text |
| `--outer-text-secondary` | `#57534E` | Secondary text |
| `--outer-text-muted` | `#A8A29E` | Muted/disabled text |
| `--outer-border` | `#E7E5E4` | Borders and dividers |

#### Accent Gradients
```css
--outer-gradient-primary: linear-gradient(135deg, #F97316 0%, #EAB308 100%);
--outer-gradient-glow: radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%);
```

---

## Typography

### Font Stack

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Cal Sans', 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-xs` | 12px | 400 | 1.5 | Captions, labels |
| `--text-sm` | 14px | 400 | 1.5 | Secondary text |
| `--text-base` | 16px | 400 | 1.6 | Body text |
| `--text-lg` | 18px | 500 | 1.5 | Emphasized body |
| `--text-xl` | 20px | 600 | 1.4 | Section headers |
| `--text-2xl` | 24px | 600 | 1.3 | Page titles |
| `--text-3xl` | 30px | 700 | 1.2 | Hero text |
| `--text-4xl` | 36px | 700 | 1.1 | Display text |

---

## Spacing

Based on 4px grid system:

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Modals |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

### Innerverse Shadows (Subtle glow)
```css
--inner-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--inner-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--inner-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--inner-shadow-glow: 0 0 20px rgba(124, 58, 237, 0.3);
```

### Outerverse Shadows (Soft diffused)
```css
--outer-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--outer-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--outer-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--outer-shadow-glow: 0 0 20px rgba(249, 115, 22, 0.15);
```

---

## Motion

All animations use `framer-motion` with these timing defaults:

| Token | Duration | Easing |
|-------|----------|--------|
| `--duration-fast` | 150ms | ease-out |
| `--duration-normal` | 300ms | ease-in-out |
| `--duration-slow` | 500ms | ease-in-out |
| `--duration-bridge` | 700ms | cubic-bezier(0.4, 0, 0.2, 1) |

---

## Component Tokens

### Buttons

| State | Innerverse | Outerverse |
|-------|------------|------------|
| Primary BG | `--inner-accent-primary` | `--outer-accent-primary` |
| Primary Text | `#FFFFFF` | `#FFFFFF` |
| Hover | 10% lighter | 10% darker |
| Disabled | 50% opacity | 50% opacity |

### Cards

| Property | Innerverse | Outerverse |
|----------|------------|------------|
| Background | `--inner-bg-secondary` | `--outer-bg-secondary` |
| Border | `--inner-border` | `--outer-border` |
| Shadow | `--inner-shadow-md` | `--outer-shadow-md` |

---

*Design tokens should be implemented as CSS custom properties for runtime theme switching.*
