import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LuChartLine, LuShieldCheck, LuZap } from 'react-icons/lu';
import { useAuth } from '../../../providers/AuthProvider';
import { APP_ROUTES } from '../../../constants/route';
import { useEnergyLogsInfiniteQuery } from '../../../queries/energyLogQueryHook';
import { useActionProtocolsInfiniteQuery } from '../../../queries/actionProtocolQueryHook';
import './TodayBridgePanel.scss';

const daysAgo = (isoDate: string): number => {
  const logged = new Date(isoDate);
  const now = new Date();
  // Compare calendar-day boundaries, not raw 24h windows, so "this morning" reads as "today".
  const loggedMidnight = new Date(logged.getFullYear(), logged.getMonth(), logged.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = nowMidnight.getTime() - loggedMidnight.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
};

const TodayBridgePanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // These hooks only ever mount/run once this panel itself renders (i.e. once auth has
  // resolved and the user is authenticated) — no separate "enabled" gating needed.
  const { data: energyData, isLoading: isEnergyLoading } = useEnergyLogsInfiniteQuery();
  const { data: protocolData, isLoading: isProtocolsLoading } = useActionProtocolsInfiniteQuery();

  const latestEnergyLog = energyData?.pages[0]?.content[0] ?? null;
  const protocolCount = protocolData?.pages[0]?.total ?? 0;

  const energyBody = useMemo(() => {
    if (!latestEnergyLog) return null;
    const days = daysAgo(latestEnergyLog.loggedAt);
    return days === 0
      ? t('garden.bridge.energy.bodyToday', { level: latestEnergyLog.level })
      : t('garden.bridge.energy.body', { level: latestEnergyLog.level, days });
  }, [latestEnergyLog, t]);

  // Anonymous visitors keep seeing today's page exactly as before; also avoid flashing
  // the panel then hiding it while the auth/profile rehydration query is still in flight.
  if (isAuthLoading || !isAuthenticated) {
    return null;
  }

  return (
    <section className="today-bridge-panel" aria-label={t('garden.bridge.heading')}>
      <h2 className="today-bridge-panel__title">{t('garden.bridge.heading')}</h2>
      <p className="today-bridge-panel__subtitle">{t('garden.bridge.subtitle')}</p>

      <div className="today-bridge-panel__cards">
        <button
          type="button"
          className="today-bridge-panel__card"
          onClick={() => navigate(APP_ROUTES.ENERGY_HISTORY)}
        >
          <div className="today-bridge-panel__card-icon">
            <LuZap size={22} />
          </div>
          <div className="today-bridge-panel__card-content">
            <h3>{t('garden.bridge.energy.title')}</h3>
            {isEnergyLoading ? (
              <p>&nbsp;</p>
            ) : (
              <p>{energyBody ?? t('garden.bridge.energy.empty')}</p>
            )}
            <span className="today-bridge-panel__cta">{t('garden.bridge.energy.cta')}</span>
          </div>
        </button>

        <button
          type="button"
          className="today-bridge-panel__card"
          onClick={() => navigate(APP_ROUTES.PROTOCOLS)}
        >
          <div className="today-bridge-panel__card-icon">
            <LuShieldCheck size={22} />
          </div>
          <div className="today-bridge-panel__card-content">
            <h3>{t('garden.bridge.protocols.title')}</h3>
            {isProtocolsLoading ? (
              <p>&nbsp;</p>
            ) : protocolCount > 0 ? (
              <p>{t('garden.bridge.protocols.body', { count: protocolCount })}</p>
            ) : (
              <p>{t('garden.bridge.protocols.empty')}</p>
            )}
            <span className="today-bridge-panel__cta">{t('garden.bridge.protocols.cta')}</span>
          </div>
        </button>

        <button
          type="button"
          className="today-bridge-panel__card"
          onClick={() => navigate(APP_ROUTES.STATISTICS)}
        >
          <div className="today-bridge-panel__card-icon">
            <LuChartLine size={22} />
          </div>
          <div className="today-bridge-panel__card-content">
            <h3>{t('garden.bridge.dashboard.title')}</h3>
            <p>{t('garden.bridge.dashboard.body')}</p>
            <span className="today-bridge-panel__cta">{t('garden.bridge.dashboard.cta')}</span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default TodayBridgePanel;
