import './App.scss';
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import {GoogleOAuthProvider} from "@react-oauth/google"; 
import { AuthProvider } from './contexts/AuthProvider.tsx';

const App: React.FC = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '123456789-abcdefghijklmnop.apps.googleusercontent.com';

  if (!googleClientId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Lỗi cấu hình: Vui lòng kiểm tra Google Client ID.</h2>
      </div>
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
