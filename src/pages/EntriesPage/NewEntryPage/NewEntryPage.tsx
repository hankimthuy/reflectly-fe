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
      
      showSnackbar('Your reflection has been saved successfully!', 'success', 5000, 'Well done!');
      navigate(APP_ROUTES.ENTRIES_LIST);
    } catch {
      showSnackbar('Your reflection has not been saved yet!', 'error', 5000, 'Error');
    } 
    finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (title: string, reflection: string) => {
    setReflectionTitle(title);
    setReflectionText(reflection);
  };

  return (
    <div className="entries-page">
      {/* LEFT SIDE - Dark section */}
      <div className="entries-page__left">
        <div className="bg-blob"></div>
        <div className="content">
          <h1 style={{ color: 'var(--c-text-on-dark)', fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
            New Entry
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', lineHeight: '1.6' }}>
            Capture your thoughts and emotions in this moment of reflection.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Light section */}
      <div className="entries-page__right">
        <div className="bg-blob"></div>
        <div className="content">
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

          <div className="entries-content">
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
        </div>
      </div>
    </div>
  );
};

export default NewEntryPage;