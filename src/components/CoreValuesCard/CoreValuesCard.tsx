import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CORE_VALUE_KEYS } from '../../constants/coreValues';

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
          {t('profilePage.coreValues.title', 'Giá trị cốt lõi')}
        </h3>
        {!isEditing && (
          <button
            type="button"
            onClick={startEdit}
            className="text-xs font-medium text-coach-primary hover:underline"
          >
            {hasValues ? t('profilePage.coreValues.edit', 'Chỉnh sửa') : t('profilePage.coreValues.add', '+ Thiết lập')}
          </button>
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
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-coach-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
            >
              {saving ? t('onboarding.submitting', 'Đang lưu...') : t('profilePage.coreValues.save', 'Lưu')}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="rounded-lg border border-coach-border px-3 py-1.5 text-xs font-medium text-coach-text-muted"
            >
              {t('onboarding.back', 'Hủy')}
            </button>
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
          {t('profilePage.coreValues.empty', 'Chưa thiết lập — Coach sẽ hiểu bạn hơn nếu bạn cho biết điều gì quan trọng với mình.')}
        </p>
      )}
    </section>
  );
};

export default CoreValuesCard;
