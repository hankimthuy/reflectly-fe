import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { LuArrowLeft, LuPlus, LuTrash2, LuZap } from 'react-icons/lu';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import QuickEnergyLog from '../../components/QuickEnergyLog/QuickEnergyLog';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import { useSnackbar } from '../../providers/SnackbarProvider';
import { CONTEXT_TAG_DATA } from '../../models/energyLog';
import { useDeleteEnergyLogMutation, useEnergyLogsInfiniteQuery } from '../../queries/energyLogQueryHook';
import './EnergyHistoryPage.scss';

const EnergyHistoryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useEnergyLogsInfiniteQuery();
  const deleteEnergyLog = useDeleteEnergyLogMutation();

  const logs = useMemo(() => data?.pages.flatMap((page) => page.content) || [], [data]);

  if (!isAuthenticated) {
    return (
      <div className="energy-history-page">
        <div className="energy-history-page__empty">
          <p>{t('profilePage.loginRequired')}</p>
          <button type="button" onClick={() => navigate(APP_ROUTES.LOGIN)}>
            {t('nav.login')}
          </button>
        </div>
      </div>
    );
  }

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteEnergyLog.mutate(pendingDeleteId, {
      onSuccess: () => showSnackbar(t('energyHistoryPage.deleted'), 'success'),
      onError: () => showSnackbar(t('energyLog.errorMessage'), 'error'),
      onSettled: () => setPendingDeleteId(null),
    });
  };

  return (
    <div className="energy-history-page">
      <Breadcrumb
        items={[
          { label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME },
          { label: t('energyHistoryPage.title') },
        ]}
      />

      <section className="energy-history-page__hero">
        <div className="energy-history-page__icon">
          <LuZap size={28} />
        </div>
        <h1>{t('energyHistoryPage.title')}</h1>
        <p>{t('energyHistoryPage.subtitle')}</p>
        <button type="button" className="energy-history-page__log-btn" onClick={() => setLogDialogOpen(true)}>
          <LuPlus size={18} />
          <span>{t('energyHistoryPage.logButton')}</span>
        </button>
      </section>

      <section className="energy-history-page__content">
        {isLoading ? (
          <div className="energy-history-page__loading">
            <CircularProgress size={28} />
          </div>
        ) : logs.length === 0 ? (
          <div className="energy-history-page__empty-state">
            <p>{t('energyHistoryPage.empty')}</p>
          </div>
        ) : (
          <ul className="energy-history-list">
            {logs.map((log) => {
              const tag = CONTEXT_TAG_DATA[log.contextTag as keyof typeof CONTEXT_TAG_DATA];
              return (
                <li key={log.id} className="energy-history-list__item">
                  <div className="energy-history-list__level">{log.level}</div>
                  <div className="energy-history-list__details">
                    <span className="energy-history-list__tag">
                      {tag ? `${tag.icon} ${tag.label}` : log.contextTag}
                    </span>
                    <span className="energy-history-list__time">
                      {new Date(log.loggedAt).toLocaleString()}
                    </span>
                    {log.notes && <p className="energy-history-list__notes">{log.notes}</p>}
                  </div>
                  <button
                    type="button"
                    className="energy-history-list__delete"
                    aria-label={t('energyHistoryPage.deleteConfirm.confirm')}
                    onClick={() => setPendingDeleteId(log.id)}
                  >
                    <LuTrash2 size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {!isLoading && hasNextPage && (
          <button
            type="button"
            className="energy-history-page__load-more"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? <CircularProgress size={16} /> : t('energyHistoryPage.loadMore')}
          </button>
        )}
      </section>

      <button type="button" className="energy-history-page__back" onClick={() => navigate(APP_ROUTES.WELCOME)}>
        <LuArrowLeft size={18} />
        <span>{t('zonePage.backToGarden')}</span>
      </button>

      <QuickEnergyLog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title={t('energyHistoryPage.deleteConfirm.title')}
        message={t('energyHistoryPage.deleteConfirm.message')}
        confirmText={t('energyHistoryPage.deleteConfirm.confirm')}
        cancelText={t('energyHistoryPage.deleteConfirm.cancel')}
        confirmColor="error"
        loading={deleteEnergyLog.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
};

export default EnergyHistoryPage;
