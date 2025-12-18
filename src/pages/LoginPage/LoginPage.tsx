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
    const {isAuthenticated, login} = useAuth();

    const intendedDestination = location.state?.from || APP_ROUTES.HOME;

    useEffect(() => {
        if (isAuthenticated) {
            navigate(intendedDestination, {replace: true});
        }
    }, [isAuthenticated, navigate, intendedDestination]);

    const handleOnSuccess = (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            const errorMsg = 'Did not receive credential from Google.';
            setError(errorMsg);
            return;
        }
        try {
            const idToken = credentialResponse.credential;
            login(idToken);
        } catch (error) {
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

    return (
        <main className="main-content">
            <div className="login-container">
                <div className="login-card">
                    <p>Sign in to continue to your account</p>

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