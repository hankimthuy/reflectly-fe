import { useMemo } from 'react';
import type { ConversationMessage } from '../models/conversation';
import { EMOTION_HEAVINESS, readMoodFromText } from '../utils/moodUtil';

export interface LiveMoodRead {
    /** 0 (lightest) – 1 (heaviest). Settles back toward 0.5 as a conversation goes on without a
     * fresh keyword match, rather than freezing at the last thing that landed. */
    heaviness: number;
    /** The emotion detected at the very start of the session, if any — "opened at anxious". */
    openedAt: string | null;
}

const NEUTRAL = 0.5;

/**
 * Drives the Talk mood ribbon from the user's own messages — see moodUtil.ts for what "reading"
 * means here (a small keyword scan, not real sentiment analysis). Each new user message with a
 * keyword match nudges the read toward that emotion's weight; a message with no match lets it
 * drift back toward neutral, so the ribbon still feels alive between hits instead of going stale.
 * Recomputed fresh from `messages` every time (no ref) — the full history is already there, so
 * "opened at" is just whichever match comes first in it.
 */
export const useLiveMoodRead = (messages: ConversationMessage[]): LiveMoodRead => {
    return useMemo(() => {
        let heaviness = NEUTRAL;
        let openedAt: string | null = null;
        for (const message of messages) {
            if (message.role !== 'USER') continue;
            const emotion = readMoodFromText(message.content);
            if (emotion) {
                if (!openedAt) openedAt = emotion;
                heaviness = heaviness * 0.3 + EMOTION_HEAVINESS[emotion] * 0.7;
            } else {
                heaviness = heaviness * 0.7 + NEUTRAL * 0.3;
            }
        }
        return { heaviness, openedAt };
    }, [messages]);
};
