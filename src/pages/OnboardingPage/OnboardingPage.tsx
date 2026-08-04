import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../providers/AuthProvider';
import { useCompleteOnboardingMutation } from '../../queries/authQueryHook';
import type { RelationshipType } from '../../models/person';
import { APP_ROUTES } from '../../constants/route';
import { CORE_VALUE_KEYS } from '../../constants/coreValues';

const RELATIONSHIP_TYPES: RelationshipType[] = ['FAMILY', 'FRIEND', 'PARTNER', 'COLLEAGUE', 'MANAGER', 'OTHER'];

interface PersonRow {
  name: string;
  relationshipType: RelationshipType;
  notes: string;
}

const emptyRow = (): PersonRow => ({ name: '', relationshipType: 'FRIEND', notes: '' });

const OnboardingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const mutation = useCompleteOnboardingMutation();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [people, setPeople] = useState<PersonRow[]>([emptyRow(), emptyRow(), emptyRow()]);
  const [error, setError] = useState<string | null>(null);

  const toggleValue = (key: string) => {
    setSelectedValues((prev) => (prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]));
  };

  const updatePerson = (index: number, patch: Partial<PersonRow>) => {
    setPeople((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addPersonRow = () => {
    if (people.length >= 5) return;
    setPeople((prev) => [...prev, emptyRow()]);
  };

  const removePersonRow = (index: number) => {
    if (people.length <= 1) return;
    setPeople((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (selectedValues.length === 0) {
      setError(t('onboarding.selectAtLeastOne', 'Chọn ít nhất một giá trị để tiếp tục.'));
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSkipStep1 = () => {
    setError(null);
    setStep(2);
  };

  const submit = (validPeople: PersonRow[]) => {
    setError(null);
    mutation.mutate(
      {
        coreValues: selectedValues,
        people: validPeople.map((row) => ({
          name: row.name.trim(),
          relationshipType: row.relationshipType,
          notes: row.notes.trim() || undefined,
        })),
      },
      {
        onSuccess: (user) => {
          setCurrentUser(user);
          navigate(APP_ROUTES.COACH_CHAT);
        },
        onError: () => {
          setError(t('onboarding.submitError', 'Có lỗi xảy ra, vui lòng thử lại.'));
        },
      },
    );
  };

  const handleSubmit = () => {
    const validPeople = people.filter((row) => row.name.trim().length > 0);
    if (validPeople.length === 0) {
      setError(t('onboarding.addAtLeastOnePerson', 'Thêm ít nhất một người, hoặc bấm "Bỏ qua, vào Coach luôn".'));
      return;
    }
    submit(validPeople);
  };

  const handleSkipStep2 = () => {
    const validPeople = people.filter((row) => row.name.trim().length > 0);
    submit(validPeople);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-lg flex-col justify-center gap-6 bg-coach-bg px-4 py-8">
      <div>
        <p className="text-xs font-medium text-coach-primary">
          {t('onboarding.step', 'Bước {{current}}/2', { current: step })}
        </p>
        <h1 className="mt-1 text-xl font-semibold text-coach-text">
          {step === 1
            ? t('onboarding.step1Title', 'Điều gì quan trọng với bạn?')
            : t('onboarding.step2Title', 'Ai là người quan trọng với bạn?')}
        </h1>
        <p className="mt-1 text-sm text-coach-text-muted">
          {step === 1
            ? t('onboarding.step1Subtitle', 'Chọn những giá trị cốt lõi cộng hưởng với bạn nhất.')
            : t('onboarding.step2Subtitle', 'Thêm 3-5 người bạn muốn theo dõi mối quan hệ cùng.')}
        </p>
      </div>

      {step === 1 ? (
        <div className="flex flex-wrap gap-2">
          {CORE_VALUE_KEYS.map((key) => {
            const selected = selectedValues.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleValue(key)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  selected
                    ? 'border-coach-primary bg-coach-primary text-white'
                    : 'border-coach-border bg-coach-surface text-coach-text hover:bg-coach-bg'
                }`}
              >
                {t(`onboarding.value.${key}`)}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {people.map((row, index) => (
            <div key={index} className="rounded-xl border border-coach-border bg-coach-surface p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => updatePerson(index, { name: e.target.value })}
                  placeholder={t('onboarding.namePlaceholder', 'Tên')}
                  className="flex-1 rounded-lg border border-coach-border bg-coach-bg px-3 py-2 text-sm text-coach-text outline-none focus:border-coach-primary"
                />
                <select
                  value={row.relationshipType}
                  onChange={(e) => updatePerson(index, { relationshipType: e.target.value as RelationshipType })}
                  className="rounded-lg border border-coach-border bg-coach-bg px-2 py-2 text-sm text-coach-text outline-none focus:border-coach-primary"
                >
                  {RELATIONSHIP_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`onboarding.relationshipType.${type}`)}
                    </option>
                  ))}
                </select>
                {people.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePersonRow(index)}
                    className="px-1.5 text-coach-text-muted hover:text-coach-text"
                    aria-label={t('onboarding.removePerson', 'Xóa') as string}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}

          {people.length < 5 && (
            <button
              type="button"
              onClick={addPersonRow}
              className="self-start rounded-lg border border-dashed border-coach-border px-3 py-1.5 text-xs font-medium text-coach-text-muted hover:bg-coach-surface"
            >
              {t('onboarding.addPerson', '+ Thêm người')}
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex items-center justify-between">
        {step === 2 ? (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-sm font-medium text-coach-text-muted hover:text-coach-text"
          >
            {t('onboarding.back', 'Quay lại')}
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={step === 1 ? handleContinue : handleSubmit}
          disabled={mutation.isPending}
          className="rounded-xl bg-coach-primary px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {step === 1
            ? t('onboarding.continue', 'Tiếp tục')
            : mutation.isPending
              ? t('onboarding.submitting', 'Đang lưu...')
              : t('onboarding.finish', 'Hoàn tất')}
        </button>
      </div>

      <button
        type="button"
        onClick={step === 1 ? handleSkipStep1 : handleSkipStep2}
        disabled={mutation.isPending}
        className="self-center text-xs text-coach-text-muted underline-offset-2 hover:underline disabled:opacity-50"
      >
        {step === 1
          ? t('onboarding.skipStep', 'Bỏ qua bước này')
          : t('onboarding.skipToCoach', 'Bỏ qua, vào Coach luôn')}
      </button>
    </div>
  );
};

export default OnboardingPage;
