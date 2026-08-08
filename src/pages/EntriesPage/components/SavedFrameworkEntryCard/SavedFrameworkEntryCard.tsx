import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FrameworkType, SavedFrameworkEntry } from '../../../../models/savedFrameworkEntry';
import FrameworkEntryForm from '../../../../components/InsightCatcher/FrameworkEntryForm';
import { useUpdateSavedFrameworkEntryMutation } from '../../../../queries/savedFrameworkEntriesQueryHook';
import { useSnackbar } from '../../../../providers/SnackbarProvider';

interface SavedFrameworkEntryCardProps {
  entry: SavedFrameworkEntry;
  highlighted?: boolean;
}

const FRAMEWORK_LABEL_KEY: Record<FrameworkType, string> = {
  FREEFORM: 'insightCatcher.freeformLabel',
  JOHARI_WINDOW: 'insightCatcher.johariWindowLabel',
  ACT_MATRIX: 'insightCatcher.actMatrix',
  PERSONAL_SWOT: 'insightCatcher.personalSwot',
  LIFE_POSITIONS: 'insightCatcher.lifePositions',
};

const firstNonEmpty = (payload: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
};

const buildSnippet = (entry: SavedFrameworkEntry): string => {
  const payload = entry.payload as Record<string, unknown>;
  switch (entry.frameworkType) {
    case 'FREEFORM':
      return firstNonEmpty(payload, ['content']);
    case 'JOHARI_WINDOW':
      return firstNonEmpty(payload, ['open', 'hidden']);
    case 'ACT_MATRIX':
      return firstNonEmpty(payload, ['values', 'towardMoves']);
    case 'PERSONAL_SWOT':
      return firstNonEmpty(payload, ['strengths', 'weaknesses']);
    case 'LIFE_POSITIONS':
      return firstNonEmpty(payload, ['notes']);
    default:
      return '';
  }
};

/** Card for a saved framework entry on "Đúc kết" — click "Sửa" to edit in place using the same
 * form used to create it from the Aura chat's Insight Catcher panel. */
const SavedFrameworkEntryCard = ({ entry, highlighted }: SavedFrameworkEntryCardProps) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const updateEntry = useUpdateSavedFrameworkEntryMutation();

  const handleUpdate = async (title: string | undefined, payload: Record<string, unknown>, personId?: string) => {
    await updateEntry.mutateAsync({ id: entry.id, title, payload, personId });
    setIsEditing(false);
    showSnackbar(t('insightCatcher.updateSuccess'), 'success');
  };

  if (isEditing) {
    // Light card deliberately, styled the same as the create-flow form on the Coach page (the
    // coach-* palette has no dark-theme variant) — reads as a popover against the dark
    // "Đúc kết" background rather than blending into the page.
    return (
      <div id={`saved-entry-${entry.id}`} className="rounded-xl border border-coach-border bg-coach-surface p-4 shadow-lg">
        <FrameworkEntryForm
          frameworkType={entry.frameworkType}
          initialTitle={entry.title}
          initialPayload={entry.payload}
          initialPersonId={entry.personId}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          submitLabel={t('insightCatcher.saveChanges')}
        />
      </div>
    );
  }

  return (
    <div
      id={`saved-entry-${entry.id}`}
      className={`rounded-xl border p-4 transition-colors ${
        highlighted
          ? 'border-violet-400/60 bg-[rgba(30,41,59,0.75)] ring-2 ring-violet-400/40'
          : 'border-white/10 bg-[rgba(30,41,59,0.55)] hover:bg-[rgba(30,41,59,0.75)]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-slate-300">
          {t(FRAMEWORK_LABEL_KEY[entry.frameworkType])}
        </span>
        <button onClick={() => setIsEditing(true)} className="text-xs text-violet-300 hover:underline">
          {t('insightCatcher.edit')}
        </button>
      </div>
      {entry.title && <p className="mt-2 text-sm font-semibold text-slate-100">{entry.title}</p>}
      {entry.personName && (
        <p className="mt-1 text-xs text-violet-300">{t('insightCatcher.lifePositionsForm.about', { name: entry.personName })}</p>
      )}
      <p className="mt-1 line-clamp-3 text-sm text-slate-400">{buildSnippet(entry)}</p>
      <p className="mt-2 text-[11px] text-slate-500">{new Date(entry.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default SavedFrameworkEntryCard;
