import React from 'react';
import './LoginPage.scss';
import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {loginWithGoogleIdToken} from "../../services/auth.service.ts";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleGoogleButtonLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const idToken = credentialResponse.credential;

      try {
        const backendResponse = await loginWithGoogleIdToken(idToken);
        console.log('Response from Backend:', backendResponse);
        // Use AuthContext to persist and update app state
        login(backendResponse.user, backendResponse.token);
        navigate('/');

      } catch (error) {
        console.error(error, 'Login failed during backend authentication step.');
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
              theme="outline"
              size="large"
          />
        </div>
      </div>
  );
};

export default LoginPage;