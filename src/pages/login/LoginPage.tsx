import React from 'react';
import './LoginPage.scss';
import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {loginWithGoogleIdToken} from "../../services/auth.service.ts";

const LoginPage: React.FC = () => {
  const handleGoogleButtonLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const idToken = credentialResponse.credential;
      console.log('JWT ID Token received from Google:', idToken);

      try {
        const backendResponse = await loginWithGoogleIdToken(idToken);

        console.log('Response from Backend:', backendResponse);
        // TODO: Handle successful login: save user token, update auth context, navigate user.

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