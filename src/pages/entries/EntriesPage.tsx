import React, { useState } from 'react';
import './EntriesPage.scss';
import EmotionSelectionStep from './components/EmotionSelectionStep/EmotionSelectionStep';
import ReflectionLoggingStep from './components/ReflectionLoggingStep/ReflectionLoggingStep';
import type { CreateEntryRequest } from '../../models/entry';
import { entriesService } from '../../services/entriesService';
import { Emotion } from '../../models/emotion';

type Step = 'emotion-selection' | 'reflection-logging';

/**
 * @component EntriesPage
 * @description The entries page that starts with emotion selection and flows to reflection logging.
 * @returns {JSX.Element} The rendered EntriesPage component.
 */
const EntriesPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('emotion-selection');
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
      setCurrentStep('reflection-logging');
    }
  };

  const handleBack = () => {
    setCurrentStep('emotion-selection');
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
      
      // Reset state and go back to emotion selection
      setCurrentStep('emotion-selection');
      setSelectedEmotions([]);
    } catch (error) {
      console.error('Failed to save entry:', error);
      // Handle error (could show toast notification)
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="entries-page">
      {currentStep === 'emotion-selection' && (
        <EmotionSelectionStep
          selectedEmotions={selectedEmotions}
          onEmotionToggle={handleEmotionToggle}
          onNext={handleNext}
          maxSelections={10}
        />
      )}
      
      {currentStep === 'reflection-logging' && (
        <ReflectionLoggingStep
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