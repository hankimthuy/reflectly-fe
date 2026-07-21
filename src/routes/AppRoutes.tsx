import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import NotFoundPage from '../components/NotFound/NotFound';
import { APP_ROUTES } from '../constants/route';
import MainLayout from '../layouts/MainLayout/MainLayout';
import EntriesListPage from '../pages/EntriesPage/EntriesListPage/EntriesListPage';
import QuotesPage from '../pages/QuotesPage/QuotesPage';
import ProtectedRoute from './ProtectedRoute';

const NewEntryPage = lazy(() => import('../pages/EntriesPage/NewEntryPage/NewEntryPage'));
const EditEntryPage = lazy(() => import('../pages/EntriesPage/EditEntryPage/EditEntryPage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage/ProfilePage'));
const MimoLandingPage = lazy(() => import('../pages/MimoLandingPage/MimoLandingPage'));
const PhuongPhapPage = lazy(() => import('../pages/PhuongPhapPage/PhuongPhapPage'));
const GardenZonePage = lazy(() => import('../pages/GardenZonePage/GardenZonePage'));
const EmotionZonePage = lazy(() => import('../pages/EmotionZonePage/EmotionZonePage'));
const SignupPage = lazy(() => import('../pages/SignupPage/SignupPage'));
const EnergyHistoryPage = lazy(() => import('../pages/EnergyHistoryPage/EnergyHistoryPage'));
const StatisticsPage = lazy(() => import('../pages/StatisticsPage/StatisticsPage'));

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
                <Route path={APP_ROUTES.PHUONG_PHAP} element={<PhuongPhapPage />} />
                <Route path={APP_ROUTES.REFLECTION_ZONE} element={<GardenZonePage zoneId="tu-chiem-nghiem" />} />
                <Route path={APP_ROUTES.CREATIVITY_ZONE} element={<GardenZonePage zoneId="sang-tao" />} />
                <Route path={APP_ROUTES.CONNECTION_ZONE} element={<GardenZonePage zoneId="ket-noi" />} />
                <Route path={APP_ROUTES.EMOTION_ZONE} element={
                    <ProtectedRoute>
                        <EmotionZonePage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.ENERGY_HISTORY} element={
                    <ProtectedRoute>
                        <EnergyHistoryPage />
                    </ProtectedRoute>
                } />

                {/* Legacy redirects */}
                <Route path={APP_ROUTES.INNERVERSE} element={<Navigate to={APP_ROUTES.REFLECTION_ZONE} replace />} />
                <Route path={APP_ROUTES.OUTERVERSE} element={<Navigate to={APP_ROUTES.CONNECTION_ZONE} replace />} />
                <Route path={APP_ROUTES.MIMO_METHOD} element={<Navigate to={APP_ROUTES.PHUONG_PHAP} replace />} />

                <Route path={APP_ROUTES.HOME} element={
                    <ProtectedRoute>
                        <MimoLandingPage />
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
