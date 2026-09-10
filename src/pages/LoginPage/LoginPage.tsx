import { useGoogleLogin, type CodeResponse } from "@react-oauth/google";
import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import './LoginPage.scss';

/** See mockup 3b — no nav, just the wordmark; the form sits pinned toward the bottom of the
 * frame (margin-top: auto) rather than centered, matching that mockup's composition. */
const LoginPage = () => {
    const { t } = useTranslation();
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login, loginWithCredentials, logout, isLoading } = useAuth();

    const isExplicitLogin = location.state?.explicit === true;
    const intendedDestination = location.state?.from || APP_ROUTES.HOME || '/';

    useEffect(() => {
        if (isLoading) return;
        if (isAuthenticated && !isExplicitLogin) {
            navigate(intendedDestination, { replace: true });
        }
    }, [isAuthenticated, isLoading, isExplicitLogin, navigate, intendedDestination]);

    useEffect(() => {
        if (isExplicitLogin && isAuthenticated) {
            logout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGoogleSuccess = async (codeResponse: CodeResponse) => {
        if (!codeResponse.code) {
            setError(t('auth.errors.googleCodeMissing'));
            return;
        }
        setIsLoggingIn(true);
        setError('');
        try {
            await login(codeResponse.code);
            navigate(intendedDestination, { replace: true });
        } catch (error: unknown) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message ?? error.message
                : error instanceof Error ? error.message : t('auth.errors.networkError');
            setError(errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleGoogleError = () => setError(t('auth.errors.googleFailed'));

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
    });

    const handleCredentialLogin = async (e: FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError(t('auth.errors.usernamePasswordRequired'));
            return;
        }
        setIsLoggingIn(true);
        setError('');
        try {
            await loginWithCredentials(username, password);
            navigate(intendedDestination, { replace: true });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('auth.errors.loginFailed');
            setError(errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (isLoading) {
        return (
            <main className="auth-page">
                <div className="auth-page__wordmark">{t('brand.name')}</div>
                <p className="auth-page__loading">{t('auth.signingIn')}</p>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <div className="auth-page__wordmark">{t('brand.name')}</div>

            <div className="auth-page__form">
                <h2 className="auth-page__title">{t('brand.welcome')}</h2>
                <p className="auth-page__note">{t('auth.loginNote')}</p>
                {error !== '' && <p className="auth-page__error">{error}</p>}

                <button type="button" className="btn btn-secondary btn-block auth-page__google" onClick={() => loginWithGoogle()} disabled={isLoggingIn}>
                    <FcGoogle size={18} />
                    <span>{t('auth.googleLogin')}</span>
                </button>

                <div className="auth-page__divider">
                    <span />
                    <span className="auth-page__divider-text">{t('auth.or')}</span>
                    <span />
                </div>

                <form onSubmit={handleCredentialLogin}>
                    <div className="field auth-page__field">
                        <label htmlFor="login-username">{t('auth.username')}</label>
                        <input
                            className="input"
                            id="login-username"
                            type="text"
                            placeholder={t('auth.usernamePlaceholder') as string}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="field auth-page__field">
                        <div className="auth-page__field-label-row">
                            <label htmlFor="login-password">{t('auth.password')}</label>
                            <a className="auth-page__forgot" href="#">{t('auth.forgotPassword')}</a>
                        </div>
                        <div className="auth-page__password-wrap">
                            <input
                                className="input"
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <button type="button" className="auth-page__toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block auth-page__submit" disabled={isLoggingIn}>
                        {isLoggingIn ? '…' : t('auth.loginButton')}
                    </button>
                </form>
            </div>

            <div className="auth-page__footer">
                <p>{t('auth.noAccount')} <Link to={APP_ROUTES.SIGNUP}><strong>{t('auth.signupLink')}</strong></Link></p>
                <div className="auth-page__legal">
                    <a href="#">{t('auth.privacyPolicy')}</a>
                    <a href="#">{t('auth.termsOfService')}</a>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
