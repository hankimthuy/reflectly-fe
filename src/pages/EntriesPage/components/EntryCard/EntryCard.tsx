import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Entry } from '../../../../models/entry';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import './EntryCard.scss';
import { Emotion, EMOTION_DATA } from '../../../../models/emotion';
import { useDeleteEntryMutation } from '../../../../queries/entriesQueryHook';
import ConfirmDialog from '../../../../components/ConfirmDialog/ConfirmDialog';
import { useSnackbar } from '../../../../providers/SnackbarProvider';

interface EntryCardProps {
  entry: Entry;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const deleteEntryMutation = useDeleteEntryMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { dayDisplay, emotions, firstEmotionColor } = useMemo(() => {
    const dateObj = new Date(entry.createdAt);
    const validEmotions = entry.emotions.filter((e): e is Emotion =>
      Object.values(Emotion).includes(e as Emotion)
    );
    const firstColor = validEmotions[0] ? EMOTION_DATA[validEmotions[0]]?.color : undefined;
    return {
      dayDisplay: {
        month: dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        date: dateObj.getDate().toString().padStart(2, '0'),
        year: dateObj.getFullYear().toString(),
        dayShort: dateObj.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
      },
      emotions: validEmotions,
      firstEmotionColor: firstColor,
    };
  }, [entry.createdAt, entry.emotions]);

  const handleClick = () => {
    navigate(`/entries/edit/${entry.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteEntryMutation.mutate(entry.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        showSnackbar(t('entriesPage.deleteSuccess'), 'success', 5000);
      },
      onError: () => {
        showSnackbar(t('entriesPage.deleteError'), 'error', 5000);
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <div
        className="entry-cell"
        style={firstEmotionColor ? { '--entry-accent': firstEmotionColor } as React.CSSProperties : undefined}
        onClick={handleClick}
      >
        {/* Date column */}
        <div className="entry-cell__date">
          <span className="entry-cell__date-num">{dayDisplay.date}</span>
          <span className="entry-cell__date-month">{dayDisplay.month}</span>
          <span className="entry-cell__date-year">{dayDisplay.year}</span>
        </div>

        {/* Content */}
        <div className="entry-cell__body">
          <span className="entry-cell__day">{dayDisplay.dayShort}</span>
          <span className="entry-cell__title">{entry.title}</span>
          <div className="entry-cell__emotions">
            {emotions.map((emo) => (
              <span key={emo} className="entry-cell__emotion-icon" title={EMOTION_DATA[emo]?.label}>
                {EMOTION_DATA[emo]?.icon}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="entry-cell__actions">
          <span
            className="entry-cell__action entry-cell__action--edit"
            onClick={handleClick}
            title={t('entriesPage.edit')}
          >
            <LuPencil size={14} />
          </span>
          <span
            className="entry-cell__action entry-cell__action--delete"
            onClick={handleDeleteClick}
            title={t('entriesPage.deleteConfirmTitle')}
          >
            <LuTrash2 size={14} />
          </span>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('entriesPage.deleteConfirmTitle')}
        message={t('entriesPage.deleteConfirmMessage')}
        confirmText={t('entriesPage.deleteConfirmBtn')}
        cancelText={t('entriesPage.deleteCancel')}
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleteEntryMutation.isPending}
      />
    </>
  );
};

export default EntryCard;
