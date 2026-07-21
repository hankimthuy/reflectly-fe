import React, { useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EffectivenessLevel } from '../../models/actionProtocol';
import { useMarkActionProtocolUsedMutation } from '../../queries/actionProtocolQueryHook';
import { useSnackbar } from '../../providers/SnackbarProvider';
import './MarkProtocolUsedDialog.scss';

export interface MarkProtocolUsedDialogProps {
  open: boolean;
  protocolId: string | null;
  onClose: () => void;
}

const EFFECTIVENESS_OPTIONS: EffectivenessLevel[] = [
  EffectivenessLevel.WORKED,
  EffectivenessLevel.PARTIAL,
  EffectivenessLevel.DIDNT_WORK
];

const MarkProtocolUsedDialog: React.FC<MarkProtocolUsedDialogProps> = ({ open, protocolId, onClose }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const markUsed = useMarkActionProtocolUsedMutation();

  const [effectiveness, setEffectiveness] = useState<EffectivenessLevel | null>(null);
  const [note, setNote] = useState('');

  const resetAndClose = () => {
    setEffectiveness(null);
    setNote('');
    onClose();
  };

  const handleSave = () => {
    if (!protocolId || !effectiveness || markUsed.isPending) {
      return;
    }

    markUsed.mutate(
      { id: protocolId, payload: { effectiveness, note: note.trim() || undefined } },
      {
        onSuccess: () => {
          showSnackbar(t('actionProtocol.markUsed.savedMessage'), 'success');
          resetAndClose();
        },
        onError: () => {
          showSnackbar(t('actionProtocol.markUsed.errorMessage'), 'error');
        },
      }
    );
  };

  const canSave = effectiveness !== null;

  return (
    <Dialog open={open} onClose={resetAndClose} maxWidth="xs" fullWidth className="mark-protocol-used-dialog">
      <DialogContent className="mark-protocol-used-dialog__content">
        <h2 className="mark-protocol-used-dialog__title">{t('actionProtocol.markUsed.title')}</h2>
        <p className="mark-protocol-used-dialog__subtitle">{t('actionProtocol.markUsed.subtitle')}</p>

        <div className="mark-protocol-used-dialog__options">
          {EFFECTIVENESS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`mark-protocol-used-dialog__option ${effectiveness === option ? 'mark-protocol-used-dialog__option--selected' : ''}`}
              onClick={() => setEffectiveness(option)}
            >
              {t(`actionProtocol.effectiveness.${option}`)}
            </button>
          ))}
        </div>

        <textarea
          className="mark-protocol-used-dialog__notes"
          placeholder={t('actionProtocol.markUsed.notePlaceholder')}
          value={note}
          maxLength={500}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="mark-protocol-used-dialog__actions">
          <button type="button" className="mark-protocol-used-dialog__cancel" onClick={resetAndClose}>
            {t('actionProtocol.markUsed.cancel')}
          </button>
          <button
            type="button"
            className="mark-protocol-used-dialog__save"
            disabled={!canSave || markUsed.isPending}
            onClick={handleSave}
          >
            {markUsed.isPending ? t('actionProtocol.markUsed.saving') : t('actionProtocol.markUsed.save')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarkProtocolUsedDialog;
