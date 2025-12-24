import LandscapeIcon from '@mui/icons-material/Landscape';
import { Button, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IoFlameSharp } from "react-icons/io5";
import { Emotion } from '../../../models/emotion';
import type { Entry } from '../../../models/entry';
import { useSnackbar } from '../../../providers/SnackbarProvider';
import { entriesService } from '../../../services/entriesService';
import EntryCard from '../components/EntryCard/EntryCard';
import './EntriesListPage.scss';

// const mapApiEntryToModel = (apiItem: ApiEntry): Entry => {
//   const dateObj = new Date(apiItem.createdAt);

//   return {
//     id: apiItem.id,
//     userId: apiItem.userId,
//     title: apiItem.title,
//     reflection: apiItem.reflection,
//     emotions: apiItem.emotions.filter((emotion: string): emotion is Emotion => {
//       return Object.values(Emotion).includes(emotion as Emotion);
//     }),
//     createdAt: dateObj,
//     updatedAt: new Date(apiItem.updatedAt),
//     dayDisplay: {
//       month: dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
//       date: dateObj.getDate().toString().padStart(2, '0'),
//       dayName: dateObj.toLocaleString('en-US', { weekday: 'long' })
//     }
//   };
// };

const EntriesListPage: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [nextLink, setNextLink] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchEntries = async (url?: string) => {
    setIsLoading(true);
    try {
      const response = await entriesService.getEntries(url);

      if (response && Array.isArray(response.content)) {
        const rawData = response.content;

        if (url) {
          setEntries(prev => [...prev, ...rawData]);
        } else {
          setEntries(rawData);
        }

        setNextLink(response.nextLink);
        setTotal(response.total);
      } else {
        if (!url) setEntries([]);
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
      fetchEntries(nextLink);
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