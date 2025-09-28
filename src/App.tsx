import './App.scss';
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import {GoogleOAuthProvider} from "@react-oauth/google"; 
import { AuthProvider } from './providers/AuthProvider.tsx';
import ErrorPage from './components/common/ErrorPage/ErrorPage';

const App: React.FC = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return (
      <ErrorPage 
        title="App is temporarily unavailable"
        message="We're experiencing some technical difficulties. Please try again later or contact support if the problem persists."
        tip="💡 Try refreshing the page in a few minutes"
      />
    );
  }
  return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </GoogleOAuthProvider>
  );
};
export default App
