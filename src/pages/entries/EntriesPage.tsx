import React, { useState } from 'react';
import './EntriesPage.scss';
import EmotionCapture from './components/EmotionCapture/EmotionCapture';
import ReflectionCapture from './components/ReflectionCapture/ReflectionCapture';
import { Emotion } from '../../models/emotion';
import type { CreateEntryRequest } from '../../models/entry';
import { entriesService } from '../../services/entriesService';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';

const steps = ['Select Emotion', 'Write Reflection'];

const EntriesPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
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
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
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
      setCurrentStep(0);
      setSelectedEmotions([]);
    } catch (error) {
      // Handle error (could show toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="entries-content">
      <Box sx={{ width: '100%', m: 2 }}> 
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {currentStep === 0 && (
        <EmotionCapture
          selectedEmotions={selectedEmotions}
          onEmotionToggle={handleEmotionToggle}
          onNext={handleNext}
          maxSelections={10}
        />
      )}

      {currentStep === 1 && (
        <ReflectionCapture
          selectedEmotions={selectedEmotions}
          onBack={handleBack}
          onSave={handleSave}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default EntriesPage;