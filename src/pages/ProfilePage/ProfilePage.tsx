import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuLogOut, LuGlobe, LuBell, LuDownload, LuBrainCircuit, LuShield, LuActivity } from 'react-icons/lu';
import { useAuth } from '../../providers/AuthProvider';

import { useEntriesInfiniteQuery } from '../../queries/entriesQueryHook';
import { calculateDayStreak, getTopMood, getEmotionDistribution } from '../../utils/statsUtil';
import { EMOTION_DATA } from '../../models/emotion';
import StatCard from '../../components/StatCard/StatCard';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import { APP_ROUTES } from '../../constants/route';
import './ProfilePage.scss';

const ProfilePage: React.FC = () => {
    const { currentUser, logout } = useAuth();

    const navigate = useNavigate();
    const { t } = useTranslation();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const { data } = useEntriesInfiniteQuery();

    const entries = useMemo(() => {
        return data?.pages.flatMap(page => page.content) || [];
    }, [data]);

    const total = data?.pages[0]?.total || 0;

    const streak = useMemo(() => calculateDayStreak(entries), [entries]);
    const topMood = useMemo(() => getTopMood(entries), [entries]);
    const emotionDist = useMemo(() => getEmotionDistribution(entries), [entries]);
    const maxEmotionCount = useMemo(() => Math.max(...emotionDist.map(e => e.count), 1), [emotionDist]);

    const handleLogout = async () => {
        setLogoutDialogOpen(false);
        await logout();
        navigate(APP_ROUTES.WELCOME);
    };


    if (!currentUser) {
        return (
            <div className="profile-page">
                <div className="profile-page__empty">
                    <p>{t('profilePage.loginRequired')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* === DARK HEADER ZONE === */}
            <div className="profile-page__hero">
                <div className="profile-page__hero-content">
                    <div className="profile-page__avatar">
                        {currentUser.pictureUrl ? (
                            <img
                                src={currentUser.pictureUrl}
                                alt={currentUser.fullName}
                                className="profile-page__avatar-img"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="profile-page__avatar-placeholder">
                                {currentUser.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="profile-page__info">
                        <h1 className="profile-page__name">{currentUser.fullName}</h1>
                        <p className="profile-page__email">{currentUser.email}</p>
                    </div>
                    <div className="profile-page__stats">
                        <StatCard
                            icon={<span>{streak.icon}</span>}
                            value={streak.count}
                            label={t('profilePage.stats.dayStreak')}
                            variant="glass-light"
                            accentColor={streak.color}
                        />
                        <StatCard
                            icon={<span>{topMood ? topMood.icon : (EMOTION_DATA.happy?.icon || '😊')}</span>}
                            value={topMood ? topMood.label : '—'}
                            label={t('profilePage.stats.topMood')}
                            variant="glass-light"
                            accentColor={topMood?.color}
                        />
                    </div>
                </div>
            </div>

            {/* === WHITE CONTENT ZONE === */}
            <div className="profile-page__content">

                {/* Quick Actions */}
                <div className="profile-page__actions">
                    <div
                        className="profile-page__action-card profile-page__action-card--inner"
                        onClick={() => navigate(APP_ROUTES.INNERVERSE)}
                    >
                        <div className="profile-page__action-card-icon"><LuBrainCircuit size={20} /></div>
                        <div className="profile-page__action-card-body">
                            <span className="profile-page__action-card-title">Innerverse</span>
                            <span className="profile-page__action-card-desc">Explore your inner world</span>
                        </div>
                    </div>
                    <div
                        className="profile-page__action-card profile-page__action-card--entry"
                        onClick={() => navigate(APP_ROUTES.ENTRIES_NEW)}
                    >
                        <div className="profile-page__action-card-icon"><LuShield size={20} /></div>
                        <div className="profile-page__action-card-body">
                            <span className="profile-page__action-card-title">Log Your Innerverse</span>
                            <span className="profile-page__action-card-desc">Write in your Safe Space</span>
                        </div>
                    </div>
                    <div
                        className="profile-page__action-card profile-page__action-card--outer"
                        onClick={() => navigate(APP_ROUTES.OUTERVERSE)}
                    >
                        <div className="profile-page__action-card-icon"><LuActivity size={20} /></div>
                        <div className="profile-page__action-card-body">
                            <span className="profile-page__action-card-title">Outerverse</span>
                            <span className="profile-page__action-card-desc">Lead your reality</span>
                        </div>
                    </div>
                </div>

                {/* Grid: Emotion Overview + Settings */}
                <div className="profile-page__grid">

                {/* Emotion Overview */}
                <section className="profile-page__section">
                    <h3 className="profile-page__section-title">
                        {t('profilePage.emotionOverview.title')}
                    </h3>
                    {total > 0 && (
                        <p className="profile-page__section-subtitle">
                            {t('profilePage.emotionOverview.subtitle', { entries: total, emotions: entries.flatMap(e => e.emotions).length })}
                        </p>
                    )}

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
                        <p className="profile-page__empty-state">
                            {t('profilePage.emotionOverview.empty')}
                        </p>
                    )}
                </section>

                {/* Settings */}
                <section className="profile-page__section">
                    <h3 className="profile-page__section-title">
                        {t('profilePage.settings.title')}
                    </h3>
                    <div className="settings-list">
                        <div className="settings-list__item">
                            <div className="settings-list__left">
                                <LuGlobe size={18} />
                                <span>{t('profilePage.settings.language')}</span>
                            </div>
                            <LanguageSwitcher />
                        </div>
                        <div className="settings-list__item">
                            <div className="settings-list__left">
                                <LuBell size={18} />
                                <span>{t('profilePage.settings.notifications')}</span>
                            </div>
                            <span className="settings-list__badge">Soon</span>
                        </div>
                        <div className="settings-list__item">
                            <div className="settings-list__left">
                                <LuDownload size={18} />
                                <span>{t('profilePage.settings.exportData')}</span>
                            </div>
                            <span className="settings-list__badge">Soon</span>
                        </div>
                        <div className="settings-list__item settings-list__item--danger" onClick={() => setLogoutDialogOpen(true)}>
                            <div className="settings-list__left">
                                <LuLogOut size={18} />
                                <span>{t('profilePage.logout')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                </div>{/* end grid */}
            </div>

            <ConfirmDialog
                open={logoutDialogOpen}
                title={t('profilePage.logoutDialog.title')}
                message={t('profilePage.logoutDialog.message')}
                confirmText={t('profilePage.logoutDialog.confirm')}
                cancelText={t('profilePage.logoutDialog.cancel')}
                confirmColor="error"
                onConfirm={handleLogout}
                onCancel={() => setLogoutDialogOpen(false)}
            />
        </div>
    );
};

export default ProfilePage;
