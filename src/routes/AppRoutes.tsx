// src/routes/index.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '../components/common/Loading/Loading';
import ProtectedRoute from './ProtectedRoute';
import { APP_ROUTES } from '../config/route';

const MainLayout = lazy(() => import('../components/layout/MainLayout'));
const WelcomePage = lazy(() => import('../pages/welcome/WelcomePage'));
const HomePage = lazy(() => import('../pages/home/HomePage'));
const EntriesPage = lazy(() => import('../pages/entries/EntriesPage'));
const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));

const LoadingFallback = () => <Loading message="Loading page..." fullHeight />;

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
        
        {/* Routes with MainLayout */}
        <Route path={APP_ROUTES.WELCOME} element={<MainLayout />}>
          {/* WelcomePage - Public but redirects if authenticated */}
          <Route index element={<WelcomePage />} />
          
          {/* Protected routes - require authentication */}
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
}

export default AppRoutes;