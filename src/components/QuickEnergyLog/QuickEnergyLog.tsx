import React, { useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CONTEXT_TAG_DATA, type ContextTag } from '../../models/energyLog';
import { useCreateEnergyLogMutation } from '../../queries/energyLogQueryHook';
import { useSnackbar } from '../../providers/SnackbarProvider';
import './QuickEnergyLog.scss';

export interface QuickEnergyLogProps {
  open: boolean;
  onClose: () => void;
}

const LEVELS = Array.from({ length: 10 }, (_, i) => i + 1);
const contextTags = Object.values(CONTEXT_TAG_DATA);

const QuickEnergyLog: React.FC<QuickEnergyLogProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const createEnergyLog = useCreateEnergyLogMutation();

  const [level, setLevel] = useState<number | null>(null);
  const [contextTag, setContextTag] = useState<ContextTag | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  const resetAndClose = () => {
    setLevel(null);
    setContextTag(null);
    setShowNotes(false);
    setNotes('');
    onClose();
  };

  const handleSave = () => {
    if (!level || !contextTag || createEnergyLog.isPending) {
      return;
    }

    createEnergyLog.mutate(
      { level, contextTag, notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          showSnackbar(t('energyLog.savedMessage'), 'success');
          resetAndClose();
        },
        onError: () => {
          showSnackbar(t('energyLog.errorMessage'), 'error');
        },
      }
    );
  };

  const canSave = level !== null && contextTag !== null;

  return (
    <Dialog open={open} onClose={resetAndClose} maxWidth="xs" fullWidth className="quick-energy-log">
      <DialogContent className="quick-energy-log__content">
        <h2 className="quick-energy-log__title">{t('energyLog.quickLogTitle')}</h2>

        <p className="quick-energy-log__label">{t('energyLog.levelLabel')}</p>
        <div className="quick-energy-log__levels">
          {LEVELS.map((value) => (
            <button
              key={value}
              type="button"
              className={`quick-energy-log__level ${level === value ? 'quick-energy-log__level--selected' : ''}`}
              onClick={() => setLevel(value)}
            >
              {value}
            </button>
          ))}
        </div>

        <p className="quick-energy-log__label">{t('energyLog.contextLabel')}</p>
        <div className="quick-energy-log__tags">
          {contextTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`quick-energy-log__tag ${contextTag === tag.id ? 'quick-energy-log__tag--selected' : ''}`}
              onClick={() => setContextTag(tag.id)}
            >
              <span className="quick-energy-log__tag-icon">{tag.icon}</span>
              <span>{tag.label}</span>
            </button>
          ))}
        </div>

        {showNotes ? (
          <textarea
            className="quick-energy-log__notes"
            placeholder={t('energyLog.notesPlaceholder')}
            value={notes}
            maxLength={1000}
            onChange={(e) => setNotes(e.target.value)}
          />
        ) : (
          <button type="button" className="quick-energy-log__notes-toggle" onClick={() => setShowNotes(true)}>
            {t('energyLog.notesLabel')}
          </button>
        )}

        <div className="quick-energy-log__actions">
          <button type="button" className="quick-energy-log__cancel" onClick={resetAndClose}>
            {t('energyLog.cancel')}
          </button>
          <button
            type="button"
            className="quick-energy-log__save"
            disabled={!canSave || createEnergyLog.isPending}
            onClick={handleSave}
          >
            {createEnergyLog.isPending ? t('energyLog.saving') : t('energyLog.save')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickEnergyLog;
