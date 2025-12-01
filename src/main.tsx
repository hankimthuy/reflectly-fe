import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import {AuthProvider} from "./providers/AuthProvider.tsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename="/">
            <AuthProvider>
                <App/>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
