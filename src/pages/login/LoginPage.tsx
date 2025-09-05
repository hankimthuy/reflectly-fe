import React from 'react';
import './LoginPage.scss';
import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";

const LoginPage: React.FC = () => {
  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    console.log('JWT ID Token:', credentialResponse.credential);

    // SECURITY BEST PRACTICE:
    // This token should be sent to your backend server.
    // The backend must verify the token's integrity with Google's public keys
    // before creating a user session or granting access.
    // Example: sendTokenToBackend(credentialResponse.credential);
  };

  const handleLoginError = () => {
    console.error('Login Failed');
  };

  return (
      <div className="login-container" style={{padding: '50px', textAlign: 'center'}}>
        <h2>Welcome Back!</h2>
        <p>Please sign in using your Google account to continue.</p>
        <div className="google-button-wrapper" style={{marginTop: '20px'}}>
          <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              useOneTap // Enables the One Tap sign-in experience for returning users
              theme="outline"
              size="large"
          />
        </div>
      </div>
  );
};

export default LoginPage;