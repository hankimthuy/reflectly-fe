import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import NotFoundPage from '../components/NotFound/NotFound';
import { APP_ROUTES } from '../constants/route';
import MainLayout from '../layouts/MainLayout/MainLayout';
import EntriesListPage from '../pages/EntriesPage/EntriesListPage/EntriesListPage';
import ProtectedRoute from './ProtectedRoute';

const NewEntryPage = lazy(() => import('../pages/EntriesPage/NewEntryPage/NewEntryPage'));
const EditEntryPage = lazy(() => import('../pages/EntriesPage/EditEntryPage/EditEntryPage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage/ProfilePage'));
const MimoLandingPage = lazy(() => import('../pages/MimoLandingPage/MimoLandingPage'));
const SignupPage = lazy(() => import('../pages/SignupPage/SignupPage'));
const CoachChatPage = lazy(() => import('../pages/CoachChatPage/CoachChatPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage/DashboardPage'));
const OnboardingPage = lazy(() => import('../pages/OnboardingPage/OnboardingPage'));

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={APP_ROUTES.SIGNUP} element={<SignupPage />} />

            <Route element={
                <MainLayout>
                    <Outlet />
                </MainLayout>
            }>
                <Route path={APP_ROUTES.WELCOME} element={<MimoLandingPage />} />
                <Route path={APP_ROUTES.COACH_CHAT} element={
                    <ProtectedRoute>
                        <CoachChatPage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.DASHBOARD} element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.ONBOARDING} element={
                    <ProtectedRoute skipOnboardingGate>
                        <OnboardingPage />
                    </ProtectedRoute>
                } />

                <Route path={APP_ROUTES.HOME} element={
                    <ProtectedRoute>
                        <MimoLandingPage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.PROFILE} element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.ENTRIES_NEW} element={
                    <ProtectedRoute>
                        <NewEntryPage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.ENTRIES_EDIT} element={
                    <ProtectedRoute>
                        <EditEntryPage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.ENTRIES_LIST} element={
                    <ProtectedRoute>
                        <EntriesListPage />
                    </ProtectedRoute>
                } />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
