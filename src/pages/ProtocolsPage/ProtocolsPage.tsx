import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { LuArrowLeft, LuCheck, LuPencil, LuPlus, LuShieldCheck, LuTrash2 } from 'react-icons/lu';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import ProtocolFormDialog from '../../components/ProtocolFormDialog/ProtocolFormDialog';
import MarkProtocolUsedDialog from '../../components/MarkProtocolUsedDialog/MarkProtocolUsedDialog';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import { useSnackbar } from '../../providers/SnackbarProvider';
import type { ActionProtocol } from '../../models/actionProtocol';
import { useActionProtocolsInfiniteQuery, useDeleteActionProtocolMutation } from '../../queries/actionProtocolQueryHook';
import './ProtocolsPage.scss';

const ProtocolsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<ActionProtocol | null>(null);
  const [markUsedProtocolId, setMarkUsedProtocolId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useActionProtocolsInfiniteQuery();
  const deleteProtocol = useDeleteActionProtocolMutation();

  const protocols = useMemo(() => data?.pages.flatMap((page) => page.content) || [], [data]);

  if (!isAuthenticated) {
    return (
      <div className="protocols-page">
        <div className="protocols-page__empty">
          <p>{t('profilePage.loginRequired')}</p>
          <button type="button" onClick={() => navigate(APP_ROUTES.LOGIN)}>
            {t('nav.login')}
          </button>
        </div>
      </div>
    );
  }

  const handleOpenCreate = () => {
    setEditingProtocol(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (protocol: ActionProtocol) => {
    setEditingProtocol(protocol);
    setFormDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteProtocol.mutate(pendingDeleteId, {
      onSuccess: () => showSnackbar(t('actionProtocol.list.deleted'), 'success'),
      onError: () => showSnackbar(t('actionProtocol.form.errorMessage'), 'error'),
      onSettled: () => setPendingDeleteId(null),
    });
  };

  return (
    <div className="protocols-page">
      <Breadcrumb
        items={[
          { label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME },
          { label: t('actionProtocol.list.title') },
        ]}
      />

      <section className="protocols-page__hero">
        <div className="protocols-page__icon">
          <LuShieldCheck size={28} />
        </div>
        <h1>{t('actionProtocol.list.title')}</h1>
        <p>{t('actionProtocol.list.subtitle')}</p>
        <button type="button" className="protocols-page__create-btn" onClick={handleOpenCreate}>
          <LuPlus size={18} />
          <span>{t('actionProtocol.list.createButton')}</span>
        </button>
      </section>

      <section className="protocols-page__content">
        {isLoading ? (
          <div className="protocols-page__loading">
            <CircularProgress size={28} />
          </div>
        ) : protocols.length === 0 ? (
          <div className="protocols-page__empty-state">
            <p>{t('actionProtocol.list.empty')}</p>
          </div>
        ) : (
          <ul className="protocols-list">
            {protocols.map((protocol) => (
              <li key={protocol.id} className="protocols-list__item">
                <div className="protocols-list__header">
                  <h3 className="protocols-list__title">{protocol.title}</h3>
                  <div className="protocols-list__header-actions">
                    <button
                      type="button"
                      className="protocols-list__icon-btn"
                      aria-label={t('actionProtocol.form.editTitle')}
                      onClick={() => handleOpenEdit(protocol)}
                    >
                      <LuPencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="protocols-list__icon-btn protocols-list__icon-btn--danger"
                      aria-label={t('actionProtocol.list.deleteConfirm.confirm')}
                      onClick={() => setPendingDeleteId(protocol.id)}
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="protocols-list__trigger">
                  <span className="protocols-list__trigger-label">{t('actionProtocol.list.triggerLabel')}</span> {protocol.trigger}
                </p>
                <p className="protocols-list__script">{protocol.script}</p>

                <div className="protocols-list__footer">
                  <div className="protocols-list__stats">
                    <span>{t('actionProtocol.list.usageCount', { times: protocol.usageCount })}</span>
                    {protocol.lastUsedAt && (
                      <span className="protocols-list__last-used">
                        {t('actionProtocol.list.lastUsed', { date: new Date(protocol.lastUsedAt).toLocaleString() })}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="protocols-list__use-btn"
                    onClick={() => setMarkUsedProtocolId(protocol.id)}
                  >
                    <LuCheck size={16} />
                    <span>{t('actionProtocol.list.markUsedButton')}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && hasNextPage && (
          <button
            type="button"
            className="protocols-page__load-more"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? <CircularProgress size={16} /> : t('actionProtocol.list.loadMore')}
          </button>
        )}
      </section>

      <button type="button" className="protocols-page__back" onClick={() => navigate(APP_ROUTES.WELCOME)}>
        <LuArrowLeft size={18} />
        <span>{t('zonePage.backToGarden')}</span>
      </button>

      <ProtocolFormDialog
        open={formDialogOpen}
        protocol={editingProtocol}
        onClose={() => setFormDialogOpen(false)}
      />

      <MarkProtocolUsedDialog
        open={markUsedProtocolId !== null}
        protocolId={markUsedProtocolId}
        onClose={() => setMarkUsedProtocolId(null)}
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title={t('actionProtocol.list.deleteConfirm.title')}
        message={t('actionProtocol.list.deleteConfirm.message')}
        confirmText={t('actionProtocol.list.deleteConfirm.confirm')}
        cancelText={t('actionProtocol.list.deleteConfirm.cancel')}
        confirmColor="error"
        loading={deleteProtocol.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
};

export default ProtocolsPage;
