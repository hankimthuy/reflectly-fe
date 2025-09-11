import React from 'react';
import './LoginPage.scss';
import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {loginWithGoogleIdToken} from "../../services/auth.service.ts";
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const handleGoogleButtonLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const idToken = credentialResponse.credential;

      try {
        const backendResponse = await loginWithGoogleIdToken(idToken);
        console.log('Response from Backend:', backendResponse);

        // Save token to localStorage for API client
        localStorage.setItem('id_token', backendResponse.token);

        // Save user info to sessionStorage for header display
        sessionStorage.setItem('google_user_info', JSON.stringify(backendResponse.user));

        // Notify app of auth change so headers update immediately
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user: backendResponse.user } }));

        navigate('/');

      } catch (error) {
        console.error('Login failed during backend authentication step.');
      }
    } else {
      console.error('Did not receive credential from Google.');
    }
  };

  const handleLoginError = () => {
    console.error('Login Failed');
  };

  return (
      <div className="login-container" style={{padding: '50px', textAlign: 'center'}}>
        <h2>Welcome Back!</h2>

        <div className="google-button-wrapper" style={{marginTop: '20px'}}>
          <GoogleLogin
              onSuccess={handleGoogleButtonLoginSuccess}
              onError={handleLoginError}
              useOneTap // Enables the One Tap sign-in experience
              theme="outline"
              size="large"
          />
        </div>
      </div>
  );
};

export default LoginPage;