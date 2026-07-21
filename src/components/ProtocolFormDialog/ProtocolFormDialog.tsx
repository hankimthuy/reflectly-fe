import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ActionProtocol } from '../../models/actionProtocol';
import { useCreateActionProtocolMutation, useUpdateActionProtocolMutation } from '../../queries/actionProtocolQueryHook';
import { useSnackbar } from '../../providers/SnackbarProvider';
import './ProtocolFormDialog.scss';

export interface ProtocolFormDialogProps {
  open: boolean;
  onClose: () => void;
  protocol?: ActionProtocol | null;
}

const ProtocolFormDialog: React.FC<ProtocolFormDialogProps> = ({ open, onClose, protocol }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const createProtocol = useCreateActionProtocolMutation();
  const updateProtocol = useUpdateActionProtocolMutation();

  const isEditing = !!protocol;
  const isPending = createProtocol.isPending || updateProtocol.isPending;

  const [title, setTitle] = useState('');
  const [trigger, setTrigger] = useState('');
  const [script, setScript] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(protocol?.title ?? '');
      setTrigger(protocol?.trigger ?? '');
      setScript(protocol?.script ?? '');
    }
  }, [open, protocol]);

  const resetAndClose = () => {
    setTitle('');
    setTrigger('');
    setScript('');
    onClose();
  };

  const canSave = title.trim().length > 0 && trigger.trim().length > 0 && script.trim().length > 0;

  const handleSave = () => {
    if (!canSave || isPending) {
      return;
    }

    const payload = { title: title.trim(), trigger: trigger.trim(), script: script.trim() };

    const onSuccess = () => {
      showSnackbar(
        isEditing ? t('actionProtocol.form.updatedMessage') : t('actionProtocol.form.savedMessage'),
        'success'
      );
      resetAndClose();
    };
    const onError = () => showSnackbar(t('actionProtocol.form.errorMessage'), 'error');

    if (isEditing && protocol) {
      updateProtocol.mutate({ id: protocol.id, protocol: payload }, { onSuccess, onError });
    } else {
      createProtocol.mutate(payload, { onSuccess, onError });
    }
  };

  return (
    <Dialog open={open} onClose={resetAndClose} maxWidth="sm" fullWidth className="protocol-form-dialog">
      <DialogContent className="protocol-form-dialog__content">
        <h2 className="protocol-form-dialog__title">
          {isEditing ? t('actionProtocol.form.editTitle') : t('actionProtocol.form.createTitle')}
        </h2>

        <p className="protocol-form-dialog__label">{t('actionProtocol.form.titleLabel')}</p>
        <input
          className="protocol-form-dialog__input"
          type="text"
          maxLength={255}
          placeholder={t('actionProtocol.form.titlePlaceholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p className="protocol-form-dialog__label">{t('actionProtocol.form.triggerLabel')}</p>
        <input
          className="protocol-form-dialog__input"
          type="text"
          maxLength={255}
          placeholder={t('actionProtocol.form.triggerPlaceholder')}
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
        />

        <p className="protocol-form-dialog__label">{t('actionProtocol.form.scriptLabel')}</p>
        <textarea
          className="protocol-form-dialog__textarea"
          maxLength={5000}
          placeholder={t('actionProtocol.form.scriptPlaceholder')}
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />

        <div className="protocol-form-dialog__actions">
          <button type="button" className="protocol-form-dialog__cancel" onClick={resetAndClose}>
            {t('actionProtocol.form.cancel')}
          </button>
          <button
            type="button"
            className="protocol-form-dialog__save"
            disabled={!canSave || isPending}
            onClick={handleSave}
          >
            {isPending ? t('actionProtocol.form.saving') : t('actionProtocol.form.save')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProtocolFormDialog;
