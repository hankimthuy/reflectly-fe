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
