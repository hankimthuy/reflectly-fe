export interface User {
    id: string;
    email: string;
    pictureUrl: string;
    fullName: string;
    hasPassword?: boolean;
    coreValues?: string[];
    onboardingCompleted?: boolean;
}

/** One day of GET /users/mood-summary — `hasData` distinguishes "logged as neutral" from
 * "nothing logged that day" even though both can carry a null score/emotion. */
export interface MoodSummaryDay {
    date: string;
    score: number | null;
    emotion: string | null;
    hasData: boolean;
}

export interface MoodSummary {
    days: MoodSummaryDay[];
}

/** GET /users/stats — backend-authoritative version of what statsUtil.ts used to compute
 * client-side from entries alone (streak, top emotion, emotion distribution). */
export interface UserStats {
    currentStreakDays: number;
    mostFrequentEmotion: string | null;
    mostFrequentEmotionCount: number | null;
    talksCount: number;
    entriesCount: number;
    emotionsWindowDays: number;
    emotionDistribution: { emotion: string; count: number }[];
}
