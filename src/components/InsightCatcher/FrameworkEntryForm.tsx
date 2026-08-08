import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';
import { usePeopleQuery } from '../../queries/peopleQueryHook';
import type { FrameworkType, LifePosition } from '../../models/savedFrameworkEntry';

interface FrameworkEntryFormProps {
  frameworkType: FrameworkType;
  initialTitle?: string;
  initialPayload?: Record<string, unknown>;
  initialPersonId?: string;
  onSubmit: (title: string | undefined, payload: Record<string, unknown>, personId?: string) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

const FIELD_CLASSES =
  'w-full min-w-0 rounded-lg border border-coach-border bg-coach-bg px-3 py-2 text-sm text-coach-text outline-none focus:border-coach-primary';

const LIFE_POSITIONS: LifePosition[] = ['I_OK_YOU_OK', 'I_OK_YOU_NOT_OK', 'I_NOT_OK_YOU_OK', 'I_NOT_OK_YOU_NOT_OK'];

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

/** Strips common markdown markup (headers, bold/italic, list bullets, inline code) so AI-generated
 * text (e.g. the session summary) can seed a plain-text form field without literal `**`/`#` noise. */
export const stripMarkdown = (text: string): string =>
  text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/`(.+?)`/g, '$1')
    .trim();

/**
 * Shared create/edit form for a saved framework entry — reused by InsightCatcherPanel (creating
 * one mid-chat) and SavedFrameworkEntryCard (editing one on "Đúc kết"). Renders different fields
 * per frameworkType; LIFE_POSITIONS additionally requires picking an existing person (relationship
 * map) since it's always about one specific relationship.
 */
