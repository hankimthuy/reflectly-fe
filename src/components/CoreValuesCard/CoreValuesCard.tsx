import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CORE_VALUE_KEYS } from '../../constants/coreValues';
import './CoreValuesCard.scss';

interface CoreValuesCardProps {
  coreValues: string[] | undefined;
  onSave: (values: string[]) => Promise<void>;
  /** Opens straight into edit mode on mount — used when deep-linked from nav. */
  autoEdit?: boolean;
  className?: string;
}

/**
 * View/edit widget for a user's self-selected core values — see mockup 1d's "Core values · N of
 * 12 chosen" block. Shared by ProfilePage (settings context) and onboarding step 1 (first-pick
 * context) — same data, two entry points.
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
    <section className={className}>
      <div className="core-values-card__head">
        <span className="core-values-card__title">
          {t('profilePage.coreValues.title')}{hasValues ? ` · ${t('profilePage.coreValues.count', { count: coreValues!.length })}` : ''}
        </span>
        {!isEditing && (
          <button type="button" className="btn btn-ghost" onClick={startEdit}>
            {hasValues ? t('profilePage.coreValues.edit') : t('profilePage.coreValues.add')}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="core-values-card__edit">
          <div className="core-values-card__tags">
            {CORE_VALUE_KEYS.map((key) => {
              const selected = selectedValues.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleValue(key)}
                  className={`tag ${selected ? 'tag-accent' : ''} core-values-card__tag-btn`}
                >
                  {t(`onboarding.value.${key}`)}
                </button>
              );
            })}
          </div>
          <div className="core-values-card__actions">
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? t('onboarding.submitting') : t('profilePage.coreValues.save')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={saving}>
              {t('profilePage.coreValues.cancel')}
            </button>
          </div>
        </div>
      ) : hasValues ? (
        <div className="core-values-card__tags">
          {coreValues!.map((key) => (
            <span key={key} className="tag tag-accent">{t(`onboarding.value.${key}`, key)}</span>
          ))}
        </div>
      ) : (
        <p className="core-values-card__empty">{t('profilePage.coreValues.empty')}</p>
      )}
    </section>
  );
};

export default CoreValuesCard;
