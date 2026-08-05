import { useGoogleLogin, type CodeResponse } from "@react-oauth/google";
import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuEye, LuEyeOff, LuGlobe, LuSparkles } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import { Button } from '../../components/Button/Button';
import './LoginPage.scss';

const LoginPage = () => {
    const { t } = useTranslation();
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Credential form state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login, loginWithCredentials, logout, isLoading } = useAuth();

    const isExplicitLogin = location.state?.explicit === true;
    const intendedDestination = location.state?.from || APP_ROUTES.HOME || '/';

    // If user is already authenticated and didn't explicitly request login, redirect away
    useEffect(() => {
        if (isLoading) return;
        if (isAuthenticated && !isExplicitLogin) {
            navigate(intendedDestination, { replace: true });
        }
    }, [isAuthenticated, isLoading, isExplicitLogin, navigate, intendedDestination]);

    // If explicit login requested, log out first so user can pick a different account
    useEffect(() => {
        if (isExplicitLogin && isAuthenticated) {
            logout();
        }
    }, []); // only on mount

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
            console.error('LoginPage: Google login error:', error);
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message ?? error.message
                : error instanceof Error
                    ? error.message
                    : t('auth.errors.networkError');
            setError(errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleGoogleError = () => {
        setError(t('auth.errors.googleFailed'));
    };

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
            console.error('LoginPage: Credential login error:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : t('auth.errors.loginFailed');
            setError(errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    };

    // Show loading spinner while checking authentication status
    if (isLoading) {
        return (
            <main className="login-page">
                <div className="login-bg">
                    <div className="login-bg__split" />
                    <div className="login-bg__orb login-bg__orb--blue" />
                    <div className="login-bg__orb login-bg__orb--orange" />
                </div>
                <div className="login-main">
                    <div className="login-loading">{t('auth.signingIn')}</div>
                </div>
            </main>
        );
    }

    return (
        <main className="login-page">
            {/* Background */}
            <div className="login-bg">
                <div className="login-bg__split" />
                <div className="login-bg__orb login-bg__orb--blue" />
                <div className="login-bg__orb login-bg__orb--orange" />
            </div>

            {/* Main Content */}
            <div className="login-main">
                {/* Header */}
                <header className="login-header">
                    <h1 className="login-header__title">{t('brand.name')}</h1>
                    <p className="login-header__acronym">{t('brand.acronym')}</p>
                    <p className="login-header__subtitle">{t('brand.welcome')}</p>
                </header>

                {/* Body */}
                <div className="login-body">
                    {/* Error Display */}
                    {error !== '' && (
                        <div className="login-error">{error}</div>
                    )}

                    {/* Google Login */}
                    <div className="login-google-wrapper">
                        <Button
                            variant="secondary"
                            size="lg"
                            shape="pill"
                            className="w-full shadow-sm hover:shadow-md"
                            onClick={() => loginWithGoogle()}
                            disabled={isLoggingIn}
                        >
                            <FcGoogle size={24} />
                            {t('auth.googleLogin')}
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="login-divider">
                        <div className="login-divider__line" />
                        <span className="login-divider__text">{t('auth.or')}</span>
                        <div className="login-divider__line" />
                    </div>

                    {/* Credential Form */}
                    <form className="login-form" onSubmit={handleCredentialLogin}>
                        {/* Username */}
                        <div className="login-field">
                            <label className="login-field__label" htmlFor="login-username">
                                {t('auth.username')}
                            </label>
                            <input
                                className="login-field__input"
                                id="login-username"
                                type="text"
                                placeholder={t('auth.usernamePlaceholder')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div className="login-field">
                            <div className="login-field__label-row">
                                <label className="login-field__label" htmlFor="login-password">
                                    {t('auth.password')}
                                </label>
                                <a className="login-field__forgot" href="#">
                                    {t('auth.forgotPassword')}
                                </a>
                            </div>
                            <div className="login-field__input-wrapper">
                                <input
                                    className="login-field__input"
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="login-field__toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            shape="pill"
                            className="mt-1 w-full"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? '...' : t('auth.loginButton')}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <footer className="login-footer">
                    <p className="login-footer__signup">
                        {t('auth.noAccount')}{' '}
                        <Link to={APP_ROUTES.SIGNUP}>{t('auth.signupLink')}</Link>
                    </p>
                    <div className="login-footer__links">
                        <a href="#">{t('auth.privacyPolicy')}</a>
                        <span className="login-footer__links-dot">•</span>
                        <a href="#">{t('auth.termsOfService')}</a>
                    </div>
                </footer>
            </div>

            {/* Decorative Icons */}
            <div className="login-decor login-decor--top-right">
                <LuSparkles size={48} />
            </div>
            <div className="login-decor login-decor--bottom-left">
                <LuGlobe size={48} />
            </div>
        </main>
    );
};

export default LoginPage;