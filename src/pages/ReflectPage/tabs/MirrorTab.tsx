import { useTranslation } from 'react-i18next';
import { useMirrorSnapshot, MIRROR_PANES } from '../../../hooks/useMirrorSnapshot';
import { ButtonLink } from '../../../components/Button/Button';
import { APP_ROUTES } from '../../../constants/route';
import Loading from '../../../components/Loading/Loading';

/** The Johari window, promoted from a one-off form to a persistent, always-filling surface —
 * see the redesign brief, section 04. Reads the same data useMirrorSnapshot gives Today's
 * snapshot card, just at full detail: every caught line, grouped by pane. */
const MirrorTab = () => {
    const { t } = useTranslation();
    const { counts, catchesByPane, isLoading } = useMirrorSnapshot();

    if (isLoading) return <Loading message={t('dashboard.loading') as string} fullHeight />;

    const total = MIRROR_PANES.reduce((sum, p) => sum + counts[p], 0);

    return (
        <div className="reflect-mirror">
            {total === 0 && (
                <div className="reflect-mirror__empty">
                    <p>{t('reflect.mirror.empty')}</p>
                    <ButtonLink to={APP_ROUTES.COACH_CHAT} variant="primary">{t('reflect.mirror.emptyCta')}</ButtonLink>
                </div>
            )}
            <div className="reflect-mirror__grid">
                {MIRROR_PANES.map((pane) => (
                    <div key={pane} className={`reflect-mirror__pane reflect-mirror__pane--${pane}`}>
                        <div className="reflect-mirror__pane-head">
                            <div>
                                <div className="reflect-mirror__pane-label">{t(`mirror.${pane}.label`)}</div>
                                <div className="reflect-mirror__pane-sub">{t(`mirror.${pane}.sub`)}</div>
                            </div>
                            <div className="reflect-mirror__pane-count">{counts[pane]}</div>
                        </div>
                        <div className="reflect-mirror__pane-body">
                            {catchesByPane[pane].length === 0 ? (
                                <p className="reflect-mirror__pane-empty">{t('reflect.mirror.paneEmpty')}</p>
                            ) : (
                                catchesByPane[pane].map((c) => (
                                    <div key={c.entry.id} className="reflect-mirror__catch">
                                        <p>{c.text}</p>
                                        <span>{new Date(c.entry.createdAt).toLocaleDateString()}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MirrorTab;
