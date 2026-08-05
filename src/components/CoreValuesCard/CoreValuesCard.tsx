import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CORE_VALUE_KEYS } from '../../constants/coreValues';
import { Button } from '../Button/Button';

interface CoreValuesCardProps {
  coreValues: string[] | undefined;
  onSave: (values: string[]) => Promise<void>;
  /** Opens straight into edit mode on mount — used when deep-linked from nav. */
  autoEdit?: boolean;
  className?: string;
}

/**
 * View/edit widget for a user's self-selected core values. Shared by ProfilePage (settings
 * context) and DashboardPage (self-understanding context) — same data, two entry points.
 */
const CoreValuesCard = ({ coreValues, onSave, autoEdit = false, className = '' }: CoreValuesCardProps) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(autoEdit);
  const [selectedValues, setSelectedValues] = useState<string[]>(coreValues ?? []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (autoEdit) {
      setSelectedValues(coreValues ?? []);
      setIsEditing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoEdit]);

  const startEdit = () => {
    setSelectedValues(coreValues ?? []);
    setIsEditing(true);
  };

  const toggleValue = (key: string) => {
    setSelectedValues((prev) => (prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(selectedValues);
      setIsEditing(false);
    } catch {
      // Error already surfaced by the caller (e.g. a snackbar) — keep editing open so they can retry.
    } finally {
      setSaving(false);
    }
  };

  const hasValues = coreValues && coreValues.length > 0;

  return (
    <section className={`rounded-2xl border border-coach-border bg-coach-surface p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-coach-text">
          {t('profilePage.coreValues.title')}
        </h3>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={startEdit}>
            {hasValues ? t('profilePage.coreValues.edit') : t('profilePage.coreValues.add')}
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {CORE_VALUE_KEYS.map((key) => {
              const selected = selectedValues.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleValue(key)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    selected
                      ? 'border-coach-primary bg-coach-primary text-white'
                      : 'border-coach-border bg-coach-bg text-coach-text hover:bg-coach-border'
                  }`}
                >
                  {t(`onboarding.value.${key}`)}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? t('onboarding.submitting') : t('profilePage.coreValues.save')}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)} disabled={saving}>
              {t('profilePage.coreValues.cancel')}
            </Button>
          </div>
        </div>
      ) : hasValues ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {coreValues!.map((key) => (
            <span
              key={key}
              className="rounded-full border border-coach-border bg-coach-bg px-3 py-1 text-xs text-coach-text"
            >
              {t(`onboarding.value.${key}`, key)}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-coach-text-muted">
          {t('profilePage.coreValues.empty')}
        </p>
      )}
    </section>
  );
};

export default CoreValuesCard;
