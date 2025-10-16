import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import {AuthProvider} from "./providers/AuthProvider.tsx";
import {BrowserRouter} from "react-router-dom";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <AuthProvider>
              <BrowserRouter basename="/">
                  <App/>
              </BrowserRouter>
          </AuthProvider>
      </GoogleOAuthProvider>
  </StrictMode>,
)
