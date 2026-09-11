import React, { useRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../providers/AuthProvider';
import { updateUserProfile, changePassword, uploadAvatar, completeOnboarding } from '../../services/userService';
import CoreValuesCard from '../../components/CoreValuesCard/CoreValuesCard';
import { useEntriesInfiniteQuery } from '../../queries/entriesQueryHook';
import { useConversationsInfiniteQuery } from '../../queries/conversationsQueryHook';
import { useUserStatsQuery } from '../../queries/userQueryHook';
import { calculateDayStreak, getEmotionDistribution } from '../../utils/statsUtil';
import { EMOTION_HEAVINESS, heavinessColorVar } from '../../utils/moodUtil';
import type { Emotion } from '../../models/emotion';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import { Button } from '../../components/Button/Button';
import { APP_ROUTES } from '../../constants/route';
import SnackbarComponent from '../../components/Snackbar/Snackbar';
import type { SnackbarType } from '../../components/Snackbar/Snackbar';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.scss';

const STATS_WINDOW_DAYS = 90;

const ProfilePage: React.FC = () => {
    const { currentUser, logout, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState('');
    const [nameLoading, setNameLoading] = useState(false);
    const [nameError, setNameError] = useState('');

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: SnackbarType }>({
        open: false,
        message: '',
        type: 'error',
    });

    const { data: entriesData } = useEntriesInfiniteQuery();
    const { data: conversationsData } = useConversationsInfiniteQuery();
    const { data: stats } = useUserStatsQuery(STATS_WINDOW_DAYS);

    const entries = useMemo(() => entriesData?.pages.flatMap((p) => p.content) ?? [], [entriesData]);
    const entriesTotal = entriesData?.pages[0]?.total ?? 0;
    const conversationsTotal = conversationsData?.pages[0]?.total ?? 0;

    // GET /users/stats is the source of truth once it's loaded; calculateDayStreak/
    // getEmotionDistribution (client-side, entries-only) are only an optimistic fallback while
    // it's still in flight, so the tiles aren't empty on first paint.
    const fallbackStreak = useMemo(() => calculateDayStreak(entries), [entries]);
    const fallbackEmotionDist = useMemo(() => getEmotionDistribution(entries).filter((e) => e.count > 0), [entries]);

    const streakCount = stats?.currentStreakDays ?? fallbackStreak.count;
    const topMoodEmotion = stats?.mostFrequentEmotion ?? fallbackEmotionDist[0]?.emotion ?? null;
    const talksCount = stats?.talksCount ?? conversationsTotal;
    const totalEntries = stats?.entriesCount ?? entriesTotal;
    const emotionsWindowDays = stats?.emotionsWindowDays ?? STATS_WINDOW_DAYS;

    const emotionDist = useMemo(
        () =>
            stats
                ? stats.emotionDistribution.filter((e) => e.count > 0)
                : fallbackEmotionDist.map((e) => ({ emotion: e.emotion, count: e.count })),
        [stats, fallbackEmotionDist],
    );
    const maxEmotionCount = useMemo(() => Math.max(...emotionDist.map((e) => e.count), 1), [emotionDist]);

    const handleLogout = async () => {
        setLogoutDialogOpen(false);
        await logout();
        navigate(APP_ROUTES.WELCOME);
    };

    const handleStartEditName = () => {
        if (currentUser) {
            setEditName(currentUser.fullName);
            setNameError('');
            setIsEditingName(true);
        }
    };

    const handleSaveName = async () => {
        if (!editName.trim()) {
            setNameError(t('profilePage.editName.emptyError'));
            return;
        }
        setNameLoading(true);
        setNameError('');
        try {
            const updatedUser = await updateUserProfile({ fullName: editName.trim() });
            setCurrentUser(updatedUser);
            setIsEditingName(false);
        } catch (err) {
            setNameError(err instanceof Error ? err.message : t('profilePage.editName.updateError'));
        } finally {
            setNameLoading(false);
        }
    };

    const handleSaveValues = async (values: string[]) => {
        try {
            const updatedUser = await completeOnboarding({ coreValues: values, people: [] });
            setCurrentUser(updatedUser);
        } catch (err) {
            const message = err instanceof Error ? err.message : t('profilePage.coreValues.saveError');
            setSnackbar({ open: true, message, type: 'error' });
            throw err;
        }
    };

    const handleSavePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');
        if (!currentPassword.trim() || !newPassword.trim()) {
            setPasswordError(t('profilePage.changePassword.fillAllFields'));
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordError(t('profilePage.changePassword.mismatch'));
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError(t('profilePage.changePassword.tooShort'));
            return;
        }
        setPasswordLoading(true);
        try {
            await changePassword({ currentPassword, newPassword });
            setPasswordSuccess(t('profilePage.changePassword.success'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setTimeout(() => {
                setIsChangingPassword(false);
                setPasswordSuccess('');
            }, 2000);
        } catch (err) {
            setPasswordError(err instanceof Error ? err.message : t('profilePage.changePassword.error'));
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleAvatarClick = () => avatarInputRef.current?.click();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser) return;
        setAvatarLoading(true);
        try {
            const { pictureUrl } = await uploadAvatar(file);
            setCurrentUser({ ...currentUser, pictureUrl });
        } catch (err) {
            const message = err instanceof Error ? err.message : t('profilePage.avatarError');
            setSnackbar({ open: true, message, type: 'error' });
        } finally {
            setAvatarLoading(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    if (!currentUser) {
        return (
            <div className="you-page">
                <p className="you-page__empty">{t('profilePage.loginRequired')}</p>
            </div>
        );
    }

    return (
        <div className="you-page">
            <div className="you-page__header">
                <button
                    type="button"
                    className={`you-page__avatar ${currentUser.pictureUrl ? '' : 'you-page__avatar--fallback'}`}
                    onClick={handleAvatarClick}
                >
                    {currentUser.pictureUrl ? (
                        <img src={currentUser.pictureUrl} alt={currentUser.fullName} referrerPolicy="no-referrer" />
                    ) : (
                        <span>{currentUser.fullName.charAt(0).toUpperCase()}</span>
                    )}
                    <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </button>
                <div className="you-page__identity">
                    {isEditingName ? (
                        <div className="you-page__name-edit">
                            <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} disabled={nameLoading} autoFocus />
                            <button type="button" className="btn btn-primary" onClick={handleSaveName} disabled={nameLoading}>
                                {t('profilePage.editName.edit')}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsEditingName(false)} disabled={nameLoading}>
                                {t('profilePage.changePassword.cancel')}
                            </button>
                        </div>
                    ) : (
                        <h2 className="you-page__name">{currentUser.fullName}</h2>
                    )}
                    <div className="you-page__meta">{currentUser.email}{avatarLoading ? ` · ${t('profilePage.uploading')}` : ''}</div>
                    {nameError && <div className="you-page__error">{nameError}</div>}
                </div>
                {!isEditingName && (
                    <button type="button" className="btn btn-secondary" onClick={handleStartEditName}>
                        {t('profilePage.editProfile')}
                    </button>
                )}
            </div>

            <div className="you-page__stats">
                <div className="you-page__stat">
                    <div className="you-page__stat-label">{t('profilePage.stats.dayStreak')}</div>
                    <div className="you-page__stat-value">
                        {streakCount}<span>{t('profilePage.stats.days')}</span>
                    </div>
                </div>
                <div className="you-page__stat">
                    <div className="you-page__stat-label">{t('profilePage.stats.topMood')}</div>
                    <div className="you-page__stat-value you-page__stat-value--accent">
                        {topMoodEmotion ? t(`emotion.${topMoodEmotion}`) : '—'}
                    </div>
                </div>
                <div className="you-page__stat">
                    <div className="you-page__stat-label">{t('profilePage.stats.sessionsEntries')}</div>
                    <div className="you-page__stat-value">
                        {talksCount}<span> · </span>{totalEntries}
                    </div>
                </div>
            </div>

            <div className="you-page__body">
                <div className="you-page__main">
                    <div className="you-page__section">
                        <div className="you-page__section-label">
                            {t('profilePage.emotionOverview.titleWithDays', { days: emotionsWindowDays })}
                        </div>
                        {emotionDist.length === 0 ? (
                            <p className="you-page__empty-inline">{t('profilePage.emotionOverview.empty')}</p>
                        ) : (
                            <div className="you-page__emotion-chart">
                                {emotionDist.map((item) => (
                                    <div key={item.emotion} className="you-page__emotion-row">
                                        <span className="you-page__emotion-label">{t(`emotion.${item.emotion}`)}</span>
                                        <span className="you-page__emotion-track">
                                            <span
                                                className="you-page__emotion-fill"
                                                style={{
                                                    width: `${(item.count / maxEmotionCount) * 100}%`,
                                                    background: heavinessColorVar(EMOTION_HEAVINESS[item.emotion as Emotion]),
                                                }}
                                            />
                                        </span>
                                        <span className="you-page__emotion-count">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <CoreValuesCard coreValues={currentUser.coreValues} onSave={handleSaveValues} className="you-page__section" />
                </div>

                <div className="you-page__settings">
                    <div className="you-page__section-label">{t('profilePage.settings.title')}</div>
                    <div className="you-page__settings-list">
                        <div className="you-page__settings-row">
                            <span>{t('profilePage.settings.language')}</span>
                            <LanguageSwitcher />
                        </div>
                        {currentUser.hasPassword && (
                            <div className="you-page__settings-row">
                                <span>{t('profilePage.changePassword.label')}</span>
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => { setIsChangingPassword((v) => !v); setPasswordError(''); setPasswordSuccess(''); }}
                                >
                                    {isChangingPassword ? t('profilePage.changePassword.cancel') : t('profilePage.changePassword.change')}
                                </button>
                            </div>
                        )}
                        {isChangingPassword && (
                            <div className="you-page__password-form">
                                <input className="input" type="password" placeholder={t('profilePage.changePassword.currentPlaceholder') as string} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                <input className="input" type="password" placeholder={t('profilePage.changePassword.newPlaceholder') as string} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                <input className="input" type="password" placeholder={t('profilePage.changePassword.confirmPlaceholder') as string} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                                {passwordError && <div className="you-page__error">{passwordError}</div>}
                                {passwordSuccess && <div className="you-page__success">{passwordSuccess}</div>}
                                <button type="button" className="btn btn-primary btn-block" onClick={handleSavePassword} disabled={passwordLoading}>
                                    {passwordLoading ? t('profilePage.changePassword.saving') : t('profilePage.changePassword.save')}
                                </button>
                            </div>
                        )}
                        <div className="you-page__settings-row you-page__settings-row--muted">
                            <span>{t('profilePage.settings.notifications')}</span>
                            <span className="tag tag-neutral">{t('profilePage.settings.soon')}</span>
                        </div>
                        <div className="you-page__settings-row you-page__settings-row--muted">
                            <span>{t('profilePage.settings.exportData')}</span>
                            <span className="tag tag-neutral">{t('profilePage.settings.soon')}</span>
                        </div>
                        <div className="you-page__signout">
                            <Button variant="danger" className="btn-block you-page__signout-btn" onClick={() => setLogoutDialogOpen(true)}>
                                {t('profilePage.logout')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
