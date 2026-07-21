import { CircularProgress } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuPenLine, LuSearch } from 'react-icons/lu';
import { useAuth } from '../../../providers/AuthProvider';
import { useSnackbar } from '../../../providers/SnackbarProvider';
import { useEntriesInfiniteQuery } from '../../../queries/entriesQueryHook';
import type { Entry } from '../../../models/entry';
import EntryCard from '../components/EntryCard/EntryCard';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import { APP_ROUTES } from '../../../constants/route';
import './EntriesListPage.scss';

type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';

const FILTER_KEYS: TimeFilter[] = ['all', 'today', 'week', 'month', 'year'];

const filterByTime = (entries: Entry[], filter: TimeFilter): Entry[] => {
  if (filter === 'all') return entries;
  const now = new Date();
  const start = new Date();

  switch (filter) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
  }

  return entries.filter(e => new Date(e.createdAt) >= start);
};

const filterBySearch = (entries: Entry[], query: string): Entry[] => {
  if (!query.trim()) return entries;
  const q = query.toLowerCase();
  return entries.filter(
    e =>
      e.title.toLowerCase().includes(q) ||
      (e.reflection && e.reflection.toLowerCase().includes(q))
  );
};

const EntriesListPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<TimeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredEntries = useMemo(() => {
    let result = filterByTime(entries, activeFilter);
    result = filterBySearch(result, searchQuery);
    return result;
  }, [entries, activeFilter, searchQuery]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const filterLabelMap: Record<TimeFilter, string> = {
    all: t('entriesPage.filterAll'),
    today: t('entriesPage.filterToday'),
    week: t('entriesPage.filterWeek'),
    month: t('entriesPage.filterMonth'),
    year: t('entriesPage.filterYear'),
  };

  return (
    <div className="entries-page">
      <div className="entries-page__glow" />

      {/* Slim header: breadcrumb + title + quote */}
      <div className="entries-page__header">
        <Breadcrumb
          variant="dark"
          items={[
            { label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME },
            { label: t('breadcrumb.reflection'), path: APP_ROUTES.REFLECTION_ZONE },
            { label: t('breadcrumb.journal') },
          ]}
        />
        <h1 className="entries-page__title">{t('entriesPage.title')}</h1>
        <p className="entries-page__subtitle">{t('entriesPage.laoTzuQuote')}</p>
      </div>

      {/* Content */}
      <div className="entries-page__content">

        {/* Filter toolbar + search */}
        {currentUser && entries.length > 0 && (
          <div className="entries-page__toolbar">
            <div className="entries-page__filters">
              {FILTER_KEYS.map((key) => (
                <button
                  key={key}
                  className={`entries-page__filter-pill ${activeFilter === key ? 'entries-page__filter-pill--active' : ''}`}
                  onClick={() => setActiveFilter(key)}
                >
                  {filterLabelMap[key]}
                </button>
              ))}
            </div>
            <div className="entries-page__search">
              <LuSearch size={14} className="entries-page__search-icon" />
              <input
                type="text"
                className="entries-page__search-input"
                placeholder={t('entriesPage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Not logged in */}
        {!currentUser && !isLoading && (
          <div className="entries-page__empty">
            <p className="entries-page__empty-title">{t('entriesPage.loginRequired')}</p>
            <p className="entries-page__empty-hint">{t('entriesPage.loginRequiredHint')}</p>
          </div>
        )}

        {/* Logged in but no entries at all */}
        {currentUser && !isLoading && entries.length === 0 && (
          <div className="entries-page__empty">
            <p className="entries-page__empty-title">{t('entriesPage.emptyState')}</p>
            <p className="entries-page__empty-hint">{t('entriesPage.emptyStateHint')}</p>
            <button
              className="entries-page__cta-btn"
              onClick={() => navigate(APP_ROUTES.ENTRIES_NEW)}
            >
              <LuPenLine size={16} />
              <span>{t('innerversePage.sections.safeSpace.cta')}</span>
            </button>
          </div>
        )}

        {/* No results after filter/search */}
        {currentUser && !isLoading && entries.length > 0 && filteredEntries.length === 0 && (
          <div className="entries-page__empty">
            <p className="entries-page__empty-hint">{t('entriesPage.noResults')}</p>
          </div>
        )}

        {/* Calendar grid */}
        {filteredEntries.length > 0 && (
          <div className="entries-page__grid">
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* Load more */}
        <div className="entries-page__load-more">
          {(isFetchingNextPage || isLoading) && (<CircularProgress size={24} sx={{ mb: 1 }} />)}

          {!isLoading && hasNextPage && (
            <button
              className="entries-page__cta-btn entries-page__cta-btn--outline"
              onClick={handleLoadMore}
            >
              {t('entriesPage.loadMore')}
            </button>
          )}

          {entries.length > 0 && (
            <span className="entries-page__load-more-text">
              {t('entriesPage.showing', { current: entries.length, total })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntriesListPage;