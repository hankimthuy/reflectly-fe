import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import {AuthProvider} from "./providers/AuthProvider.tsx";
import {SnackbarProvider} from "./providers/SnackbarProvider.tsx";
import {BrowserRouter} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename="/">
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SnackbarProvider>
                    <App/>
                </SnackbarProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)
