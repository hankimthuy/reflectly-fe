import './App.scss';
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes";
import {GoogleOAuthProvider} from "@react-oauth/google"; // Import the SCSS file for styling

const App: React.FC = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return <div>Lỗi cấu hình: Vui lòng kiểm tra Google Client ID.</div>;
  }
  return (
      <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      </GoogleOAuthProvider>

  );
};
export default App
