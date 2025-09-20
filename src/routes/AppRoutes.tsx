// src/routes/index.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '../components/common/Loading/Loading';
import ProtectedRoute from './ProtectedRoute';

const MainLayout = lazy(() => import('../components/layout/MainLayout'));
const HomePage = lazy(() => import('../pages/home/Homepage'));
const EntriesPage = lazy(() => import('../pages/entries/EntriesPage'));
const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));

const LoadingFallback = () => <Loading message="Loading page..." fullHeight />;

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* HomePage - Public but redirects if authenticated */}
          <Route index element={<HomePage />} />
          
          {/* Protected routes - require authentication */}
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;