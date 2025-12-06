import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewEntryPage.scss';
import EmotionCapture from '../components/EmotionCapture/EmotionCapture';
import ReflectionCapture from '../components/ReflectionCapture/ReflectionCapture';
import { Emotion } from '../../../models/emotion';
import type { CreateEntryRequest } from '../../../models/entry';
import { entriesService } from '../../../services/entriesService';
import { APP_ROUTES } from '../../../constants/route';
import { useSnackbar } from '../../../providers/SnackbarProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = ['Select Emotion', 'Write Reflection'];

const NewEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reflectionTitle, setReflectionTitle] = useState('');
  const [reflectionText, setReflectionText] = useState('');

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

  const handleSave = async () => {
    if (!reflectionTitle.trim() || !reflectionText.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const entry: CreateEntryRequest = {
        title: reflectionTitle.trim(),
        reflection: reflectionText.trim(),
        emotions: selectedEmotions,
      };

      await entriesService.createEntry(entry);
      
      showSuccess('Your reflection has been saved successfully!', undefined, 'Well done!');
      navigate(APP_ROUTES.ENTRIES_LIST);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (title: string, reflection: string) => {
    setReflectionTitle(title);
    setReflectionText(reflection);
  };

  return (
    <div className="entries-content">
      <div className="entry-header">
        <IconButton
          variant="plain"
          onClick={currentStep === 0 ? () => navigate(APP_ROUTES.HOME) : handleBack}
          className="back-button"
        >
          <ArrowBackIcon />
        </IconButton>
        
        <div className="stepper-container">
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel className="step-label">{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        <div className="header-action">
          {currentStep === 0 && selectedEmotions.length > 0 ? (
            <IconButton
              variant="plain"
              onClick={handleNext}
              className="next-button">
              <ArrowForwardIcon />
            </IconButton>
          ) : currentStep === 1 ? (
            <Button
              variant="solid"
              color="primary"
              startDecorator={<SaveIcon />}
              onClick={handleSave}
              disabled={!reflectionTitle.trim() || !reflectionText.trim() || isLoading}
              loading={isLoading}
              size="sm"
            >
              Save
            </Button>
          ) : (
            <div className="header-placeholder" />
          )}
        </div>
      </div>

      {currentStep === 0 && (
        <EmotionCapture
          selectedEmotions={selectedEmotions}
          onEmotionToggle={handleEmotionToggle}
          maxSelections={10}
        />
      )}

      {currentStep === 1 && (
        <ReflectionCapture
          selectedEmotions={selectedEmotions}
          onFormChange={handleFormChange}
        />
      )}
    </div>
  );
};

export default NewEntryPage;