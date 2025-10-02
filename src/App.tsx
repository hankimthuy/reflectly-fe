import './App.scss';
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import {GoogleOAuthProvider} from "@react-oauth/google"; 
import { AuthProvider } from './providers/AuthProvider.tsx';
import ErrorPage from './components/common/ErrorPage/ErrorPage';
import { ENV_CONFIG, validateEnvironment } from './config/environment';

const App: React.FC = () => {
  // Validate environment configuration
  if (!validateEnvironment()) {
    return (
      <ErrorPage 
        title="Configuration Error"
        message="The application is not properly configured. Please check your environment variables."
        tip="💡 Make sure VITE_GOOGLE_CLIENT_ID and VITE_API_URL are set correctly"
      />
    );
  }

  if (!ENV_CONFIG.GOOGLE_CLIENT_ID) {
    return (
      <ErrorPage 
        title="App is temporarily unavailable"
        message="We're experiencing some technical difficulties. Please try again later or contact support if the problem persists."
        tip="💡 Try refreshing the page in a few minutes"
      />
    );
  }

  return (
      <GoogleOAuthProvider clientId={ENV_CONFIG.GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <BrowserRouter basename="/">
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </GoogleOAuthProvider>
  );
};
export default App
