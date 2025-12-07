import LandscapeIcon from '@mui/icons-material/Landscape';
import React from 'react';
import { Emotion } from '../../../models/emotion';
import type { Entry } from '../../../models/entry';
import EntryCard from '../components/EntryCard/EntryCard';
import './EntriesListPage.scss';
import { Flame } from 'lucide-react';

const INITIAL_DATA: Entry[] = [
  {
    id: 'entry-1',
    userId: 'user-1',
    title: 'A day of mixed emotions',
    reflection: 'Received good news from family early in the morning, felt very warm. But by noon, work piled up, and the boss pushing deadlines made me terribly stressed. Went for a walk in the evening, the cool breeze cleared my mind. Cooked a nice meal at home, felt everything was stable and peaceful again.',
    emotions: [
      Emotion.BLESSED,
      Emotion.ANXIOUS,
      Emotion.GOOD,
      Emotion.HAPPY
    ],
    createdAt: new Date('2023-07-25T21:00:00'),
    updatedAt: new Date('2023-07-25T21:00:00'),
    dayDisplay: { dayName: 'Today', month: 'Jul', date: '25' },
  },
  {
    id: 'entry-2',
    userId: 'user-1',
    title: 'Absolutely amazing day!',
    reflection: 'Nothing to complain about. Everything went smoothly. Achieved my goals and still had time for the gym. Feeling full of positive energy.',
    emotions: [
      Emotion.HAPPY,
      Emotion.GOOD
    ],
    createdAt: new Date('2023-07-24T20:00:00'),
    updatedAt: new Date('2023-07-24T20:00:00'),
    dayDisplay: { dayName: 'Yesterday', month: 'Jul', date: '24' },
  },
  {
    id: 'entry-3',
    userId: 'user-1',
    title: 'Sleep deprived and tired',
    reflection: 'Felt low energy all day today. Probably because I didn\'t sleep enough yesterday, only got about 4 hours. Just want to lie around. Hope to sleep better tonight to recover for tomorrow.',
    emotions: [
      Emotion.DOWN,
      Emotion.BORED
    ],
    createdAt: new Date('2023-07-23T19:00:00'),
    updatedAt: new Date('2023-07-23T19:00:00'),
    dayDisplay: { dayName: 'Tuesday', month: 'Jul', date: '23' },
  }
];

const EntriesListPage: React.FC = () => {
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
              <Flame />
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
          {INITIAL_DATA.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default EntriesListPage;