import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CreatePersonRequest, RelationshipType } from '../../models/person';
import { Button } from '../Button/Button';

const RELATIONSHIP_TYPES: RelationshipType[] = ['FAMILY', 'FRIEND', 'PARTNER', 'COLLEAGUE', 'MANAGER', 'OTHER'];

interface PersonFormProps {
  initialValue?: CreatePersonRequest;
  onSubmit: (person: CreatePersonRequest) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

/** Add/edit form for a single relationship-map person — shared by Reflect's People tab, the
 * Catch panel's "Person" quick-add, and onboarding step 2. */
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
      setError(t('dashboard.person.nameRequired'));
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), relationshipType, notes: notes.trim() || undefined });
    } catch {
      setError(t('dashboard.person.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('onboarding.namePlaceholder') as string}
        className="input"
      />
      <select
        value={relationshipType}
        onChange={(e) => setRelationshipType(e.target.value as RelationshipType)}
        className="input"
      >
        {RELATIONSHIP_TYPES.map((type) => (
          <option key={type} value={type}>
            {t(`onboarding.relationshipType.${type}`)}
          </option>
        ))}
      </select>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t('dashboard.person.notesPlaceholder') as string}
        rows={2}
        className="input"
      />
      {error && <p className="text-xs" style={{ color: 'var(--color-clay)' }}>{error}</p>}
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleSubmit} disabled={saving}>
          {saving ? t('onboarding.submitting') : submitLabel}
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={saving}>
          {t('dashboard.person.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default PersonForm;
