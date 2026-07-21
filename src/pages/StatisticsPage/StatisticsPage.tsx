import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { LuArrowLeft, LuChartLine, LuPlus } from 'react-icons/lu';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import QuickEnergyLog from '../../components/QuickEnergyLog/QuickEnergyLog';
import EnergyTrendChart from '../../components/charts/EnergyTrendChart';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import { useEnergyStatsQuery } from '../../queries/energyStatsQueryHook';
import {
  getAverageEnergyLevel,
  getBestContextTag,
  getContextTagDistribution,
  getEnergyTrend,
} from '../../utils/energyStatsUtil';
import './StatisticsPage.scss';

const RANGE_DAYS = 30;

const StatisticsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [logDialogOpen, setLogDialogOpen] = useState(false);

  const { data, isLoading } = useEnergyStatsQuery(RANGE_DAYS);
  const logs = useMemo(() => data || [], [data]);

  const trend = useMemo(() => getEnergyTrend(logs), [logs]);
  const contextDist = useMemo(() => getContextTagDistribution(logs), [logs]);
  const averageLevel = useMemo(() => getAverageEnergyLevel(logs), [logs]);
  const bestContext = useMemo(() => getBestContextTag(contextDist), [contextDist]);

  const maxAvgLevel = useMemo(
    () => Math.max(...contextDist.map((item) => item.avgLevel), 1),
    [contextDist]
  );
  const maxCount = useMemo(
    () => Math.max(...contextDist.map((item) => item.count), 1),
    [contextDist]
  );

  if (!isAuthenticated) {
    return (
      <div className="statistics-page">
        <div className="statistics-page__empty">
          <p>{t('dashboard.loginRequired')}</p>
          <button type="button" onClick={() => navigate(APP_ROUTES.LOGIN)}>
            {t('nav.login')}
          </button>
        </div>
      </div>
    );
  }

  const hasLogs = logs.length > 0;

  return (
    <div className="statistics-page">
      <Breadcrumb
        items={[
          { label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME },
          { label: t('dashboard.title') },
        ]}
      />

      <section className="statistics-page__hero">
        <div className="statistics-page__icon">
          <LuChartLine size={28} />
        </div>
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.subtitle')}</p>
        <button type="button" className="statistics-page__log-btn" onClick={() => setLogDialogOpen(true)}>
          <LuPlus size={18} />
          <span>{t('dashboard.logButton')}</span>
        </button>
      </section>

      {isLoading ? (
        <div className="statistics-page__loading">
          <CircularProgress size={28} />
        </div>
      ) : !hasLogs ? (
        <div className="statistics-page__content">
          <div className="statistics-page__empty-state">
            <p>{t('dashboard.empty')}</p>
          </div>
        </div>
      ) : (
        <>
          <section className="statistics-page__summary">
            <div className="statistics-summary-card">
              <span className="statistics-summary-card__label">{t('dashboard.summary.average')}</span>
              <span className="statistics-summary-card__value">{averageLevel}</span>
            </div>
            <div className="statistics-summary-card">
              <span className="statistics-summary-card__label">{t('dashboard.summary.totalLogs')}</span>
              <span className="statistics-summary-card__value">{logs.length}</span>
            </div>
            {bestContext && (
              <div className="statistics-summary-card">
                <span className="statistics-summary-card__label">{t('dashboard.summary.bestContext')}</span>
                <span className="statistics-summary-card__value">
                  {bestContext.icon} {bestContext.label}
                </span>
              </div>
            )}
          </section>

          <section className="statistics-page__content">
            <h2 className="statistics-page__section-title">{t('dashboard.trend.title')}</h2>
            <p className="statistics-page__section-subtitle">{t('dashboard.trend.subtitle')}</p>
            <EnergyTrendChart data={trend} emptyLabel={t('dashboard.trend.empty')} />
          </section>

          <section className="statistics-page__content">
            <h2 className="statistics-page__section-title">{t('dashboard.byContext.title')}</h2>
            <p className="statistics-page__section-subtitle">{t('dashboard.byContext.subtitle')}</p>
            <div className="emotion-chart">
              {contextDist.map((item) => (
                <div
                  key={item.contextTag}
                  className={`emotion-chart__row ${item.count === 0 ? 'emotion-chart__row--empty' : ''}`}
                >
                  <span className="emotion-chart__icon">{item.icon}</span>
                  <span className="emotion-chart__label">{item.label}</span>
                  <div className="emotion-chart__bar-track">
                    <div
                      className="emotion-chart__bar-fill"
                      style={{
                        width: `${(item.avgLevel / maxAvgLevel) * 100}%`,
                        backgroundColor: 'var(--garden-grass)',
                      }}
                    />
                  </div>
                  <span className="emotion-chart__count">{item.avgLevel}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="statistics-page__content">
            <h2 className="statistics-page__section-title">{t('dashboard.byCount.title')}</h2>
            <p className="statistics-page__section-subtitle">{t('dashboard.byCount.subtitle')}</p>
            <div className="emotion-chart">
              {contextDist.map((item) => (
                <div
                  key={item.contextTag}
                  className={`emotion-chart__row ${item.count === 0 ? 'emotion-chart__row--empty' : ''}`}
                >
                  <span className="emotion-chart__icon">{item.icon}</span>
                  <span className="emotion-chart__label">{item.label}</span>
                  <div className="emotion-chart__bar-track">
                    <div
                      className="emotion-chart__bar-fill"
                      style={{
                        width: `${(item.count / maxCount) * 100}%`,
                        backgroundColor: 'var(--garden-bloom)',
                      }}
                    />
                  </div>
                  <span className="emotion-chart__count">{item.count}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <button type="button" className="statistics-page__back" onClick={() => navigate(APP_ROUTES.WELCOME)}>
        <LuArrowLeft size={18} />
        <span>{t('zonePage.backToGarden')}</span>
      </button>

      <QuickEnergyLog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} />
    </div>
  );
};

export default StatisticsPage;
