import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEntriesInfiniteQuery } from '../../../queries/entriesQueryHook';
import { useSavedFrameworkEntriesInfiniteQuery, useDeleteSavedFrameworkEntryMutation } from '../../../queries/savedFrameworkEntriesQueryHook';
import type { Entry } from '../../../models/entry';
import type { FrameworkType } from '../../../models/savedFrameworkEntry';
import { APP_ROUTES } from '../../../constants/route';
import { EMOTION_DATA, type Emotion } from '../../../models/emotion';
import Loading from '../../../components/Loading/Loading';
import { firstNonEmptyPayloadField } from '../../../utils/textUtil';

const NOTE_SNIPPET_FIELDS: Record<FrameworkType, string[]> = {
    FREEFORM: ['content'],
    JOHARI_WINDOW: ['open', 'hidden', 'blind', 'unknown'],
    ACT_MATRIX: ['values', 'towardMoves', 'awayMoves', 'fiveSenses'],
    PERSONAL_SWOT: ['strengths', 'weaknesses', 'opportunities', 'threats'],
    LIFE_POSITIONS: ['notes'],
};

const NOTE_TYPE_LABEL_KEY: Record<FrameworkType, string> = {
    FREEFORM: 'talk.note',
    JOHARI_WINDOW: 'insightCatcher.johariWindowLabel',
    ACT_MATRIX: 'insightCatcher.actMatrix',
    PERSONAL_SWOT: 'insightCatcher.personalSwot',
    LIFE_POSITIONS: 'insightCatcher.lifePositions',
};

type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';
const FILTER_KEYS: TimeFilter[] = ['all', 'today', 'week', 'month', 'year'];

const filterByTime = (entries: Entry[], filter: TimeFilter): Entry[] => {
    if (filter === 'all') return entries;
    const now = new Date();
    const start = new Date();
    switch (filter) {
        case 'today': start.setHours(0, 0, 0, 0); break;
        case 'week': start.setDate(now.getDate() - now.getDay()); start.setHours(0, 0, 0, 0); break;
        case 'month': start.setDate(1); start.setHours(0, 0, 0, 0); break;
        case 'year': start.setMonth(0, 1); start.setHours(0, 0, 0, 0); break;
    }
    return entries.filter((e) => new Date(e.createdAt) >= start);
};

const filterBySearch = (entries: Entry[], query: string): Entry[] => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) => e.title.toLowerCase().includes(q) || e.reflection?.toLowerCase().includes(q));
};

/** Written entries + the "Notes" caught mid-conversation (FREEFORM saved-framework entries) — the
 * two ways something ends up here, one list. Johari catches live on the Mirror tab instead. */
const JournalTab = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<TimeFilter>('all');
    const [search, setSearch] = useState('');

    const entriesQuery = useEntriesInfiniteQuery();
    const notesQuery = useSavedFrameworkEntriesInfiniteQuery();
    const deleteNote = useDeleteSavedFrameworkEntryMutation();

    const entries = useMemo(() => entriesQuery.data?.pages.flatMap((p) => p.content) ?? [], [entriesQuery.data]);
    // Johari catches live entirely on the Mirror tab (see useMirrorSnapshot) — everything else
    // caught via "Catch" (or, before this redesign, the old framework picker) shows up here.
    const notes = useMemo(
        () => (notesQuery.data?.pages.flatMap((p) => p.content) ?? []).filter((e) => e.frameworkType !== 'JOHARI_WINDOW'),
        [notesQuery.data],
    );

    const filtered = useMemo(() => filterBySearch(filterByTime(entries, filter), search), [entries, filter, search]);

    if (entriesQuery.isLoading) return <Loading message={t('dashboard.loading') as string} fullHeight />;

    return (
        <div className="reflect-journal">
            <div className="reflect-journal__toolbar">
                <input
                    type="text"
                    className="input reflect-journal__search"
                    placeholder={t('entriesPage.searchPlaceholder') as string}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="reflect-journal__filters">
                    {FILTER_KEYS.map((key) => (
                        <button
                            key={key}
                            type="button"
                            className={`tag ${filter === key ? 'tag-accent' : ''} reflect-journal__filter`}
                            onClick={() => setFilter(key)}
                        >
                            {t(`entriesPage.filter${key.charAt(0).toUpperCase()}${key.slice(1)}`)}
                        </button>
                    ))}
                </div>
                <button type="button" className="btn btn-primary" onClick={() => navigate(APP_ROUTES.ENTRIES_NEW)}>
                    {t('entriesPage.startWriting')}
                </button>
            </div>

            {filtered.length === 0 ? (
                <p className="reflect-journal__empty">{entries.length === 0 ? t('entriesPage.emptyState') : t('entriesPage.noResults')}</p>
            ) : (
                <div className="reflect-journal__list">
                    {filtered.map((entry) => {
                        const emotions = entry.emotions.filter((e): e is Emotion => e in EMOTION_DATA);
                        return (
                            <button key={entry.id} type="button" className="reflect-journal__row" onClick={() => navigate(APP_ROUTES.ENTRIES_EDIT.replace(':id', entry.id))}>
                                <span className="reflect-journal__row-date">
                                    {new Intl.DateTimeFormat(i18n.language, { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(entry.createdAt))}
                                </span>
                                <span className="reflect-journal__row-title">{entry.title}</span>
                                {emotions[0] && <span className="tag tag-outline">{t(`emotion.${emotions[0]}`)}</span>}
                            </button>
                        );
                    })}
                </div>
            )}

            {notes.length > 0 && (
                <div className="reflect-journal__notes">
                    <div className="reflect-journal__section-label">{t('reflect.journal.notes')}</div>
                    <div className="reflect-journal__notes-list">
                        {notes.map((note) => (
                            <div key={note.id} className="reflect-journal__note">
                                {note.frameworkType !== 'FREEFORM' && (
                                    <span className="tag tag-neutral">{t(NOTE_TYPE_LABEL_KEY[note.frameworkType])}</span>
                                )}
                                {note.title && <p className="reflect-journal__note-title">{note.title}</p>}
                                <p>{firstNonEmptyPayloadField(note.payload, NOTE_SNIPPET_FIELDS[note.frameworkType])}</p>
                                <div className="reflect-journal__note-foot">
                                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={() => deleteNote.mutate(note.id)}
                                        disabled={deleteNote.isPending}
                                    >
                                        {t('entriesPage.deleteConfirmBtn')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JournalTab;
