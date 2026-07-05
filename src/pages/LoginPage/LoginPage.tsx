import { useGoogleLogin } from "@react-oauth/google";
import { type FormEvent, useEffect, useState } from 'react';
import { LuEye, LuEyeOff, LuGlobe, LuSparkles } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import './LoginPage.scss';

const LoginPage = () => {
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

    const handleGoogleSuccess = async (codeResponse: any) => {
        if (!codeResponse.code) {
            setError('Did not receive authorization code from Google.');
            return;
        }

        setIsLoggingIn(true);
        setError('');

        try {
            await login(codeResponse.code);
            navigate(intendedDestination, { replace: true });
        } catch (error: any) {
            console.error('LoginPage: Google login error:', error);
            const errorMessage = error.response?.data?.message
                || error.message
                || 'Network Error: Login failed during backend authentication step.';
            setError(errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google authentication failed. Please try again.');
    };

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
    });

    const handleCredentialLogin = async (e: FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.');
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
                : 'Login failed. Please check your credentials.';
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
                    <div className="login-loading">Signing in...</div>
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
                    <h1 className="login-header__title">MimoSe</h1>
                    <p className="login-header__subtitle">Bridge between worlds</p>
                </header>

                {/* Body */}
                <div className="login-body">
                    {/* Error Display */}
                    {error !== '' && (
                        <div className="login-error">{error}</div>
                    )}

                    {/* Google Login */}
                    <div className="login-google-wrapper">
                        <button
                            type="button"
                            className="login-google-btn"
                            onClick={() => loginWithGoogle()}
                            disabled={isLoggingIn}
                        >
                            <FcGoogle size={24} />
                            Sign in with Google
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="login-divider">
                        <div className="login-divider__line" />
                        <span className="login-divider__text">or</span>
                        <div className="login-divider__line" />
                    </div>

                    {/* Credential Form */}
                    <form className="login-form" onSubmit={handleCredentialLogin}>
                        {/* Username */}
                        <div className="login-field">
                            <label className="login-field__label" htmlFor="login-username">
                                Username
                            </label>
                            <input
                                className="login-field__input"
                                id="login-username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div className="login-field">
                            <div className="login-field__label-row">
                                <label className="login-field__label" htmlFor="login-password">
                                    Password
                                </label>
                                <a className="login-field__forgot" href="#">
                                    Forgot?
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
                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <footer className="login-footer">
                    <p className="login-footer__signup">
                        Don't have an account?{' '}
                        <Link to={APP_ROUTES.SIGNUP}>Start your journey</Link>
                    </p>
                    <div className="login-footer__links">
                        <a href="#">Privacy Policy</a>
                        <span className="login-footer__links-dot">•</span>
                        <a href="#">Terms of Service</a>
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