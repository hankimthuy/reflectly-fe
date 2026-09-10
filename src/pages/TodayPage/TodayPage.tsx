import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useSidebarFooter } from '../../layouts/AppShell/AppShellContext';
import { APP_ROUTES } from '../../constants/route';
import { useEntriesInfiniteQuery } from '../../queries/entriesQueryHook';
import { useConversationsInfiniteQuery } from '../../queries/conversationsQueryHook';
import { usePeopleQuery } from '../../queries/peopleQueryHook';
import { useMirrorSnapshot, MIRROR_PANES } from '../../hooks/useMirrorSnapshot';
import { calculateDayStreak } from '../../utils/statsUtil';
import { EMOTION_HEAVINESS, heaviestEmotion, heavinessColorVar } from '../../utils/moodUtil';
import { sessionTitleFromSummary } from '../../utils/textUtil';
import { Emotion } from '../../models/emotion';
import Loading from '../../components/Loading/Loading';
import { ButtonLink } from '../../components/Button/Button';
import './TodayPage.scss';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const TodayPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const entriesQuery = useEntriesInfiniteQuery();
    const conversationsQuery = useConversationsInfiniteQuery();
    const peopleQuery = usePeopleQuery();
    const mirror = useMirrorSnapshot();

    const entries = useMemo(() => entriesQuery.data?.pages.flatMap((p) => p.content) ?? [], [entriesQuery.data]);
    const conversations = useMemo(
        () => conversationsQuery.data?.pages.flatMap((p) => p.content) ?? [],
        [conversationsQuery.data],
    );

    const isLoading = entriesQuery.isLoading || conversationsQuery.isLoading || peopleQuery.isLoading;

    const firstName = (currentUser?.fullName ?? '').trim().split(/\s+/).pop() || currentUser?.fullName || '';
    const hour = new Date().getHours();
    const greetingKey = hour < 12 ? 'today.greetingMorning' : hour < 18 ? 'today.greetingAfternoon' : 'today.greetingEvening';

    const streak = useMemo(() => calculateDayStreak(entries), [entries]);

    const dateLabel = useMemo(
        () => new Date().toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' }),
        [i18n.language],
    );

    // Today's opener rotates daily (stable within a day) rather than repeating the same line
    // every visit — there's no backend concept of a personalized daily prompt yet.
    const openers = t('today.openers', { returnObjects: true }) as string[];
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / DAY_MS);
    const opener = openers[dayOfYear % openers.length];

    const startConversation = (prefill?: string) => {
        navigate(APP_ROUTES.COACH_CHAT, { state: prefill ? { prefill } : undefined });
    };

    // Last seven days, one bar each, colored by that day's heaviest logged emotion.
    const last7 = useMemo(() => {
        const today = startOfDay(new Date());
        const days = Array.from({ length: 7 }, (_, i) => new Date(today.getTime() - (6 - i) * DAY_MS));
        return days.map((day) => {
            const dayEntries = entries.filter((e) => startOfDay(new Date(e.createdAt)).getTime() === day.getTime());
            const emotions = dayEntries.flatMap((e) => e.emotions) as Emotion[];
            const heaviest = heaviestEmotion(emotions);
            return { day, heaviest, hasData: dayEntries.length > 0 };
        });
    }, [entries]);
    const hasAnyMood = last7.some((d) => d.hasData);

    // "Pick back up": most recent ended sessions + entries, newest first.
    const pickBackUp = useMemo(() => {
        const sessionItems = conversations
            .filter((c) => c.status !== 'ACTIVE')
            .map((c) => ({
                type: 'session' as const,
                date: c.endedAt ?? c.startedAt,
                label: sessionTitleFromSummary(c.summary, t('coach.history.noSummary', 'Untitled session')),
                to: `${APP_ROUTES.COACH_HISTORY}/${c.id}`,
            }));
        const entryItems = entries.map((e) => ({
            type: 'entry' as const,
            date: e.createdAt,
            label: e.title,
            to: APP_ROUTES.ENTRIES_EDIT.replace(':id', e.id),
        }));
        return [...sessionItems, ...entryItems]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
    }, [conversations, entries, t]);

    const people = useMemo(() => peopleQuery.data ?? [], [peopleQuery.data]);
    const needsAttention = useMemo(
        () =>
            [...people]
                .filter((p) => (p.daysSinceLastMention ?? 0) > 0 || p.healthSignal < 0.5)
                .sort((a, b) => (b.daysSinceLastMention ?? 0) - (a.daysSinceLastMention ?? 0))
                .slice(0, 2),
        [people],
    );

    const now = new Date().getTime();
    const sessionsThisWeek = conversations.filter((c) => now - new Date(c.startedAt).getTime() < 7 * DAY_MS).length;
    const entriesThisWeek = entries.filter((e) => now - new Date(e.createdAt).getTime() < 7 * DAY_MS).length;
    useSidebarFooter(
        <>
            <div className="app-shell__footer-label">{t('appShell.thisWeek.label')}</div>
            <div className="app-shell__footer-name">
                {t('appShell.thisWeek.value', { sessions: sessionsThisWeek, entries: entriesThisWeek })}
            </div>
        </>,
    );

    if (isLoading) {
        return <Loading message={t('today.loading', 'Loading Today…') as string} fullHeight />;
    }

    return (
        <div className="today">
            <div className="today__header">
                <div className="today__date">{dateLabel}</div>
                <h2 className="today__greeting">{t(greetingKey, { name: firstName })}</h2>
                <p className="today__subtitle">
                    {streak.count > 0 ? t('today.subtitleStreak', { count: streak.count }) : t('today.subtitleNone')}
                </p>
            </div>

            <div className="today__body">
                <div className="today__main">
                    <div className="today__opener">
                        <div className="today__opener-inner">
                            <div className="today__opener-label">{t('today.openerLabel')}</div>
                            <p className="today__opener-text">&ldquo;{opener}&rdquo;</p>
                        </div>
                        <div className="today__opener-actions">
                            <button type="button" className="btn btn-primary today__opener-start" onClick={() => startConversation(opener)}>
                                {t('today.startHere')}
                            </button>
                            <button type="button" className="btn btn-secondary today__opener-else" onClick={() => startConversation()}>
                                {t('today.somethingElse')}
                            </button>
                        </div>
                    </div>

                    <div className="today__mood">
                        <div className="today__section-head">
                            <span className="today__section-label">{t('today.lastSevenDays')}</span>
                        </div>
                        {hasAnyMood ? (
                            <>
                                <div className="today__mood-bars">
                                    {last7.map(({ day, heaviest, hasData }) => (
                                        <div key={day.toISOString()} className="today__mood-bar-col">
                                            <div
                                                className="today__mood-bar"
                                                style={{
                                                    height: hasData ? '100%' : '14%',
                                                    background: hasData && heaviest
                                                        ? heavinessColorVar(EMOTION_HEAVINESS[heaviest])
                                                        : 'var(--color-neutral-200)',
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="today__mood-labels">
                                    {last7.map(({ heaviest }, i) => (
                                        <div key={i} className="today__mood-label">
                                            {heaviest ? t(`emotion.${heaviest}`) : '—'}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="today__mood-empty">{t('today.noMoodYet')}</p>
                        )}
                    </div>

                    <div className="today__pickbackup">
                        <div className="today__section-head">
                            <span className="today__section-label">{t('today.pickBackUp')}</span>
                        </div>
                        {pickBackUp.length === 0 ? (
                            <p className="today__mood-empty">{t('today.emptyPickBackUp')}</p>
                        ) : (
                            <div className="today__pickbackup-list">
                                {pickBackUp.map((item) => (
                                    <button key={`${item.type}-${item.to}`} type="button" className="today__pickbackup-item" onClick={() => navigate(item.to)}>
                                        <span className="today__pickbackup-date">
                                            {new Date(item.date).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'short' })}
                                        </span>
                                        <span className="today__pickbackup-label">{item.label}</span>
                                        <span className={`tag ${item.type === 'session' ? 'tag-outline' : 'tag-neutral'}`}>
                                            {item.type === 'session' ? t('today.session') : t('today.entry')}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mobile-only condensed "needs attention" — the full mirror/people side rail
                        (below) is desktop-only, matching mockup 2a vs 1a. */}
                    {needsAttention[0] && (
                        <button
                            type="button"
                            className="today__mobile-attention"
                            onClick={() => navigate(`${APP_ROUTES.REFLECT}/people`)}
                        >
                            <span className="today__mobile-attention-dot" />
                            <span className="today__mobile-attention-text">
                                {t('today.daysSince', { count: needsAttention[0].daysSinceLastMention ?? 0 })} — {needsAttention[0].name}
                            </span>
                            <span className="today__mobile-attention-arrow">→</span>
                        </button>
                    )}
                </div>

                <div className="today__side">
                    <div className="today__mirror">
                        <div className="today__section-head">
                            <span className="today__section-label">{t('mirror.title')}</span>
                            <ButtonLink to={`${APP_ROUTES.REFLECT}/mirror`} variant="ghost" size="sm">{t('mirror.openLink')}</ButtonLink>
                        </div>
                        <div className="today__mirror-grid">
                            {MIRROR_PANES.map((pane) => (
                                <div key={pane} className={`today__mirror-cell today__mirror-cell--${pane}`}>
                                    <div className="today__mirror-cell-label">{t(`mirror.${pane}.label`)}</div>
                                    <div className="today__mirror-cell-count">{mirror.counts[pane]}</div>
                                    <div className="today__mirror-cell-sub">{t(`mirror.${pane}.sub`)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="today__attention">
                        <div className="today__section-head">
                            <span className="today__section-label">{t('today.needsAttention')}</span>
                        </div>
                        {needsAttention.length === 0 ? (
                            <p className="today__mood-empty">{t('today.noAttention')}</p>
                        ) : (
                            <div className="today__attention-list">
                                {needsAttention.map((person) => (
                                    <div key={person.id} className="today__attention-row">
                                        <span className="today__attention-dot" style={{ background: person.healthSignal < 0.3 ? 'var(--color-accent)' : 'var(--color-accent-400)' }} />
                                        <span className="today__attention-name">{person.name}</span>
                                        <span className="today__attention-days">{t('today.daysSince', { count: person.daysSinceLastMention ?? 0 })}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {needsAttention[0]?.nudgeText && <p className="today__attention-nudge">{needsAttention[0].nudgeText}</p>}
                    </div>

                    <div className="today__write-alone">
                        <div className="today__section-label">{t('today.preferAlone')}</div>
                        <ButtonLink to={APP_ROUTES.ENTRIES_NEW} variant="secondary" className="btn-block today__write-alone-btn">
                            <span>{t('today.newEntry')}</span>
                            <span className="today__write-alone-arrow">→</span>
                        </ButtonLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodayPage;
