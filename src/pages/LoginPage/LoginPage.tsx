import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {APP_ROUTES} from '../../constants/route';
import {useAuth} from '../../providers/AuthProvider';
import './LoginPage.scss';

const LoginPage = () => {
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const {isAuthenticated, login, logout, isLoading} = useAuth();

    const isExplicitLogin = location.state?.explicit === true;
    const intendedDestination = location.state?.from || APP_ROUTES.HOME || '/';

    // If user is already authenticated and didn't explicitly request login, redirect away
    useEffect(() => {
        if (isLoading) return;
        if (isAuthenticated && !isExplicitLogin) {
            navigate(intendedDestination, {replace: true});
        }
    }, [isAuthenticated, isLoading, isExplicitLogin, navigate, intendedDestination]);

    // If explicit login requested, log out first so user can pick a different account
    useEffect(() => {
        if (isExplicitLogin && isAuthenticated) {
            logout();
        }
    }, []); // only on mount

    const handleOnSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            setError('Did not receive credential from Google.');
            return;
        }
        
        setIsLoggingIn(true);
        setError('');
        
        try {
            await login(credentialResponse.credential);
            navigate(intendedDestination, {replace: true});
        } catch (error) {
            console.error('LoginPage: Login error:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : 'Login failed during backend authentication step.';

            setError(errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    }

    const handleOnError = () => {
        setError('Google authentication failed. Please try again.');
    }

    // Show loading spinner while checking authentication status
    if (isLoading) {
        return (
            <main className="login-page">
                <div className="login-container">
                    <div className="login-card">
                        <div className="loading-indicator">
                            Login...
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>Welcome to MimoSe</h2>
                        <p className="login-subtitle">Join the bridge between worlds.</p>
                    </div>

                    {/* Error Display */}
                    {error !== '' && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="google-button-wrapper">
                        <GoogleLogin
                            onSuccess={handleOnSuccess}
                            onError={handleOnError}
                            theme="outline"
                            size="large"
                            width="350"
                        />
                    </div>

                    {/* Loading indicator */}
                    {isLoggingIn && (
                        <div className="loading-indicator">
                            Signing you in...
                        </div>
                    )}

                    <div className="terms-text">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;