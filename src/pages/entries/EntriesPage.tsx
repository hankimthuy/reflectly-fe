import React, { useState } from 'react';
import './EntriesPage.scss';
import EmotionCapture from './components/EmotionCapture/EmotionCapture';
import ReflectionCapture from './components/ReflectionCapture/ReflectionCapture';
import { Emotion } from '../../models/emotion';
import type { CreateEntryRequest } from '../../models/entry';
import { entriesService } from '../../services/entriesService';

type Step = 'emotion-capture' | 'reflection-capture';

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
      {currentStep === 'emotion-capture' && (
        <EmotionCapture
          selectedEmotions={selectedEmotions}
          onEmotionToggle={handleEmotionToggle}
          onNext={handleNext}
          maxSelections={10}
        />
      )}
      
      {currentStep === 'reflection-capture' && (
        <ReflectionCapture
          selectedEmotions={selectedEmotions}
          onBack={handleBack}
          onSave={handleSave}
          isLoading={isLoading}
        />
      )}
    </main>
  );
};

export default EntriesPage;