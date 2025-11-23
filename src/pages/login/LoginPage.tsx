import { GoogleLogin } from "@react-oauth/google";
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/route';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { useAuth } from '../../providers/AuthProvider';
import './LoginPage.scss';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {error, isAuthenticated} = useAuth();

    const intendedDestination = location.state?.from || APP_ROUTES.HOME;

    const {
        isLoggingIn,
        error: googleError,
        handleGoogleSuccess,
        handleGoogleError,
        clearError
    } = useGoogleAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(intendedDestination, {replace: true});
        }
    }, [isAuthenticated, navigate, intendedDestination]);

    useEffect(() => {
        clearError();
    }, [clearError]);

    const currentError = error || googleError;

    return (
        <main className="main-content">
            <div className="login-container">
                <div className="login-card">
                    <p>Sign in to continue to your account</p>

                    {/* Error Display */}
                    {currentError && (
                        <div className="error-message">
                            {currentError}
                        </div>
                    )}

                    <div className="google-button-wrapper">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
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