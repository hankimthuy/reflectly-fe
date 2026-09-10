import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './EntryEditor.scss';
import EmotionCapture from '../components/EmotionCapture/EmotionCapture';
import ReflectionCapture from '../components/ReflectionCapture/ReflectionCapture';
import TemplatePicker from '../../../components/TemplatePicker/TemplatePicker';
import { Emotion } from '../../../models/emotion';
import type { CreateEntryRequest } from '../../../models/entry';
import { getEntryTemplate } from '../../../models/entryTemplate';
import { entriesService } from '../../../services/entriesService';
import { APP_ROUTES, reflectTabPath } from '../../../constants/route';
import { useSnackbar } from '../../../providers/SnackbarProvider';

const NewEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reflectionTitle, setReflectionTitle] = useState('');
  const [reflectionText, setReflectionText] = useState('');

  const selectedTemplate = getEntryTemplate(selectedTemplateKey);
  const guidingPrompts = selectedTemplate?.questionKeys.map((key) => t(key));

  const handleEmotionToggle = (emotion: Emotion) => {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]));
  };

  const handleSave = async () => {
    if (!reflectionTitle.trim() || !reflectionText.trim()) return;
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
      navigate(reflectTabPath('journal'));
    } catch {
      showSnackbar(t('newEntryPage.errorMessage'), 'error', 5000, t('newEntryPage.errorTitle'));
    } finally {
      setIsLoading(false);
    }
  };

  const canSave = reflectionTitle.trim() && reflectionText.trim();

  return (
    <div className="entry-editor">
      <div className="entry-editor__topbar">
        <button type="button" className="btn btn-ghost" onClick={() => navigate(reflectTabPath('journal'))}>
          {t('newEntryPage.cancel')}
        </button>
        <span className="entry-editor__status">{t('newEntryPage.draft')}</span>
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!canSave || isLoading}>
          {isLoading ? t('newEntryPage.saving') : t('newEntryPage.save')}
        </button>
      </div>

      <div className="entry-editor__body">
        <EmotionCapture selectedEmotions={selectedEmotions} onEmotionToggle={handleEmotionToggle} maxSelections={10} />
        <ReflectionCapture
          onFormChange={(title, reflection) => { setReflectionTitle(title); setReflectionText(reflection); }}
          guidingPrompts={showPrompts ? guidingPrompts : undefined}
          templateLabel={selectedTemplate ? t(selectedTemplate.labelKey) : undefined}
        />
        {showPrompts && (
          <div className="entry-editor__template-picker">
            <TemplatePicker selectedTemplateKey={selectedTemplateKey} onSelect={setSelectedTemplateKey} />
          </div>
        )}
      </div>

      <div className="entry-editor__footer">
        <button type="button" className="btn btn-secondary" onClick={() => setShowPrompts((v) => !v)}>
          {t('newEntryPage.prompts')}
        </button>
        <button type="button" className="btn btn-ghost entry-editor__talk-instead" onClick={() => navigate(APP_ROUTES.COACH_CHAT)}>
          {t('newEntryPage.talkInstead')}
        </button>
      </div>
    </div>
  );
};

export default NewEntryPage;
