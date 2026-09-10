/** Strips common markdown markup (headers, bold/italic, list bullets, inline code) so
 * AI-generated text (e.g. a session summary) can seed a plain-text UI without literal
 * `**`/`#` noise. */
export const stripMarkdown = (text: string): string =>
    text
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/^[-*]\s+/gm, '')
        .replace(/`(.+?)`/g, '$1')
        .trim();

/** A short, single-line label for a chat session — its summary's first line, stripped of
 * markdown and clamped to a card-sized length, since a Conversation has no title field of its
 * own (see models/conversation.ts). `fallback` covers a session that ended before Aura ever
 * produced a summary. */
export const sessionTitleFromSummary = (summary: string | undefined, fallback: string, maxLength = 64): string => {
    if (!summary) return fallback;
    const firstLine = stripMarkdown(summary).split('\n').find((line) => line.trim().length > 0);
    if (!firstLine) return fallback;
    return firstLine.length > maxLength ? `${firstLine.slice(0, maxLength - 1).trimEnd()}…` : firstLine;
};

/** The first non-empty of `keys` in a saved-framework-entry payload — used to pull a one-line
 * preview out of whichever shape a given FrameworkType's payload happens to be (see
 * models/savedFrameworkEntry.ts). */
export const firstNonEmptyPayloadField = (payload: Record<string, unknown>, keys: string[]): string => {
    for (const key of keys) {
        const value = payload[key];
        if (typeof value === 'string' && value.trim()) return value;
    }
    return '';
};
