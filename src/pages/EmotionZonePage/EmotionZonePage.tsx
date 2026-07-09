import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuHeart, LuPenLine } from 'react-icons/lu';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import { useEntriesInfiniteQuery } from '../../queries/entriesQueryHook';
import { getEmotionDistribution } from '../../utils/statsUtil';
import './EmotionZonePage.scss';

const EmotionZonePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data } = useEntriesInfiniteQuery();

  const entries = useMemo(() => data?.pages.flatMap((page) => page.content) || [], [data]);
  const total = data?.pages[0]?.total || 0;
  const emotionDist = useMemo(() => getEmotionDistribution(entries), [entries]);
  const maxEmotionCount = useMemo(() => Math.max(...emotionDist.map((e) => e.count), 1), [emotionDist]);

  if (!isAuthenticated) {
    return (
      <div className="emotion-zone-page">
        <div className="emotion-zone-page__empty">
          <p>{t('profilePage.loginRequired')}</p>
          <button type="button" onClick={() => navigate(APP_ROUTES.LOGIN)}>
            {t('nav.login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="emotion-zone-page">
      <Breadcrumb
        items={[
          { label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME },
          { label: t('breadcrumb.emotion') },
        ]}
      />

      <section className="emotion-zone-page__hero">
        <div className="emotion-zone-page__icon">
          <LuHeart size={28} />
        </div>
        <h1>{t('emotionPage.title')}</h1>
        <p>{t('emotionPage.subtitle')}</p>
      </section>

      <section className="emotion-zone-page__content">
        {emotionDist.length > 0 && total > 0 ? (
          <div className="emotion-chart">
            {emotionDist.map((item) => (
              <div
                key={item.emotion}
                className={`emotion-chart__row ${item.count === 0 ? 'emotion-chart__row--empty' : ''}`}
              >
                <span className="emotion-chart__icon">{item.icon}</span>
                <span className="emotion-chart__label">{item.label}</span>
                <div className="emotion-chart__bar-track">
                  <div
                    className="emotion-chart__bar-fill"
                    style={{
                      width: `${(item.count / maxEmotionCount) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <span className="emotion-chart__count">{item.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="emotion-zone-page__empty-state">
            <p>{t('emotionPage.empty')}</p>
            <button type="button" className="emotion-zone-page__cta" onClick={() => navigate(APP_ROUTES.ENTRIES_NEW)}>
              <LuPenLine size={18} />
              <span>{t('zonePage.writeJournal')}</span>
            </button>
          </div>
        )}
      </section>

      <button type="button" className="emotion-zone-page__back" onClick={() => navigate(APP_ROUTES.WELCOME)}>
        <LuArrowLeft size={18} />
        <span>{t('zonePage.backToGarden')}</span>
      </button>
    </div>
  );
};

export default EmotionZonePage;
