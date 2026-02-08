import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {APP_ROUTES} from '../../constants/route';
import {useAuth} from '../../providers/AuthProvider';
import './LoginPage.scss';

const LoginPage = () => {
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const hasLoggedOut = useRef(false);

    const navigate = useNavigate();
    const location = useLocation();
    const {isAuthenticated, login, logout, isLoading} = useAuth();

    const isExplicitLogin = location.state?.explicit === true;
    const intendedDestination = location.state?.from || APP_ROUTES.HOME || '/';

    useEffect(() => {
        if (isLoading) return;

        if (isExplicitLogin && isAuthenticated && !hasLoggedOut.current) {
            hasLoggedOut.current = true;
            logout();
            return;
        }

        if (isAuthenticated && !isExplicitLogin) {
            navigate(intendedDestination, {replace: true});
            return;
        }

        if (isAuthenticated && isExplicitLogin && hasLoggedOut.current) {
            navigate(intendedDestination, {replace: true});
        }
    }, [isAuthenticated, isLoading, isExplicitLogin, logout, navigate, intendedDestination]);

    const handleOnSuccess = async (credentialResponse: CredentialResponse) => {
        console.log('LoginPage: Google login success received');
        if (!credentialResponse.credential) {
            const errorMsg = 'Did not receive credential from Google.';
            setError(errorMsg);
            return;
        }
        
        setIsLoggingIn(true);
        setError('');
        
        try {
            const idToken = credentialResponse.credential;
            console.log('LoginPage: Calling login with token');
            await login(idToken);
            console.log('LoginPage: Login completed successfully');
            // Navigation will happen automatically via useEffect when isAuthenticated changes
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
                            width="100%"
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