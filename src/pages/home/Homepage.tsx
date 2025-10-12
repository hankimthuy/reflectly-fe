import React from 'react';
import './HomePage.scss';
import { IconWrapper } from '../../components/common/IconWrapper/IconWrapper.tsx';
import { Grid } from '@mui/material';
import BaseCard from '../../components/common/BaseCard/BaseCard.tsx';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import DailyReflectionCard from './DailyReflectionCard/DailyReflectionCard.tsx';

/**
 * @component HomePage
 * @description The main dashboard screen for the Reflectly app, now composed of smaller,
 * reusable TypeScript components.
 * @returns {JSX.Element} The rendered HomePage component.
 */
const HomePage: React.FC = () => {

  return (
    <main className="main-content">
      {/* Daily Reflection Card - Full Width */}
      <DailyReflectionCard />

      {/* Cards Grid Layout */}
      <Grid container spacing={2}>
        {/* First Row - Mood Check & Gratitude (2 cards side by side) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <BaseCard>
            <div className="card-content">
              <div className="card-icon">
                <IconWrapper variant="secondary">
                  <EmojiEmotionsOutlinedIcon />
                </IconWrapper>
              </div>
              <div className="card-text">
                <h2 className="card-title">
                  Mood Check
                </h2>
                <p className="card-description">
                  {`"Track your daily emotions"`}
                </p>
              </div>
            </div>
          </BaseCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <BaseCard>
            <div className="card-content">
              <div className="card-icon">
                <IconWrapper variant="primary">
                  <StarBorderOutlinedIcon />
                </IconWrapper>
              </div>
              <div className="card-text">
                <h2 className="card-title">
                  Gratitude
                </h2>
                <p className="card-description">
                  {`"Three things you're grateful for"`}
                </p>
              </div>
            </div>
          </BaseCard>
        </Grid>

        {/* Second Row - Daily Affirmation (full width) */}
        <Grid size={12}>
          <BaseCard>
            <div className="card-content">
              <div className="card-icon">
                <IconWrapper variant="primary">
                  <StarBorderOutlinedIcon />
                </IconWrapper>
              </div>
              <div className="card-text">
                <h2 className="card-title">
                  Daily Affirmation
                </h2>
                <p className="card-description">
                  {`"I am worthy of love and happiness."`}
                </p>
              </div>
            </div>
          </BaseCard>
        </Grid>

        {/* Third Row - Latest Check-in (full width) */}
        <Grid size={12}>
          <BaseCard>
            <div className="card-content">
              <div className="card-icon">
                <IconWrapper variant="secondary">
                  <SentimentSatisfiedOutlinedIcon />
                </IconWrapper>
              </div>
              <div className="card-text">
                <h2 className="card-title">
                  Latest Check-in
                </h2>
                <p className="card-description">
                  Yesterday: {`"Feeling grateful for the little things in life."`}
                </p>
              </div>
            </div>
          </BaseCard>
        </Grid>
      </Grid>
    </main>

  );
};

export default HomePage;