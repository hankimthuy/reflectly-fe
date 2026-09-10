import { Emotion } from '../models/emotion';

/**
 * Where each emotion sits on the "heavy → light" read the redesign uses for the mood ribbon
 * (Talk) and the seven-day strip (Today) — see the redesign brief, section 03. Not from the
 * backend (there is no such scale there); a presentation-only ordering so the same emotion
 * always reads at the same weight everywhere it shows up.
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

/** The heaviest (most charged) emotion in a list — what a day's bar or a message's read should
 * be colored by when more than one emotion applies. */
export const heaviestEmotion = (emotions: Emotion[]): Emotion | null => {
    if (emotions.length === 0) return null;
    return emotions.reduce((heaviest, emotion) =>
        EMOTION_HEAVINESS[emotion] > EMOTION_HEAVINESS[heaviest] ? emotion : heaviest,
    );
};

/** A Modernist color token for a heaviness value (0 = lightest, 1 = heaviest) — the accent ramp
 * for the charged end, the neutral ramp settling toward the ground as it lightens. */
export const heavinessColorVar = (heaviness: number): string => {
    if (heaviness >= 0.8) return 'var(--color-accent-600)';
    if (heaviness >= 0.6) return 'var(--color-accent-400)';
    if (heaviness >= 0.4) return 'var(--color-neutral-400)';
    if (heaviness >= 0.2) return 'var(--color-neutral-500)';
    return 'var(--color-neutral-600)';
};
