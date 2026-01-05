import LandscapeIcon from '@mui/icons-material/Landscape';
import { Button, CircularProgress, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { IoFlameSharp } from "react-icons/io5";
import { useSnackbar } from '../../../providers/SnackbarProvider';
import { useEntriesInfiniteQuery } from '../../../queries/entriesQueryHook';
import EntryCard from '../components/EntryCard/EntryCard';
import './EntriesListPage.scss';

const EntriesListPage: React.FC = () => {
  const { showSnackbar } = useSnackbar();

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

  const entries = React.useMemo(() => {
    return data?.pages.flatMap(page => page.content) || [];
  }, [data]);

  const total = data?.pages[0]?.total || 0;
  
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="main-content">
      <div className="entries-list-frame">
        <div className="entry-title">
          <h2 className="entries-list-title">Journal</h2>
          <span className="entries-list-subtitle">Emotional Journey</span>
        </div>

        {/* Quick Stats */}
        <div className="stats-section">
          <div className="stat-card-dark">
            <div className="icon-box">
              <IoFlameSharp />
            </div>
            <div className="stat-content">
              <div className="stat-value">0</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
          <div className="stat-card-light">
            <div className="icon-box">
              <LandscapeIcon />
            </div>
            <div className="stat-content">
              <div className="stat-value">Happy</div>
              <div className="stat-label">Top Mood</div>
            </div>
          </div>
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
            Load More
          </Button>
        )}

        <Typography variant="caption" className="load-more-text">
          Showing {entries.length} of {total} entries
        </Typography>
      </div>
    </div>
  );
};

export default EntriesListPage;