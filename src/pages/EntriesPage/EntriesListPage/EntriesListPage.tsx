import { Button, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../../providers/SnackbarProvider';
import { useEntriesInfiniteQuery } from '../../../queries/entriesQueryHook';
import { calculateDayStreak, getTopMood } from '../../../utils/statsUtil';
import { EMOTION_DATA } from '../../../models/emotion';
import StatCard from '../../../components/StatCard/StatCard';
import EntryCard from '../components/EntryCard/EntryCard';
import './EntriesListPage.scss';

const EntriesListPage: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useEntriesInfiniteQuery();

  useEffect(() => {
    if (isError) {
      showSnackbar('Failed to load entries', 'error');
    }
  }, [isError, showSnackbar]);

  const entries = useMemo(() => {
    return data?.pages.flatMap(page => page.content) || [];
  }, [data]);

  const total = data?.pages[0]?.total || 0;

  const streak = useMemo(() => calculateDayStreak(entries), [entries]);
  const topMood = useMemo(() => getTopMood(entries), [entries]);
  
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="entries-page">
      <div className="entries-list-frame">
        <div className="entry-title">
          <h2 className="entries-list-title">{t('entriesPage.title')}</h2>
          <span className="entries-list-subtitle">{t('entriesPage.subtitle')}</span>
        </div>

        {/* Quick Stats */}
        <div className="stats-section">
          <StatCard
            icon={<span>{streak.icon}</span>}
            value={streak.count}
            label={t('profilePage.stats.dayStreak')}
            variant="glass-dark"
            accentColor={streak.color}
          />
          <StatCard
            icon={<span>{topMood ? topMood.icon : (EMOTION_DATA.happy?.icon || '😊')}</span>}
            value={topMood ? topMood.label : '—'}
            label={t('profilePage.stats.topMood')}
            variant="glass-dark"
            accentColor={topMood?.color}
          />
        </div>

        {/* List of Journal Cards */}
        <div className="entries-list-content">
          {entries.length > 0 && (
            entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))
          )}
        </div>

      </div>
      <div className="load-more-wrapper">
        {(isFetchingNextPage || isLoading) && (<CircularProgress size={30} sx={{ mb: 2 }} />)}

        {!isLoading && hasNextPage && (
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            className="load-more-btn"
          >
            {t('entriesPage.loadMore')}
          </Button>
        )}

        <Typography variant="caption" className="load-more-text">
          {t('entriesPage.showing', { current: entries.length, total })}
        </Typography>
      </div>
    </div>
  );
};

export default EntriesListPage;