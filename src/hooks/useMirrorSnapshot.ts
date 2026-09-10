import { useEffect, useMemo } from 'react';
import { useSavedFrameworkEntriesInfiniteQuery } from '../queries/savedFrameworkEntriesQueryHook';
import type { SavedFrameworkEntry } from '../models/savedFrameworkEntry';

/**
 * The Johari window, now a persistent "Mirror" (see the redesign brief, section 04) instead of
 * a one-off 4-field form. Each JOHARI_WINDOW saved-framework entry keeps the same payload shape
 * it always has (`{ open, blind, hidden, unknown }`, all optional strings) — what changes is how
 * one gets created: "Catch" (see InsightCatcherPanel) now saves one line into exactly one pane at
 * a time, so a fresh entry typically has just one of the four fields filled in. This hook reads
 * that same data back the other way: across every JOHARI_WINDOW entry, whichever field is
 * non-empty counts as one catch into that pane.
 */
export type MirrorPane = 'open' | 'blind' | 'hidden' | 'unknown';
export const MIRROR_PANES: MirrorPane[] = ['open', 'blind', 'hidden', 'unknown'];

export interface MirrorCatch {
    entry: SavedFrameworkEntry;
    pane: MirrorPane;
    text: string;
}

export interface MirrorSnapshot {
    counts: Record<MirrorPane, number>;
    catchesByPane: Record<MirrorPane, MirrorCatch[]>;
    isLoading: boolean;
}

const emptyByPane = <T,>(fill: () => T): Record<MirrorPane, T> => ({
    open: fill(),
    blind: fill(),
    hidden: fill(),
    unknown: fill(),
});

export const useMirrorSnapshot = (): MirrorSnapshot => {
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } = useSavedFrameworkEntriesInfiniteQuery();

    // The list is paginated 10-at-a-time server-side, but the Mirror is a total across every
    // catch a person has ever made — walk every page rather than showing a partial count.
    useEffect(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return useMemo(() => {
        const catchesByPane = emptyByPane<MirrorCatch[]>(() => []);
        const entries = data?.pages.flatMap((page) => page.content) ?? [];

        for (const entry of entries) {
            if (entry.frameworkType !== 'JOHARI_WINDOW') continue;
            for (const pane of MIRROR_PANES) {
                const text = entry.payload?.[pane];
                if (typeof text === 'string' && text.trim()) {
                    catchesByPane[pane].push({ entry, pane, text: text.trim() });
                }
            }
        }

        const counts = emptyByPane<number>(() => 0);
        for (const pane of MIRROR_PANES) counts[pane] = catchesByPane[pane].length;

        return { counts, catchesByPane, isLoading };
    }, [data, isLoading]);
};
