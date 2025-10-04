import React, { useState } from 'react';
import { Emotion } from '../../../../models/emotion';
import EmotionCapture from '../EmotionCapture/EmotionCapture';
import ReflectionCapture from '../ReflectionCapture/ReflectionCapture';
import './EntriesModal.scss';
import type { CreateEntryRequest } from '../../../../models/entry';

interface EntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: CreateEntryRequest) => Promise<void>;
}

type Step = 'emotion-capture' | 'reflection-capture';

const EntriesModal: React.FC<EntriesModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('emotion-capture');
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
      
      await onSave(entry);
      
      // Reset state and close modal
      setCurrentStep('emotion-capture');
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
        </div>
      </div>
    </div>
  );
};

export default EntriesModal;