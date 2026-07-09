import React, { useRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuLogOut, LuGlobe, LuBell, LuDownload, LuBookOpen, LuHeart, LuPencil, LuLock, LuCamera, LuCheck, LuX, LuTreePine } from 'react-icons/lu';
import { useAuth } from '../../providers/AuthProvider';
import { updateUserProfile, changePassword, uploadAvatar } from '../../services/userService';

import { useEntriesInfiniteQuery } from '../../queries/entriesQueryHook';
import { calculateDayStreak, getTopMood, getEmotionDistribution } from '../../utils/statsUtil';
import { EMOTION_DATA } from '../../models/emotion';
import StatCard from '../../components/StatCard/StatCard';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import { APP_ROUTES } from '../../constants/route';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SnackbarComponent from '../../components/Snackbar/Snackbar';
import type { SnackbarType } from '../../components/Snackbar/Snackbar';
import './ProfilePage.scss';

const ProfilePage: React.FC = () => {
    const { currentUser, logout, setCurrentUser } = useAuth();

    const navigate = useNavigate();
    const { t } = useTranslation();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    // Edit name state
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState('');
    const [nameLoading, setNameLoading] = useState(false);
    const [nameError, setNameError] = useState('');

    // Change password state
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Avatar upload
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);

    // Snackbar state
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: SnackbarType }>({
        open: false,
        message: '',
        type: 'error',
    });

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

    // --- Edit Name ---
    const handleStartEditName = () => {
        if (currentUser) {
            setEditName(currentUser.fullName);
            setNameError('');
            setIsEditingName(true);
        }
    };

    const handleSaveName = async () => {
        if (!editName.trim()) {
            setNameError('Name cannot be empty.');
            return;
        }
        setNameLoading(true);
        setNameError('');
        try {
            const updatedUser = await updateUserProfile({ fullName: editName.trim() });
            setCurrentUser(updatedUser);
            setIsEditingName(false);
        } catch (err) {
            setNameError(err instanceof Error ? err.message : 'Failed to update name.');
        } finally {
            setNameLoading(false);
        }
    };

    const handleCancelEditName = () => {
        setIsEditingName(false);
        setNameError('');
    };

    // --- Change Password ---
    const handleSavePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentPassword.trim() || !newPassword.trim()) {
            setPasswordError('Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters.');
            return;
        }

        setPasswordLoading(true);
        try {
            await changePassword({ currentPassword, newPassword });
            setPasswordSuccess('Password changed successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setTimeout(() => {
                setIsChangingPassword(false);
                setPasswordSuccess('');
            }, 2000);
        } catch (err) {
            setPasswordError(err instanceof Error ? err.message : 'Failed to change password.');
        } finally {
            setPasswordLoading(false);
        }
    };

    // --- Avatar Upload ---
    const handleAvatarClick = () => {
        avatarInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser) return;

        setAvatarLoading(true);
        try {
            const { pictureUrl } = await uploadAvatar(file);
            setCurrentUser({ ...currentUser, pictureUrl });
        } catch (err) {
            console.error('Avatar upload failed:', err);
            const message = err instanceof Error ? err.message : 'Failed to upload avatar. Please try again.';
            setSnackbar({ open: true, message, type: 'error' });
        } finally {
            setAvatarLoading(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
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
                <div className="profile-page__breadcrumb">
                    <Breadcrumb
                        variant="light"
                        items={[
                            { label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME },
                            { label: t('breadcrumb.profile') },
                        ]}
                    />
                </div>
                <div className="profile-page__hero-content">
                    <div className="profile-page__avatar profile-page__avatar--editable" onClick={handleAvatarClick}>
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
                        <div className="profile-page__avatar-overlay">
                            {avatarLoading ? '...' : <LuCamera size={18} />}
                        </div>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                        />
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
                        className="profile-page__action-card profile-page__action-card--garden"
                        onClick={() => navigate(APP_ROUTES.WELCOME)}
                    >
                        <div className="profile-page__action-card-icon"><LuTreePine size={20} /></div>
                        <div className="profile-page__action-card-body">
                            <span className="profile-page__action-card-title">{t('nav.garden')}</span>
                            <span className="profile-page__action-card-desc">{t('brand.tagline')}</span>
                        </div>
                    </div>
                    <div
                        className="profile-page__action-card profile-page__action-card--entry"
                        onClick={() => navigate(APP_ROUTES.ENTRIES_NEW)}
                    >
                        <div className="profile-page__action-card-icon"><LuBookOpen size={20} /></div>
                        <div className="profile-page__action-card-body">
                            <span className="profile-page__action-card-title">{t('zonePage.writeJournal')}</span>
                            <span className="profile-page__action-card-desc">{t('garden.zones.reflection.description')}</span>
                        </div>
                    </div>
                    <div
                        className="profile-page__action-card profile-page__action-card--emotion"
                        onClick={() => navigate(APP_ROUTES.EMOTION_ZONE)}
                    >
                        <div className="profile-page__action-card-icon"><LuHeart size={20} /></div>
                        <div className="profile-page__action-card-body">
                            <span className="profile-page__action-card-title">{t('nav.emotion')}</span>
                            <span className="profile-page__action-card-desc">{t('garden.zones.emotion.description')}</span>
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
                        {/* Edit Name */}
                        <div className="settings-list__item">
                            <div className="settings-list__left">
                                <LuPencil size={18} />
                                <span>Display Name</span>
                            </div>
                            {!isEditingName ? (
                                <button className="settings-list__toggle" onClick={handleStartEditName}>Edit</button>
                            ) : (
                                <div className="settings-list__inline-edit">
                                    <input
                                        className="settings-list__inline-input"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        disabled={nameLoading}
                                    />
                                    <button className="settings-list__icon-btn settings-list__icon-btn--save" onClick={handleSaveName} disabled={nameLoading}>
                                        <LuCheck size={16} />
                                    </button>
                                    <button className="settings-list__icon-btn settings-list__icon-btn--cancel" onClick={handleCancelEditName} disabled={nameLoading}>
                                        <LuX size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                        {nameError && <div className="settings-list__error">{nameError}</div>}

                        {/* Change Password (only for credential users) */}
                        {currentUser.hasPassword && (
                            <>
                                <div className="settings-list__item">
                                    <div className="settings-list__left">
                                        <LuLock size={18} />
                                        <span>Change Password</span>
                                    </div>
                                    <button className="settings-list__toggle" onClick={() => { setIsChangingPassword(!isChangingPassword); setPasswordError(''); setPasswordSuccess(''); }}>
                                        {isChangingPassword ? 'Cancel' : 'Change'}
                                    </button>
                                </div>
                                {isChangingPassword && (
                                    <div className="settings-list__password-form">
                                        <input
                                            className="settings-list__password-input"
                                            type="password"
                                            placeholder="Current password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                        <input
                                            className="settings-list__password-input"
                                            type="password"
                                            placeholder="New password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <input
                                            className="settings-list__password-input"
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        />
                                        {passwordError && <div className="settings-list__error">{passwordError}</div>}
                                        {passwordSuccess && <div className="settings-list__success">{passwordSuccess}</div>}
                                        <button
                                            className="settings-list__password-btn"
                                            onClick={handleSavePassword}
                                            disabled={passwordLoading}
                                        >
                                            {passwordLoading ? 'Saving...' : 'Save Password'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

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

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                autoHideDuration={5000}
            />

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
