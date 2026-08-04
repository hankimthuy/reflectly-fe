import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { usePeopleQuery, useCreatePersonMutation } from '../../queries/peopleQueryHook';
import RelationshipMap from '../../components/RelationshipMap/RelationshipMap';
import InsightTimelineList from '../../components/InsightTimeline/InsightTimelineList';
import CoreValuesCard from '../../components/CoreValuesCard/CoreValuesCard';
import PersonForm from '../../components/PersonForm/PersonForm';
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
    <div className="mx-auto flex max-w-2xl flex-col gap-8 bg-coach-bg px-4 py-6">
      <div>
        <h1 className="text-xl font-semibold text-coach-text">{t('dashboard.pageTitle', 'Về bạn')}</h1>
        <p className="text-xs text-coach-text-muted">
          {t('dashboard.pageSubtitle', 'Mọi thứ Coach đã hiểu về bạn — giá trị cốt lõi, những người quan trọng, và những insight đã đúc kết được.')}
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
              {t('dashboard.mapTitle', 'Bản đồ mối quan hệ')}
            </h2>
            <p className="text-xs text-coach-text-muted">
              {t('dashboard.mapSubtitle', 'Được xây dựng dần từ những gì bạn chia sẻ với Coach.')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsAddingPerson((prev) => !prev)}
              className="rounded-lg border border-coach-border px-3 py-1.5 text-xs font-medium text-coach-text hover:bg-coach-bg"
            >
              {t('dashboard.person.add', '+ Thêm người')}
            </button>
            <Link
              to={APP_ROUTES.COACH_CHAT}
              className="rounded-lg bg-coach-primary px-3 py-1.5 text-xs font-medium text-white"
            >
              {t('dashboard.talkToCoach', 'Trò chuyện với Coach')}
            </Link>
          </div>
        </div>

        {isAddingPerson && (
          <div className="mb-3">
            <PersonForm
              submitLabel={t('dashboard.person.add', '+ Thêm người')}
              onCancel={() => setIsAddingPerson(false)}
              onSubmit={async (person) => {
                await createPerson.mutateAsync(person);
                setIsAddingPerson(false);
              }}
            />
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-coach-text-muted">{t('dashboard.loading', 'Đang tải...')}</p>
        ) : (
          <RelationshipMap
            people={people ?? []}
            emptyLabel={t(
              'dashboard.mapEmpty',
              'Chưa có ai trong bản đồ — hãy chia sẻ về những người quan trọng với bạn khi trò chuyện với Coach.',
            )}
          />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-coach-text">
          {t('dashboard.insightsTitle', 'Dòng thời gian Insight')}
        </h2>
        <InsightTimelineList />
      </section>
    </div>
  );
};

export default DashboardPage;
