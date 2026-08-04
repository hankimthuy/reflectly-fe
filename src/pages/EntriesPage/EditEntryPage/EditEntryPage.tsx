import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuLock, LuCheck, LuArrowLeft } from 'react-icons/lu';
import { CircularProgress } from '@mui/material';
import EmotionCapture from '../components/EmotionCapture/EmotionCapture';
import ReflectionCapture from '../components/ReflectionCapture/ReflectionCapture';
import { Emotion } from '../../../models/emotion';
import { getEntryTemplate } from '../../../models/entryTemplate';
import { entriesService } from '../../../services/entriesService';
import { useUpdateEntryMutation } from '../../../queries/entriesQueryHook';
import { APP_ROUTES } from '../../../constants/route';
import { useSnackbar } from '../../../providers/SnackbarProvider';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import type { Entry } from '../../../models/entry';
import './EditEntryPage.scss';

const EditEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const updateEntryMutation = useUpdateEntryMutation();

  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [reflectionTitle, setReflectionTitle] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const reflectionRef = useRef<HTMLDivElement>(null);

  const selectedTemplate = getEntryTemplate(entry?.templateKey);
  const guidingPrompts = selectedTemplate?.questionKeys.map((key) => t(key));

  useEffect(() => {
    if (!id) return;
    entriesService.getEntry(id)
      .then((data) => {
        setEntry(data);
        const validEmotions = data.emotions.filter((e): e is Emotion =>
          Object.values(Emotion).includes(e as Emotion)
        );
        setSelectedEmotions(validEmotions);
        setReflectionTitle(data.title);
        setReflectionText(data.reflection || '');
      })
      .catch(() => {
        showSnackbar(t('entriesPage.updateError'), 'error');
        navigate(APP_ROUTES.ENTRIES_LIST);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleEmotionToggle = (emotion: Emotion) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleFormChange = (title: string, reflection: string) => {
    setReflectionTitle(title);
    setReflectionText(reflection);
  };

  const handleSave = () => {
    if (!id || !reflectionTitle.trim() || !reflectionText.trim()) return;

    updateEntryMutation.mutate(
      {
        id,
        title: reflectionTitle.trim(),
        reflection: reflectionText.trim(),
        emotions: selectedEmotions,
        ...(entry?.templateKey ? { templateKey: entry.templateKey } : {}),
      },
      {
        onSuccess: () => {
          showSnackbar(t('entriesPage.updateSuccess'), 'success', 5000, t('newEntryPage.successTitle'));
          navigate(APP_ROUTES.ENTRIES_LIST);
        },
        onError: () => {
          showSnackbar(t('entriesPage.updateError'), 'error', 5000, t('newEntryPage.errorTitle'));
        },
      }
    );
  };

  const canSave = reflectionTitle.trim() && reflectionText.trim() && selectedEmotions.length > 0;

  if (loading) {
    return (
      <div className="safe-space">
        <div className="safe-space__glow" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: '30vh' }}>
          <CircularProgress size={32} />
        </div>
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="safe-space">
      <div className="safe-space__glow" />

      {/* Header */}
      <div className="safe-space__header">
        <Breadcrumb
          variant="dark"
          items={[
            { label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME },
            { label: t('breadcrumb.journal'), path: APP_ROUTES.ENTRIES_LIST },
            { label: t('entriesPage.editTitle') },
          ]}
        />
        <h1 className="safe-space__title">{t('entriesPage.editTitle')}</h1>
        <p className="safe-space__subtitle">{t('entriesPage.editSubtitle')}</p>
      </div>

      {/* Content */}
      <div className="safe-space__content">
        <div className="safe-space__card">
          {/* Emotion Section */}
          <EmotionCapture
            selectedEmotions={selectedEmotions}
            onEmotionToggle={handleEmotionToggle}
            maxSelections={10}
          />

          {/* Reflection Section */}
          {selectedEmotions.length > 0 && (
            <div className="safe-space__reflection" ref={reflectionRef}>
              <div className="safe-space__divider" />
              <ReflectionCapture
                selectedEmotions={selectedEmotions}
                onFormChange={handleFormChange}
                initialTitle={entry.title}
                initialReflection={entry.reflection || ''}
                guidingPrompts={guidingPrompts}
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Footer */}
      {selectedEmotions.length > 0 && (
        <div className={`safe-space__footer ${canSave ? 'safe-space__footer--active' : ''}`}>
          <button
            className="safe-space__back-btn"
            onClick={() => navigate(APP_ROUTES.ENTRIES_LIST)}
          >
            <LuArrowLeft size={16} />
            <span>{t('breadcrumb.journal')}</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="safe-space__privacy">
              <LuLock size={14} />
              <span>{t('newEntryPage.privacy')}</span>
            </div>
            <button
              className="safe-space__save-btn"
              onClick={handleSave}
              disabled={!canSave || updateEntryMutation.isPending}
            >
              {updateEntryMutation.isPending ? (
                <span>{t('newEntryPage.saving')}</span>
              ) : (
                <>
                  <LuCheck size={18} />
                  <span>{t('newEntryPage.save')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEntryPage;
