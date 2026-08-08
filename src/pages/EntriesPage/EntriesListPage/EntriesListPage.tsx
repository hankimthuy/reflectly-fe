import { CircularProgress } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuPenLine, LuSearch } from 'react-icons/lu';
import { useAuth } from '../../../providers/AuthProvider';
import { useSnackbar } from '../../../providers/SnackbarProvider';
import { useEntriesInfiniteQuery } from '../../../queries/entriesQueryHook';
import { useSavedFrameworkEntriesInfiniteQuery } from '../../../queries/savedFrameworkEntriesQueryHook';
import type { Entry } from '../../../models/entry';
import EntryCard from '../components/EntryCard/EntryCard';
import SavedFrameworkEntryCard from '../components/SavedFrameworkEntryCard/SavedFrameworkEntryCard';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import { Button } from '../../../components/Button/Button';
import { APP_ROUTES } from '../../../constants/route';
import './EntriesListPage.scss';

type EntriesTab = 'entries' | 'insights';

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
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const [activeFilter, setActiveFilter] = useState<TimeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<EntriesTab>(highlightId ? 'insights' : 'entries');

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useEntriesInfiniteQuery();

  const {
    data: savedEntriesData,
    isLoading: isSavedEntriesLoading,
    fetchNextPage: fetchNextSavedEntriesPage,
    hasNextPage: hasNextSavedEntriesPage,
    isFetchingNextPage: isFetchingNextSavedEntriesPage,
  } = useSavedFrameworkEntriesInfiniteQuery();

  useEffect(() => {
    if (isError) {
      showSnackbar('Failed to load entries', 'error');
    }
  }, [isError, showSnackbar]);

  const entries = useMemo(() => {
    return data?.pages.flatMap(page => page.content) || [];
  }, [data]);

  const savedEntries = useMemo(() => {
    return savedEntriesData?.pages.flatMap(page => page.content) || [];
  }, [savedEntriesData]);

  useEffect(() => {
    if (!highlightId || activeTab !== 'insights') return;
    const el = document.getElementById(`saved-entry-${highlightId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightId, activeTab, savedEntries]);

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
            { label: t('breadcrumb.journal') },
          ]}
        />
        <h1 className="entries-page__title">{t('entriesPage.title')}</h1>
      </div>

      {/* Content */}
      <div className="entries-page__content">

        {/* Tabs: manual journal entries vs saved framework entries captured from Aura chats */}
        {currentUser && (
          <div className="entries-page__filters">
            <button
              className={`entries-page__filter-pill ${activeTab === 'entries' ? 'entries-page__filter-pill--active' : ''}`}
              onClick={() => setActiveTab('entries')}
            >
              {t('entriesPage.tabEntries')}
            </button>
            <button
              className={`entries-page__filter-pill ${activeTab === 'insights' ? 'entries-page__filter-pill--active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              {t('entriesPage.tabInsights')}
            </button>
          </div>
        )}

        {/* Filter toolbar + search */}
        {activeTab === 'entries' && currentUser && entries.length > 0 && (
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
        {activeTab === 'entries' && !currentUser && !isLoading && (
          <div className="entries-page__empty">
            <p className="entries-page__empty-title">{t('entriesPage.loginRequired')}</p>
            <p className="entries-page__empty-hint">{t('entriesPage.loginRequiredHint')}</p>
          </div>
        )}

        {/* Logged in but no entries at all */}
        {activeTab === 'entries' && currentUser && !isLoading && entries.length === 0 && (
          <div className="entries-page__empty">
            <p className="entries-page__empty-title">{t('entriesPage.emptyState')}</p>
            <p className="entries-page__empty-hint">{t('entriesPage.emptyStateHint')}</p>
            <Button
              variant="primary"
              size="md"
              shape="pill"
              className="mt-4"
              onClick={() => navigate(APP_ROUTES.ENTRIES_NEW)}
            >
              <LuPenLine size={16} />
              <span>{t('entriesPage.startWriting')}</span>
            </Button>
          </div>
        )}

        {/* No results after filter/search */}
        {activeTab === 'entries' && currentUser && !isLoading && entries.length > 0 && filteredEntries.length === 0 && (
          <div className="entries-page__empty">
            <p className="entries-page__empty-hint">{t('entriesPage.noResults')}</p>
          </div>
        )}

        {/* Calendar grid */}
        {activeTab === 'entries' && filteredEntries.length > 0 && (
          <div className="entries-page__grid">
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* Load more */}
        {activeTab === 'entries' && (
        <div className="entries-page__load-more">
          {(isFetchingNextPage || isLoading) && (<CircularProgress size={24} sx={{ mb: 1 }} />)}

          {!isLoading && hasNextPage && (
            <Button
              variant="secondary"
              size="md"
              shape="pill"
              onClick={handleLoadMore}
              className="!border-white/20 !bg-transparent !text-coach-bg hover:!bg-white/10"
            >
              {t('entriesPage.loadMore')}
            </Button>
          )}

          {entries.length > 0 && (
            <span className="entries-page__load-more-text">
              {t('entriesPage.showing', { current: entries.length, total })}
            </span>
          )}
        </div>
        )}

        {/* Insights tab: framework entries captured from Aura chats (Free-form, Johari Window, ...) */}
        {activeTab === 'insights' && (
          <>
            {!isSavedEntriesLoading && savedEntries.length === 0 && (
              <div className="entries-page__empty">
                <p className="entries-page__empty-title">{t('entriesPage.insightsEmpty')}</p>
                <p className="entries-page__empty-hint">{t('entriesPage.insightsEmptyHint')}</p>
                <Button
                  variant="primary"
                  size="md"
                  shape="pill"
                  className="mt-4"
                  onClick={() => navigate(APP_ROUTES.COACH_CHAT)}
                >
                  <span>{t('entriesPage.goChatWithAura')}</span>
                </Button>
              </div>
            )}

            {savedEntries.length > 0 && (
              <div className="entries-page__grid">
                {savedEntries.map((entry) => (
                  <SavedFrameworkEntryCard key={entry.id} entry={entry} highlighted={entry.id === highlightId} />
                ))}
              </div>
            )}

            <div className="entries-page__load-more">
              {(isFetchingNextSavedEntriesPage || isSavedEntriesLoading) && (
                <CircularProgress size={24} sx={{ mb: 1 }} />
              )}

              {!isSavedEntriesLoading && hasNextSavedEntriesPage && (
                <Button
                  variant="secondary"
                  size="md"
                  shape="pill"
                  onClick={() => fetchNextSavedEntriesPage()}
                  className="!border-white/20 !bg-transparent !text-coach-bg hover:!bg-white/10"
                >
                  {t('entriesPage.loadMore')}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EntriesListPage;