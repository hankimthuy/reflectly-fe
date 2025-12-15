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
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';

const steps = ['Select Emotion', 'Write Reflection'];

const NewEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
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
      
      showSnackbar('Your reflection has been saved successfully!', 'success', undefined, 'Well done!');
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
    <div className="main-content">
      <div className="new-entry-frame">
        <div className="entry-header">
        <IconButton
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
              onClick={handleNext}
              className="next-button">
              <ArrowForwardIcon />
            </IconButton>
          ) : currentStep === 1 ? (
            <Button
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!reflectionTitle.trim() || !reflectionText.trim() || isLoading}
              loading={isLoading}>
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
    </div>
  );
};

export default NewEntryPage;