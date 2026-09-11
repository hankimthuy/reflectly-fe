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

/** A color token for a heaviness value (0 = lightest, 1 = heaviest), banded onto the four literal
 * stops of Aura Soft's mood gradient (--gradient-mood: ink → indigo → periwinkle → cyan). Anything
 * that colors a single mood — a day's bar on Today, a message's read on Talk — picks its color
 * here, so a mood always sits at the same point on the same heavy→light travel as the continuous
 * gradient does. */
export const heavinessColorVar = (heaviness: number): string => {
    if (heaviness >= 0.8) return 'var(--color-ink)';
    if (heaviness >= 0.6) return 'var(--color-indigo)';
    if (heaviness >= 0.4) return 'var(--color-periwinkle)';
    if (heaviness >= 0.2) return 'var(--color-periwinkle-light)';
    return 'var(--color-cyan)';
};

/**
 * A small, deliberately unambitious EN+VI keyword lexicon per emotion — the closest thing to a
 * "live read" the Talk mood ribbon can honestly do without a backend sentiment model (see the
 * redesign brief, section 03). Scans a message for a keyword match; several matches in one
 * message resolve to whichever is heaviest. This is a presentation heuristic, not analysis —
 * treat any single read as illustrative, not a diagnosis.
 */
const MOOD_KEYWORDS: Record<Emotion, string[]> = {
    [Emotion.ANXIOUS]: ['anxious', 'anxiety', 'nervous', 'worried', 'scared', 'lo lắng', 'lo âu', 'sợ'],
    [Emotion.ANGRY]: ['angry', 'furious', 'mad', 'pissed', 'giận', 'tức', 'bực'],
    [Emotion.DOWN]: ['sad', 'down', 'depressed', 'hopeless', 'buồn', 'chán nản', 'tuyệt vọng'],
    [Emotion.AWKWARD]: ['awkward', 'embarrassed', 'uncomfortable', 'ngượng', 'xấu hổ'],
    [Emotion.CONFUSED]: ['confused', 'unsure', 'lost', 'bối rối', 'không chắc'],
    [Emotion.BORED]: ['bored', 'nothing happened', 'chán', 'buồn chán'],
    [Emotion.GOOD]: ['good', 'fine', 'okay', 'ổn', 'tốt'],
    [Emotion.BLESSED]: ['grateful', 'thankful', 'blessed', 'biết ơn', 'may mắn'],
    [Emotion.HAPPY]: ['happy', 'glad', 'excited', 'vui', 'hạnh phúc'],
};

/** The heaviest emotion whose keywords appear in `text`, or null if none match. */
export const readMoodFromText = (text: string): Emotion | null => {
    const lower = text.toLowerCase();
    const matches = (Object.keys(MOOD_KEYWORDS) as Emotion[]).filter((emotion) =>
        MOOD_KEYWORDS[emotion].some((word) => lower.includes(word)),
    );
    return heaviestEmotion(matches);
};

export type MoodBucket = 'heavy' | 'charged' | 'settling' | 'easing' | 'light';

export const moodBucket = (heaviness: number): MoodBucket => {
    if (heaviness >= 0.8) return 'heavy';
    if (heaviness >= 0.6) return 'charged';
    if (heaviness >= 0.4) return 'settling';
    if (heaviness >= 0.2) return 'easing';
    return 'light';
};
