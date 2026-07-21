import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuLock, LuCheck } from 'react-icons/lu';
import './NewEntryPage.scss';
import EmotionCapture from '../components/EmotionCapture/EmotionCapture';
import ReflectionCapture from '../components/ReflectionCapture/ReflectionCapture';
import TemplatePicker from '../../../components/TemplatePicker/TemplatePicker';
import { Emotion } from '../../../models/emotion';
import type { CreateEntryRequest } from '../../../models/entry';
import { getEntryTemplate } from '../../../models/entryTemplate';
import { entriesService } from '../../../services/entriesService';
import { APP_ROUTES } from '../../../constants/route';
import { useSnackbar } from '../../../providers/SnackbarProvider';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';

const NewEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reflectionTitle, setReflectionTitle] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const reflectionRef = useRef<HTMLDivElement>(null);

  const selectedTemplate = getEntryTemplate(selectedTemplateKey);
  const guidingPrompts = selectedTemplate?.questionKeys.map((key) => t(key));

  const handleEmotionToggle = (emotion: Emotion) => {
    setSelectedEmotions(prev => {
      return prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion];
    });
  };

  // Scroll reflection section into view when first emotion is selected
  useEffect(() => {
    if (selectedEmotions.length === 1 && reflectionRef.current) {
      setTimeout(() => {
        reflectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [selectedEmotions.length]);

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
        ...(selectedTemplateKey ? { templateKey: selectedTemplateKey } : {}),
      };

      await entriesService.createEntry(entry);
      
      showSnackbar(t('newEntryPage.successMessage'), 'success', 5000, t('newEntryPage.successTitle'));
      navigate(APP_ROUTES.ENTRIES_LIST);
    } catch {
      showSnackbar(t('newEntryPage.errorMessage'), 'error', 5000, t('newEntryPage.errorTitle'));
    } 
    finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (title: string, reflection: string) => {
    setReflectionTitle(title);
    setReflectionText(reflection);
  };

  const canSave = reflectionTitle.trim() && reflectionText.trim() && selectedEmotions.length > 0;

  return (
    <div className="safe-space">
      <div className="safe-space__glow" />

      {/* Header */}
      <div className="safe-space__header">
        <Breadcrumb
          variant="dark"
          items={[
            { label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME },
            { label: t('breadcrumb.reflection'), path: APP_ROUTES.REFLECTION_ZONE },
            { label: t('breadcrumb.journal') },
          ]}
        />
        <h1 className="safe-space__title">{t('newEntryPage.title')}</h1>
        <p className="safe-space__subtitle">{t('newEntryPage.subtitle')}</p>
      </div>

      {/* Content */}
      <div className="safe-space__content">
        <div className="safe-space__card">
          {/* Template Section */}
          <TemplatePicker
            selectedTemplateKey={selectedTemplateKey}
            onSelect={setSelectedTemplateKey}
          />

          <div className="safe-space__divider" />

          {/* Emotion Section */}
          <EmotionCapture
            selectedEmotions={selectedEmotions}
            onEmotionToggle={handleEmotionToggle}
            maxSelections={10}
          />

          {/* Reflection Section — appears when emotions selected */}
          {selectedEmotions.length > 0 && (
            <div className="safe-space__reflection" ref={reflectionRef}>
              <div className="safe-space__divider" />
              <ReflectionCapture
                selectedEmotions={selectedEmotions}
                onFormChange={handleFormChange}
                guidingPrompts={guidingPrompts}
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Save */}
      {selectedEmotions.length > 0 && (
        <div className={`safe-space__footer ${canSave ? 'safe-space__footer--active' : ''}`}>
          <div className="safe-space__privacy">
            <LuLock size={14} />
            <span>{t('newEntryPage.privacy')}</span>
          </div>
          <button
            className="safe-space__save-btn"
            onClick={handleSave}
            disabled={!canSave || isLoading}
          >
            {isLoading ? (
              <span>{t('newEntryPage.saving')}</span>
            ) : (
              <>
                <LuCheck size={18} />
                <span>{t('newEntryPage.save')}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewEntryPage;