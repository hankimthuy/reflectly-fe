import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CreatePersonRequest, RelationshipType } from '../../models/person';

const RELATIONSHIP_TYPES: RelationshipType[] = ['FAMILY', 'FRIEND', 'PARTNER', 'COLLEAGUE', 'MANAGER', 'OTHER'];

interface PersonFormProps {
  initialValue?: CreatePersonRequest;
  onSubmit: (person: CreatePersonRequest) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

/** Add/edit form for a single relationship-map person — shared by the "add person" flow on
 * Dashboard and the "edit person" flow when a RelationshipMap node is selected. */
const PersonForm = ({ initialValue, onSubmit, onCancel, submitLabel }: PersonFormProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialValue?.name ?? '');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(
    initialValue?.relationshipType ?? 'FRIEND',
  );
  const [notes, setNotes] = useState(initialValue?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t('dashboard.person.nameRequired', 'Nhập tên trước đã.'));
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), relationshipType, notes: notes.trim() || undefined });
    } catch {
      setError(t('dashboard.person.saveError', 'Có lỗi xảy ra, vui lòng thử lại.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-coach-border bg-coach-bg p-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('onboarding.namePlaceholder', 'Tên')}
          className="flex-1 rounded-lg border border-coach-border bg-coach-surface px-3 py-2 text-sm text-coach-text outline-none focus:border-coach-primary"
        />
        <select
          value={relationshipType}
          onChange={(e) => setRelationshipType(e.target.value as RelationshipType)}
          className="rounded-lg border border-coach-border bg-coach-surface px-2 py-2 text-sm text-coach-text outline-none focus:border-coach-primary"
        >
          {RELATIONSHIP_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`onboarding.relationshipType.${type}`)}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t('dashboard.person.notesPlaceholder', 'Ghi chú (tuỳ chọn)')}
        rows={2}
        className="rounded-lg border border-coach-border bg-coach-surface px-3 py-2 text-sm text-coach-text outline-none focus:border-coach-primary"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-lg bg-coach-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {saving ? t('onboarding.submitting', 'Đang lưu...') : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-coach-border px-3 py-1.5 text-xs font-medium text-coach-text-muted"
        >
          {t('onboarding.back', 'Hủy')}
        </button>
      </div>
    </div>
  );
};

export default PersonForm;
