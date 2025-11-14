import './App.scss';
import {lazy, Suspense, useEffect} from "react";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {APP_ROUTES} from "./constants/route.ts";
import Loading from "./components/Loading/Loading.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import MainLayout from "./components/MainLayout/MainLayout.tsx";
import NavigationService from "./services/utils/navigationService";
import {useAuth} from "./providers/AuthProvider";

const WelcomePage = lazy(() => import('./pages/welcome/WelcomePage'));
const HomePage = lazy(() => import('./pages/home/Homepage'));
const EntriesPage = lazy(() => import('./pages/entries/EntriesPage'));
const LoginPage = lazy(() => import('./pages/login/LoginPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));

const LoadingFallback = () => <Loading message="Loading page..." fullHeight />;

const App = () => {
    const navigate = useNavigate();
    const {isLoading} = useAuth();

    useEffect(() => {
        NavigationService.setNavigate(navigate);
    }, [navigate]);

    return (
        <>
            {isLoading && (
                <div className="loading-overlay">
                    <Loading message="Please wait..." />
                </div>
            )}
            <Routes>
            <Route path={APP_ROUTES.LOGIN} element={
                <Suspense fallback={<LoadingFallback />}>
                    <LoginPage />
                </Suspense>
            } />

            <Route path={APP_ROUTES.WELCOME} element={
                <MainLayout>
                    <Suspense fallback={<LoadingFallback />}>
                        <WelcomePage />
                    </Suspense>
                </MainLayout>
            } />

            <Route path={APP_ROUTES.HOME} element={
                <MainLayout>
                    <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    </Suspense>
                </MainLayout>
            } />

            <Route path={APP_ROUTES.ENTRIES} element={
                <MainLayout>
                    <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute>
                            <EntriesPage />
                        </ProtectedRoute>
                    </Suspense>
                </MainLayout>
            } />

            <Route path={APP_ROUTES.PROFILE} element={
                <MainLayout>
                    <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    </Suspense>
                </MainLayout>
            } />

            <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
        </Routes>
        </>
    );
};

export default App
