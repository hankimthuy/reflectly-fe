import { useTranslation } from 'react-i18next';
import { useInsightsInfiniteQuery } from '../../queries/insightsQueryHook';
import InsightCard from './InsightCard';

const InsightTimelineList = () => {
  const { t } = useTranslation();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInsightsInfiniteQuery();

  const insights = data?.pages.flatMap((page) => page.content) ?? [];

  if (isLoading) {
    return <p className="text-sm text-coach-text-muted">{t('dashboard.loading')}</p>;
  }

  if (insights.length === 0) {
    return (
      <div className="rounded-2xl border border-coach-border bg-coach-surface p-8 text-center text-sm text-coach-text-muted">
        {t('dashboard.insightsEmpty')}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}

      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-1 self-center rounded-lg border border-coach-border px-4 py-1.5 text-xs font-medium text-coach-text-muted hover:bg-coach-bg disabled:opacity-40"
        >
          {isFetchingNextPage ? t('dashboard.loading') : t('dashboard.loadMore')}
        </button>
      )}
    </div>
  );
};

export default InsightTimelineList;
