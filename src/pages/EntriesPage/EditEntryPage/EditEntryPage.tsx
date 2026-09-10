import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../NewEntryPage/EntryEditor.scss';
import EmotionCapture from '../components/EmotionCapture/EmotionCapture';
import ReflectionCapture from '../components/ReflectionCapture/ReflectionCapture';
import { Emotion } from '../../../models/emotion';
import { getEntryTemplate } from '../../../models/entryTemplate';
import { entriesService } from '../../../services/entriesService';
import { useUpdateEntryMutation, useDeleteEntryMutation } from '../../../queries/entriesQueryHook';
import { reflectTabPath, APP_ROUTES } from '../../../constants/route';
import { useSnackbar } from '../../../providers/SnackbarProvider';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import Loading from '../../../components/Loading/Loading';
import type { Entry } from '../../../models/entry';

const EditEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const updateEntryMutation = useUpdateEntryMutation();
  const deleteEntryMutation = useDeleteEntryMutation();

  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [reflectionTitle, setReflectionTitle] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const selectedTemplate = getEntryTemplate(entry?.templateKey);
  const guidingPrompts = selectedTemplate?.questionKeys.map((key) => t(key));

  useEffect(() => {
    if (!id) return;
    entriesService.getEntry(id)
      .then((data) => {
        setEntry(data);
        const validEmotions = data.emotions.filter((e): e is Emotion => Object.values(Emotion).includes(e as Emotion));
        setSelectedEmotions(validEmotions);
        setReflectionTitle(data.title);
        setReflectionText(data.reflection || '');
      })
      .catch(() => {
        showSnackbar(t('entriesPage.updateError'), 'error');
        navigate(reflectTabPath('journal'));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEmotionToggle = (emotion: Emotion) => {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]));
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
          navigate(reflectTabPath('journal'));
        },
        onError: () => {
          showSnackbar(t('entriesPage.updateError'), 'error', 5000, t('newEntryPage.errorTitle'));
        },
      },
    );
  };

  const handleDelete = () => {
    if (!id) return;
    deleteEntryMutation.mutate(id, {
      onSuccess: () => {
        showSnackbar(t('entriesPage.deleteSuccess'), 'success', 5000);
        navigate(reflectTabPath('journal'));
      },
      onError: () => {
        showSnackbar(t('entriesPage.deleteError'), 'error', 5000);
        setDeleteDialogOpen(false);
      },
    });
  };

  const canSave = reflectionTitle.trim() && reflectionText.trim();

  if (loading) return <Loading message={t('dashboard.loading') as string} fullHeight />;
  if (!entry) return null;

  return (
    <div className="entry-editor">
      <div className="entry-editor__topbar">
        <button type="button" className="btn btn-ghost" onClick={() => navigate(reflectTabPath('journal'))}>
          {t('newEntryPage.cancel')}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setDeleteDialogOpen(true)}>
          {t('entriesPage.deleteConfirmBtn')}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!canSave || updateEntryMutation.isPending}>
          {updateEntryMutation.isPending ? t('newEntryPage.saving') : t('newEntryPage.save')}
        </button>
      </div>

      <div className="entry-editor__body">
        <EmotionCapture selectedEmotions={selectedEmotions} onEmotionToggle={handleEmotionToggle} maxSelections={10} />
        <ReflectionCapture
          onFormChange={(title, reflection) => { setReflectionTitle(title); setReflectionText(reflection); }}
          initialTitle={entry.title}
          initialReflection={entry.reflection || ''}
          guidingPrompts={guidingPrompts}
          templateLabel={selectedTemplate ? t(selectedTemplate.labelKey) : undefined}
        />
      </div>

      <div className="entry-editor__footer">
        <span />
        <button type="button" className="btn btn-ghost entry-editor__talk-instead" onClick={() => navigate(APP_ROUTES.COACH_CHAT)}>
          {t('newEntryPage.talkInstead')}
        </button>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('entriesPage.deleteConfirmTitle')}
        message={t('entriesPage.deleteConfirmMessage')}
        confirmText={t('entriesPage.deleteConfirmBtn')}
        cancelText={t('entriesPage.deleteCancel')}
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleteEntryMutation.isPending}
      />
    </div>
  );
};

export default EditEntryPage;
