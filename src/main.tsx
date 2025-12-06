import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import {AuthProvider} from "./providers/AuthProvider.tsx";
import {SnackbarProvider} from "./providers/SnackbarProvider.tsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename="/">
            <AuthProvider>
                <SnackbarProvider>
                    <App/>
                </SnackbarProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