const FrameworkEntryForm = ({
  frameworkType,
  initialTitle,
  initialPayload,
  initialPersonId,
  onSubmit,
  onCancel,
  submitLabel,
}: FrameworkEntryFormProps) => {
  const { t } = useTranslation();
  const { data: people } = usePeopleQuery();

  const [title, setTitle] = useState(initialTitle ?? '');

  // FREEFORM
  const [content, setContent] = useState(asString(initialPayload?.content));
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(initialPayload?.tags) ? (initialPayload!.tags as string[]).join(', ') : '',
  );

  // JOHARI_WINDOW
  const [open, setOpen] = useState(asString(initialPayload?.open));
  const [blind, setBlind] = useState(asString(initialPayload?.blind));
  const [hidden, setHidden] = useState(asString(initialPayload?.hidden));
  const [unknown, setUnknown] = useState(asString(initialPayload?.unknown));

  // ACT_MATRIX
  const [fiveSenses, setFiveSenses] = useState(asString(initialPayload?.fiveSenses));
  const [values, setValues] = useState(asString(initialPayload?.values));
  const [awayMoves, setAwayMoves] = useState(asString(initialPayload?.awayMoves));
  const [towardMoves, setTowardMoves] = useState(asString(initialPayload?.towardMoves));

  // PERSONAL_SWOT
  const [strengths, setStrengths] = useState(asString(initialPayload?.strengths));
  const [weaknesses, setWeaknesses] = useState(asString(initialPayload?.weaknesses));
  const [opportunities, setOpportunities] = useState(asString(initialPayload?.opportunities));
  const [threats, setThreats] = useState(asString(initialPayload?.threats));

  // LIFE_POSITIONS
  const [personId, setPersonId] = useState(initialPersonId ?? '');
  const [position, setPosition] = useState<LifePosition>((initialPayload?.position as LifePosition) ?? 'I_OK_YOU_OK');
  const [notes, setNotes] = useState(asString(initialPayload?.notes));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    let payload: Record<string, unknown>;
    let resolvedPersonId: string | undefined;

    if (frameworkType === 'FREEFORM') {
      if (!content.trim()) {
        setError(t('insightCatcher.freeform.contentRequired'));
        return;
      }
      const tags = tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean);
      payload = { content: content.trim(), ...(tags.length > 0 ? { tags } : {}) };
    } else if (frameworkType === 'JOHARI_WINDOW') {
      if (!open.trim() && !blind.trim() && !hidden.trim() && !unknown.trim()) {
        setError(t('insightCatcher.johari.atLeastOneRequired'));
        return;
      }
      payload = { open: open.trim(), blind: blind.trim(), hidden: hidden.trim(), unknown: unknown.trim() };
    } else if (frameworkType === 'ACT_MATRIX') {
      if (!fiveSenses.trim() && !values.trim() && !awayMoves.trim() && !towardMoves.trim()) {
        setError(t('insightCatcher.actMatrixForm.atLeastOneRequired'));
        return;
      }
      payload = {
        fiveSenses: fiveSenses.trim(),
        values: values.trim(),
        awayMoves: awayMoves.trim(),
        towardMoves: towardMoves.trim(),
      };
    } else if (frameworkType === 'PERSONAL_SWOT') {
      if (!strengths.trim() && !weaknesses.trim() && !opportunities.trim() && !threats.trim()) {
        setError(t('insightCatcher.swotForm.atLeastOneRequired'));
        return;
      }
      payload = {
        strengths: strengths.trim(),
        weaknesses: weaknesses.trim(),
        opportunities: opportunities.trim(),
        threats: threats.trim(),
      };
    } else {
      // LIFE_POSITIONS
      if (!personId) {
        setError(t('insightCatcher.lifePositionsForm.personRequired'));
        return;
      }
      payload = { position, notes: notes.trim() };
      resolvedPersonId = personId;
    }

    setError(null);
    setSaving(true);
    try {
      await onSubmit(title.trim() || undefined, payload, resolvedPersonId);
    } catch {
      setError(t('insightCatcher.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {frameworkType === 'LIFE_POSITIONS' ? (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-coach-text-muted">
              {t('insightCatcher.lifePositionsForm.person')}
            </label>
            {people && people.length > 0 ? (
              <select value={personId} onChange={(e) => setPersonId(e.target.value)} className={FIELD_CLASSES}>
                <option value="">{t('insightCatcher.lifePositionsForm.personPlaceholder')}</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-coach-text-muted">{t('insightCatcher.lifePositionsForm.noPeople')}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-coach-text-muted">
              {t('insightCatcher.lifePositionsForm.position')}
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as LifePosition)}
              className={FIELD_CLASSES}
            >
              {LIFE_POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {t(`insightCatcher.lifePositionsForm.positions.${pos}`)}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('insightCatcher.lifePositionsForm.notesPlaceholder') as string}
            rows={3}
            className={FIELD_CLASSES}
          />
        </>
      ) : (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('insightCatcher.titlePlaceholder') as string}
            className={FIELD_CLASSES}
          />

          {frameworkType === 'FREEFORM' && (
            <>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('insightCatcher.freeform.contentPlaceholder') as string}
                rows={4}
                className={FIELD_CLASSES}
              />
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder={t('insightCatcher.freeform.tagsPlaceholder') as string}
                className={FIELD_CLASSES}
              />
            </>
          )}

          {frameworkType === 'JOHARI_WINDOW' && (
            <>
              <FormField label={t('insightCatcher.johari.open')} value={open} onChange={setOpen} />
              <FormField label={t('insightCatcher.johari.blind')} value={blind} onChange={setBlind} />
              <FormField label={t('insightCatcher.johari.hidden')} value={hidden} onChange={setHidden} />
              <FormField label={t('insightCatcher.johari.unknown')} value={unknown} onChange={setUnknown} />
            </>
          )}

          {frameworkType === 'ACT_MATRIX' && (
            <>
              <FormField label={t('insightCatcher.actMatrixForm.fiveSenses')} value={fiveSenses} onChange={setFiveSenses} />
              <FormField label={t('insightCatcher.actMatrixForm.values')} value={values} onChange={setValues} />
              <FormField label={t('insightCatcher.actMatrixForm.awayMoves')} value={awayMoves} onChange={setAwayMoves} />
              <FormField label={t('insightCatcher.actMatrixForm.towardMoves')} value={towardMoves} onChange={setTowardMoves} />
            </>
          )}

          {frameworkType === 'PERSONAL_SWOT' && (
            <>
              <FormField label={t('insightCatcher.swotForm.strengths')} value={strengths} onChange={setStrengths} />
              <FormField label={t('insightCatcher.swotForm.weaknesses')} value={weaknesses} onChange={setWeaknesses} />
              <FormField label={t('insightCatcher.swotForm.opportunities')} value={opportunities} onChange={setOpportunities} />
              <FormField label={t('insightCatcher.swotForm.threats')} value={threats} onChange={setThreats} />
            </>
          )}
        </>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleSubmit} disabled={saving}>
          {saving ? t('insightCatcher.saving') : submitLabel}
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={saving}>
          {t('insightCatcher.cancel')}
        </Button>
      </div>
    </div>
  );
};

const FormField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-coach-text-muted">{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className={FIELD_CLASSES} />
  </div>
);

export default FrameworkEntryForm;
