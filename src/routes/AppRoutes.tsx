import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import NotFoundPage from '../components/NotFound/NotFound';
import { APP_ROUTES } from '../constants/route';
import MainLayout from '../layouts/MainLayout/MainLayout';
import EntriesListPage from '../pages/EntriesPage/EntriesListPage/EntriesListPage';
import QuotesPage from '../pages/QuotesPage/QuotesPage';
import StatisticsPage from '../pages/StatisticsPage/StatisticsPage';
import ProtectedRoute from './ProtectedRoute';

const WelcomePage = lazy(() => import('../pages/WelcomePage/WelcomePage'));
const HomePage = lazy(() => import('../pages/Homepage/Homepage'));
const NewEntryPage = lazy(() => import('../pages/EntriesPage/NewEntryPage/NewEntryPage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage/ProfilePage'));

export const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path={APP_ROUTES.LOGIN}
                element={<LoginPage />}
            />
            <Route element={
                <MainLayout>
                    <Outlet />
                </MainLayout>
            }>
                <Route path={APP_ROUTES.WELCOME} element={<WelcomePage />} />
                <Route path={APP_ROUTES.HOME} element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.STATISTICS} element={
                    <ProtectedRoute>
                        <StatisticsPage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.QUOTES} element={
                    <ProtectedRoute>
                        <QuotesPage />
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

