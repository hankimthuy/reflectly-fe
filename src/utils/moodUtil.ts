import { Emotion } from '../models/emotion';

/**
 * Where each emotion sits on the "heavy → light" read the redesign uses for the seven-day strip
 * (Today) — see the redesign brief, section 03. Not from the backend (there is no such scale
 * there); a presentation-only ordering so the same emotion always reads at the same weight
 * everywhere it shows up.
 */
export const EMOTION_HEAVINESS: Record<Emotion, number> = {
    [Emotion.ANXIOUS]: 0.95,
    [Emotion.ANGRY]: 0.9,
    [Emotion.DOWN]: 0.85,
    [Emotion.AWKWARD]: 0.6,
    [Emotion.CONFUSED]: 0.55,
    [Emotion.BORED]: 0.45,
    [Emotion.GOOD]: 0.25,
    [Emotion.BLESSED]: 0.15,
    [Emotion.HAPPY]: 0.1,
};

/** A color token for a heaviness value (0 = lightest, 1 = heaviest), banded onto the four literal
 * stops of Aura Soft's mood gradient (--gradient-mood: ink → indigo → periwinkle → cyan) — so a
 * day's bar on Today always sits at the same point on the same heavy→light travel as the
 * continuous gradient does. */
export const heavinessColorVar = (heaviness: number): string => {
    if (heaviness >= 0.8) return 'var(--color-ink)';
    if (heaviness >= 0.6) return 'var(--color-indigo)';
    if (heaviness >= 0.4) return 'var(--color-periwinkle)';
    if (heaviness >= 0.2) return 'var(--color-periwinkle-light)';
    return 'var(--color-cyan)';
};

