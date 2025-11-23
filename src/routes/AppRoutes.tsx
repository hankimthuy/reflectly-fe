import {lazy} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
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
        element={<LoginPage />}
      />

      <Route
        path={APP_ROUTES.WELCOME}
        element={
          <MainLayout>
            <WelcomePage />
          </MainLayout>
        }
      />

      <Route
        path={APP_ROUTES.HOME}
        element={
          <MainLayout>
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          </MainLayout>
        }
      />

      <Route
        path={APP_ROUTES.ENTRIES}
        element={
          <MainLayout>
            <ProtectedRoute>
              <EntriesPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />

      <Route
        path={APP_ROUTES.PROFILE}
        element={
          <MainLayout>
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          </MainLayout>
        }
      />

      <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
    </Routes>
  );
};

