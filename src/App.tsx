import './App.scss';
import {lazy, Suspense} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {APP_ROUTES} from "./constants/route.ts";
import Loading from "./components/Loading/Loading.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import MainLayout from "./components/MainLayout/MainLayout.tsx";

const WelcomePage = lazy(() => import('./pages/welcome/WelcomePage'));
const HomePage = lazy(() => import('./pages/home/Homepage'));
const EntriesPage = lazy(() => import('./pages/entries/EntriesPage'));
const LoginPage = lazy(() => import('./pages/login/LoginPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));

const LoadingFallback = () => <Loading message="Loading page..." fullHeight />;

const App = () => {

    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public ProtectedRoute - accessible without authentication */}
                <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />

                {/* Routes with MainLayout */}
                <Route path={APP_ROUTES.WELCOME} element={<MainLayout />}>
                    {/* WelcomePage - Public but redirects if authenticated */}
                    <Route index element={<WelcomePage />} />

                    {/* Protected ProtectedRoute - require authentication */}
                    <Route path="home" element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } />

                    <Route path="entries" element={
                        <ProtectedRoute>
                            <EntriesPage />
                        </ProtectedRoute>
                    } />

                    <Route path="profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                </Route>

                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
            </Routes>
        </Suspense>
    );
};

export default App
