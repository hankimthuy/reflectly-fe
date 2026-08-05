import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../providers/AuthProvider';
import { useCompleteOnboardingMutation } from '../../queries/authQueryHook';
import type { RelationshipType } from '../../models/person';
import { APP_ROUTES } from '../../constants/route';
import { CORE_VALUE_KEYS } from '../../constants/coreValues';
import { Button } from '../../components/Button/Button';

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
      setError(t('onboarding.selectAtLeastOne'));
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
          setError(t('onboarding.submitError'));
        },
      },
    );
  };

  const handleSubmit = () => {
    const validPeople = people.filter((row) => row.name.trim().length > 0);
    if (validPeople.length === 0) {
      setError(t('onboarding.addAtLeastOnePerson'));
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
          {t('onboarding.step', { current: step })}
        </p>
        <h1 className="mt-1 text-xl font-semibold text-coach-text">
          {step === 1
            ? t('onboarding.step1Title')
            : t('onboarding.step2Title')}
        </h1>
        <p className="mt-1 text-sm text-coach-text-muted">
          {step === 1
            ? t('onboarding.step1Subtitle')
            : t('onboarding.step2Subtitle')}
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
                  placeholder={t('onboarding.namePlaceholder')}
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
                    className="cursor-pointer bg-transparent px-1.5 text-coach-text-muted transition-colors hover:text-coach-text"
                    aria-label={t('onboarding.removePerson') as string}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}

          {people.length < 5 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={addPersonRow}
              className="self-start border-dashed"
            >
              {t('onboarding.addPerson')}
            </Button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex items-center justify-between">
        {step === 2 ? (
          <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="!text-coach-text-muted">
            {t('onboarding.back')}
          </Button>
        ) : (
          <span />
        )}

        <Button variant="primary" size="md" onClick={step === 1 ? handleContinue : handleSubmit} disabled={mutation.isPending}>
          {step === 1
            ? t('onboarding.continue')
            : mutation.isPending
              ? t('onboarding.submitting')
              : t('onboarding.finish')}
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={step === 1 ? handleSkipStep1 : handleSkipStep2}
        disabled={mutation.isPending}
        className="!text-coach-text-muted self-center"
      >
        {step === 1
          ? t('onboarding.skipStep')
          : t('onboarding.skipToCoach')}
      </Button>
    </div>
  );
};

export default OnboardingPage;
