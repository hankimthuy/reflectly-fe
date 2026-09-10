import { type FormEvent, useState } from 'react';
import { useGoogleLogin, type CodeResponse } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import '../LoginPage/LoginPage.scss';

/** See mockup 3b's second card — same auth-page shell as LoginPage, fields-then-Google order
 * (the opposite of Login's Google-first). Keeps the confirm-password field the mockup itself
 * dropped: real signup here still needs it as a typo safety net, and it's part of the tested
 * validation flow (mismatch, min length). */
const SignupPage = () => {
    const { t } = useTranslation();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const { signup, login } = useAuth();

    // Google OAuth doesn't distinguish signup from login on this end — the backend upserts the
    // account either way — so this reuses the exact same code-exchange flow LoginPage uses.
    const handleGoogleSuccess = async (codeResponse: CodeResponse) => {
        if (!codeResponse.code) {
            setError(t('auth.errors.googleCodeMissing'));
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await login(codeResponse.code);
            navigate(APP_ROUTES.HOME, { replace: true });
        } catch (error: unknown) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message ?? error.message
                : error instanceof Error ? error.message : t('auth.errors.networkError');
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: handleGoogleSuccess,
        onError: () => setError(t('auth.errors.googleFailed')),
    });

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !username.trim() || !password.trim()) {
            setError(t('auth.errors.fillAllFields'));
            return;
        }
        if (password !== confirmPassword) {
            setError(t('auth.errors.passwordMismatch'));
            return;
        }
        if (password.length < 6) {
            setError(t('auth.errors.passwordTooShort'));
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await signup(fullName, username, password);
            navigate(APP_ROUTES.HOME, { replace: true });
        } catch (error: unknown) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message ?? error.message
                : error instanceof Error ? error.message : t('auth.errors.signupFailed');
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-page__wordmark">{t('brand.name')}</div>

            <div className="auth-page__form">
                <h2 className="auth-page__title">{t('auth.signupTitle')}</h2>
                <p className="auth-page__note">{t('auth.signupSubtitle')}</p>
                {error !== '' && <p className="auth-page__error">{error}</p>}

                <form onSubmit={handleSignup}>
                    <div className="field auth-page__field">
                        <label htmlFor="signup-name">{t('auth.fullName')}</label>
                        <input
                            className="input"
                            id="signup-name"
                            type="text"
                            placeholder={t('auth.fullNamePlaceholder') as string}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            autoComplete="name"
                        />
                    </div>

                    <div className="field auth-page__field">
                        <label htmlFor="signup-username">{t('auth.username')}</label>
                        <input
                            className="input"
                            id="signup-username"
                            type="text"
                            placeholder={t('auth.usernameChoosePlaceholder') as string}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="field auth-page__field">
                        <label htmlFor="signup-password">{t('auth.password')}</label>
                        <div className="auth-page__password-wrap">
                            <input
                                className="input"
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <button type="button" className="auth-page__toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="field auth-page__field">
                        <label htmlFor="signup-confirm">{t('auth.confirmPassword')}</label>
                        <div className="auth-page__password-wrap">
                            <input
                                className="input"
                                id="signup-confirm"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <button type="button" className="auth-page__toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                                {showConfirmPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block auth-page__submit" disabled={isSubmitting}>
                        {isSubmitting ? t('auth.creatingAccount') : t('auth.signupButton')}
                    </button>
                </form>

                <button type="button" className="btn btn-secondary btn-block auth-page__google" onClick={() => loginWithGoogle()} disabled={isSubmitting}>
                    <FcGoogle size={18} />
                    <span>{t('auth.googleLogin')}</span>
                </button>

                <p className="auth-page__note">{t('auth.signupNote')}</p>
            </div>

            <div className="auth-page__footer">
                <p>{t('auth.hasAccount')} <Link to={APP_ROUTES.LOGIN}><strong>{t('auth.loginLink')}</strong></Link></p>
                <div className="auth-page__legal">
                    <a href="#">{t('auth.privacyPolicy')}</a>
                    <a href="#">{t('auth.termsOfService')}</a>
                </div>
            </div>
        </main>
    );
};

export default SignupPage;
