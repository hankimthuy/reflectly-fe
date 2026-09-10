import { useTranslation } from 'react-i18next';
import { useInsightsInfiniteQuery } from '../../../queries/insightsQueryHook';
import Loading from '../../../components/Loading/Loading';

const CATEGORY_TAG_CLASS: Record<string, string> = {
    RELATIONSHIP: 'tag-accent',
    VALUE: 'tag-pine',
    BEHAVIOR_PATTERN: 'tag-neutral',
};

const CATEGORY_LABEL_KEY: Record<string, string> = {
    RELATIONSHIP: 'dashboard.category.relationship',
    VALUE: 'dashboard.category.value',
    BEHAVIOR_PATTERN: 'dashboard.category.behaviorPattern',
};

/** Read-only: everything here is something Aura noticed on its own after a session ended, never
 * something typed in directly (that's the Journal tab, or a Mirror catch). */
const TimelineTab = () => {
    const { t, i18n } = useTranslation();
    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInsightsInfiniteQuery();
    const insights = data?.pages.flatMap((p) => p.content) ?? [];

    if (isLoading) return <Loading message={t('dashboard.loading') as string} fullHeight />;

    return (
        <div className="reflect-timeline">
            {insights.length === 0 ? (
                <p className="reflect-timeline__empty">{t('dashboard.insightsEmpty')}</p>
            ) : (
                <div className="reflect-timeline__list">
                    {insights.map((insight) => (
                        <div key={insight.id} className="reflect-timeline__item">
                            <span className="reflect-timeline__dot" />
                            <div className="reflect-timeline__content">
                                <div className="reflect-timeline__row">
                                    <span className={`tag ${CATEGORY_TAG_CLASS[insight.category]}`}>{t(CATEGORY_LABEL_KEY[insight.category])}</span>
                                    <span className="reflect-timeline__date">
                                        {new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }).format(new Date(insight.createdAt))}
                                    </span>
                                </div>
                                <p className="reflect-timeline__text">{insight.insightText}</p>
                                {insight.personName && (
                                    <p className="reflect-timeline__person">{t('dashboard.person.relatedTo', { name: insight.personName })}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {hasNextPage && (
                <button type="button" className="btn btn-secondary reflect-timeline__more" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? t('dashboard.loading') : t('dashboard.loadMore')}
                </button>
            )}
        </div>
    );
};

export default TimelineTab;
