import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../providers/AuthProvider';
import { useCompleteOnboardingMutation } from '../../queries/authQueryHook';
import type { RelationshipType } from '../../models/person';
import { APP_ROUTES } from '../../constants/route';
import { CORE_VALUE_KEYS } from '../../constants/coreValues';
import './OnboardingPage.scss';

const RELATIONSHIP_TYPES: RelationshipType[] = ['FAMILY', 'FRIEND', 'PARTNER', 'COLLEAGUE', 'MANAGER', 'OTHER'];

interface PersonRow {
  name: string;
  relationshipType: RelationshipType;
  notes: string;
}

const emptyRow = (): PersonRow => ({ name: '', relationshipType: 'FRIEND', notes: '' });

/** Two full-bleed steps, no app-shell chrome (see mockup 2c) — a person hasn't earned a
 * sidebar/tab bar yet, they've barely signed up. */
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
          navigate(APP_ROUTES.HOME);
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
    <div className="onboard">
      <div className="onboard__top">
        <div className="onboard__progress">
          <span className="onboard__progress-seg onboard__progress-seg--filled" />
          <span className={`onboard__progress-seg ${step === 2 ? 'onboard__progress-seg--filled' : ''}`} />
        </div>
        <div className="onboard__step">{t('onboarding.step', { current: step })}</div>
        <h2 className="onboard__title">{step === 1 ? t('onboarding.step1Title') : t('onboarding.step2Title')}</h2>
        <p className="onboard__subtitle">{step === 1 ? t('onboarding.step1Subtitle') : t('onboarding.step2Subtitle')}</p>
      </div>

      <div className="onboard__body">
        {step === 1 ? (
          <div className="onboard__tags">
            {CORE_VALUE_KEYS.map((key) => {
              const selected = selectedValues.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleValue(key)}
                  className={`tag ${selected ? 'tag-accent' : ''} onboard__tag-btn`}
                >
                  {t(`onboarding.value.${key}`)}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="onboard__people">
            {people.map((row, index) => (
              <div key={index} className="onboard__person-row">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => updatePerson(index, { name: e.target.value })}
                  placeholder={t('onboarding.namePlaceholder') as string}
                  className="onboard__person-name"
                />
                <select
                  value={row.relationshipType}
                  onChange={(e) => updatePerson(index, { relationshipType: e.target.value as RelationshipType })}
                  className="onboard__person-type"
                >
                  {RELATIONSHIP_TYPES.map((type) => (
                    <option key={type} value={type}>{t(`onboarding.relationshipType.${type}`)}</option>
                  ))}
                </select>
                {people.length > 1 && (
                  <button type="button" onClick={() => removePersonRow(index)} className="onboard__person-remove" aria-label={t('onboarding.removePerson') as string}>
                    ✕
                  </button>
                )}
              </div>
            ))}

            {people.length < 5 && (
              <button type="button" onClick={addPersonRow} className="onboard__add-person">
                <span>{t('onboarding.addPerson')}</span>
                <span className="onboard__add-person-plus">+</span>
              </button>
            )}

            <div className="onboard__relationship-types">
              <div className="onboard__section-label">{t('onboarding.relationshipTypesLabel')}</div>
              <div className="onboard__tags">
                {RELATIONSHIP_TYPES.map((type) => (
                  <span key={type} className="tag tag-neutral">{t(`onboarding.relationshipType.${type}`)}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && <p className="onboard__error">{error}</p>}
      </div>

      <div className="onboard__footer">
        {step === 1 ? (
          <div className="onboard__footer-note">{t('onboarding.chosenCount', { count: selectedValues.length })}</div>
        ) : (
          <div className="onboard__footer-row">
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>{t('onboarding.back')}</button>
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary btn-block onboard__continue"
          onClick={step === 1 ? handleContinue : handleSubmit}
          disabled={mutation.isPending}
        >
          {step === 1 ? t('onboarding.continue') : mutation.isPending ? t('onboarding.submitting') : t('onboarding.finish')}
        </button>
        <button
          type="button"
          className="btn btn-ghost onboard__skip"
          onClick={step === 1 ? handleSkipStep1 : handleSkipStep2}
          disabled={mutation.isPending}
        >
          {step === 1 ? t('onboarding.skipStep') : t('onboarding.skipToCoach')}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
