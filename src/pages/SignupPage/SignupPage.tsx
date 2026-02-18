import {type FormEvent, useState} from 'react';
import {LuEye, LuEyeOff, LuGlobe, LuSparkles} from 'react-icons/lu';
import {Link, useNavigate} from 'react-router-dom';
import {APP_ROUTES} from '../../constants/route';
import {useAuth} from '../../providers/AuthProvider';
import '../LoginPage/LoginPage.scss';
import './SignupPage.scss';

const SignupPage = () => {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const {signup} = useAuth();

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();

        if (!fullName.trim() || !username.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await signup(fullName, username, password);
            navigate(APP_ROUTES.HOME, {replace: true});
        } catch (error) {
            console.error('SignupPage: Signup error:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : 'Signup failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="signup-page">
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
                    <p className="login-header__subtitle">Start your journey</p>
                </header>

                {/* Body */}
                <div className="login-body">
                    {/* Error Display */}
                    {error !== '' && (
                        <div className="login-error">{error}</div>
                    )}

                    {/* Signup Form */}
                    <form className="login-form" onSubmit={handleSignup}>
                        {/* Full Name */}
                        <div className="login-field">
                            <label className="login-field__label" htmlFor="signup-name">
                                Full Name
                            </label>
                            <input
                                className="login-field__input"
                                id="signup-name"
                                type="text"
                                placeholder="Your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                autoComplete="name"
                            />
                        </div>

                        {/* Username */}
                        <div className="login-field">
                            <label className="login-field__label" htmlFor="signup-username">
                                Username
                            </label>
                            <input
                                className="login-field__input"
                                id="signup-username"
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div className="login-field">
                            <label className="login-field__label" htmlFor="signup-password">
                                Password
                            </label>
                            <div className="login-field__input-wrapper">
                                <input
                                    className="login-field__input"
                                    id="signup-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
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

                        {/* Confirm Password */}
                        <div className="login-field">
                            <label className="login-field__label" htmlFor="signup-confirm">
                                Confirm Password
                            </label>
                            <div className="login-field__input-wrapper">
                                <input
                                    className="login-field__input"
                                    id="signup-confirm"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="login-field__toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <footer className="login-footer">
                    <p className="login-footer__signup">
                        Already have an account?{' '}
                        <Link to={APP_ROUTES.LOGIN}>Sign in</Link>
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

export default SignupPage;
