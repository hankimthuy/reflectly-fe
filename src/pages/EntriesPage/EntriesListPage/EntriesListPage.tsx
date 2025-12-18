import LandscapeIcon from '@mui/icons-material/Landscape';
import React, { useEffect, useState } from 'react';
import { IoFlameSharp } from "react-icons/io5";
import type { Entry } from '../../../models/entry';
import { useSnackbar } from '../../../providers/SnackbarProvider';
import { entriesService, mapApiEntryToModel } from '../../../services/entriesService';
import EntryCard from '../components/EntryCard/EntryCard';
import './EntriesListPage.scss';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

const EntriesListPage: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [nextLink, setNextLink] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchEntries = async (url?: string, isLoadMore: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await entriesService.getEntries(url);

      if (response && Array.isArray(response.content)) {
        const formattedData = response.content.map(mapApiEntryToModel);
        if (isLoadMore) {
          setEntries(prev => [...prev, ...formattedData]);
        } else {
          setEntries(formattedData);
        }
        setNextLink(response.nextLink);
        setTotal(response.total);
      } else {
        if (!isLoadMore) setEntries([]);
      }
    } catch (err) {
      showSnackbar('Failed to load entries', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleLoadMore = () => {
    if (nextLink) {
      fetchEntries(nextLink, true);
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
          {/* {INITIAL_DATA.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))} */}
          {entries.length > 0 && (
            entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))
          )}
        </div>

      </div>
      <div className="load-more-wrapper">
        {isLoading && <CircularProgress size={30} sx={{ mb: 2 }} />}

        {!isLoading && nextLink && (
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