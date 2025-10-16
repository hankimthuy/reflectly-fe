import React, { useState } from 'react';
import './EntriesPage.scss';
import DailyReflectionCard from "../home/DailyReflectionCard/DailyReflectionCard.tsx";
import { IconWrapper } from '../../components/common/IconWrapper/IconWrapper.tsx';
import { Grid, Typography } from '@mui/material';
import BaseCard from '../../components/common/BaseCard/BaseCard.tsx';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';

/**
 * @component EntriesPage
 * @description The entries page that starts with emotion selection and flows to reflection logging.
 * @returns {JSX.Element} The rendered EntriesPage component.
 */
const EntriesPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('emotion-capture');
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmotionToggle = (emotion: Emotion) => {
    setSelectedEmotions(prev => {
      return prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion];
    });
  };

  const handleNext = () => {
    if (selectedEmotions.length > 0) {
      setCurrentStep('reflection-capture');
    }
  };

  const handleBack = () => {
    setCurrentStep('emotion-capture');
  };

  const handleSave = async (title: string, reflection: string) => {
    setIsLoading(true);
    try {
      const entry: CreateEntryRequest = {
        title,
        reflection,
        emotions: selectedEmotions,
        activities: [] // Can be extended later
      };

      await entriesService.createEntry(entry);

      // Reset state and go back to emotion capture
      setCurrentStep('emotion-capture');
      setSelectedEmotions([]);
    } catch (error) {
      console.error('Failed to save entry:', error);
      // Handle error (could show toast notification)
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="main-content">
      <DailyReflectionCard />

      <Grid container spacing={2}>
        <Grid size={6}>
          <BaseCard>
            <div className="card-header">
              <IconWrapper variant="secondary">
                <EmojiEmotionsOutlinedIcon />
              </IconWrapper>
              <div>
                <Typography variant="subtitle1" component="div">
                  Mood Check
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {`"Track your daily emotions"`}
                </Typography>
              </div>
            </div>
          </BaseCard>
        </Grid>

        <Grid size={6}>
          <BaseCard>
            <div className="card-header">
              <IconWrapper variant="primary">
                <StarBorderOutlinedIcon />
              </IconWrapper>
              <div>
                <Typography variant="subtitle1" component="div">
                  Gratitude
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {`"Three things you're grateful for"`}
                </Typography>
              </div>
            </div>
          </BaseCard>
        </Grid>

        <Grid size={12}>
          <BaseCard>
            <div className="card-header">
              <IconWrapper variant="secondary">
                <SentimentSatisfiedOutlinedIcon />
              </IconWrapper>
              <div>
                <Typography variant="subtitle1" component="div">
                  Latest Check-in
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Yesterday: {`"Feeling grateful for the little things in life."`}
                </Typography>
              </div>
            </div>
          </BaseCard>
        </Grid>
      </Grid>

      {/* --- Daily Affirmation BaseCard --- */}
      <BaseCard>
        <div className="card-header">
          <IconWrapper variant="primary">
            <StarBorderOutlinedIcon />
          </IconWrapper>
          <div>
            <Typography variant="subtitle1" component="div">
              Daily Affirmation
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {`"I am worthy of love and happiness."`}
            </Typography>
          </div>
        </div>
      </BaseCard>      </main>

  );
};

export default EntriesPage;