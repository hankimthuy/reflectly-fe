import {lazy} from 'react';
import {Navigate, Outlet, Route, Routes} from 'react-router-dom';
import {APP_ROUTES} from '../constants/route';
import MainLayout from '../components/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

const WelcomePage = lazy(() => import('../pages/welcome/WelcomePage'));
const HomePage = lazy(() => import('../pages/home/Homepage'));
const EntriesPage = lazy(() => import('../pages/entries/EntriesPage'));
const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));

export const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path={APP_ROUTES.LOGIN}
                element={<LoginPage/>}
            />
            <Route element={
                <MainLayout>
                    <Outlet/>
                </MainLayout>
            }>
                <Route path={APP_ROUTES.WELCOME} element={<WelcomePage/>}/>
                <Route path={APP_ROUTES.HOME} element={
                    <ProtectedRoute>
                        <HomePage/>
                    </ProtectedRoute>
                }/>
                <Route path={APP_ROUTES.PROFILE} element={
                    <ProtectedRoute>
                        <ProfilePage/>
                    </ProtectedRoute>
                }/>
                <Route path={APP_ROUTES.ENTRIES} element={
                    <ProtectedRoute>
                        <EntriesPage/>
                    </ProtectedRoute>
                }/>
            </Route>
            <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace/>}/>
        </Routes>
    );
};

