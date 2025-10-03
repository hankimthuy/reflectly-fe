import React, { useState } from 'react';
import { Emotion } from '../../../../models/emotion';
import { CreateEntryRequest } from '../../../../models/entry';
import EmotionSelectionStep from '../EmotionSelectionStep/EmotionSelectionStep';
import ReflectionLoggingStep from '../ReflectionLoggingStep/ReflectionLoggingStep';
import './EntriesModal.scss';

interface EntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: CreateEntryRequest) => Promise<void>;
}

type Step = 'emotion-selection' | 'reflection-logging';

const EntriesModal: React.FC<EntriesModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('emotion-selection');
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmotionToggle = (emotion: Emotion) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotion)) {
        return prev.filter(e => e !== emotion);
      } else {
        return [...prev, emotion];
      }
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
      
      await onSave(entry);
      
      // Reset state and close modal
      setCurrentStep('emotion-selection');
      setSelectedEmotions([]);
      onClose();
    } catch (error) {
      console.error('Failed to save entry:', error);
      // Handle error (could show toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="entries-modal-overlay">
      <div className="entries-modal">
        <div className="modal-content">
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
      </div>
    </div>
  );
};

export default EntriesModal;