import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { usePeopleQuery, useCreatePersonMutation } from '../../queries/peopleQueryHook';
import RelationshipMap from '../../components/RelationshipMap/RelationshipMap';
import InsightTimelineList from '../../components/InsightTimeline/InsightTimelineList';
import CoreValuesCard from '../../components/CoreValuesCard/CoreValuesCard';
import PersonForm from '../../components/PersonForm/PersonForm';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { Button, ButtonLink } from '../../components/Button/Button';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import { completeOnboarding } from '../../services/userService';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { data: people, isLoading } = usePeopleQuery();
  const { currentUser, setCurrentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const createPerson = useCreatePersonMutation();

  const handleSaveValues = async (values: string[]) => {
    const updatedUser = await completeOnboarding({ coreValues: values, people: [] });
    setCurrentUser(updatedUser);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 bg-coach-bg px-4 py-8 sm:px-6">
      <div>
        <Breadcrumb
          variant="light"
          items={[{ label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME }, { label: t('breadcrumb.dashboard') }]}
        />
        <h1 className="mt-2 text-2xl font-bold text-coach-text [font-family:var(--font-family-heading)]">
          {t('dashboard.pageTitle')}
        </h1>
        <p className="mt-1 text-sm text-coach-text-muted">
          {t('dashboard.pageSubtitle')}
        </p>
      </div>

      <CoreValuesCard
        coreValues={currentUser?.coreValues}
        onSave={handleSaveValues}
        autoEdit={searchParams.get('editValues') === 'true'}
      />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-coach-text">
              {t('dashboard.mapTitle')}
            </h2>
            <p className="text-xs text-coach-text-muted">
              {t('dashboard.mapSubtitle')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsAddingPerson((prev) => !prev)}>
              {t('dashboard.person.add')}
            </Button>
            <ButtonLink to={APP_ROUTES.COACH_CHAT} variant="primary" size="sm">
              {t('dashboard.talkToCoach')}
            </ButtonLink>
          </div>
        </div>

        {isAddingPerson && (
          <div className="mb-3">
            <PersonForm
              submitLabel={t('dashboard.person.add')}
              onCancel={() => setIsAddingPerson(false)}
              onSubmit={async (person) => {
                await createPerson.mutateAsync(person);
                setIsAddingPerson(false);
              }}
            />
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-coach-text-muted">{t('dashboard.loading')}</p>
        ) : (
          <RelationshipMap
            people={people ?? []}
            emptyLabel={t('dashboard.mapEmpty')}
          />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-coach-text">
          {t('dashboard.insightsTitle')}
        </h2>
        <InsightTimelineList />
      </section>
    </div>
  );
};

export default DashboardPage;
