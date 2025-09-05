// src/routes/index.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const MainLayout = lazy(() => import('../components/layout/MainLayout'));
const HomePage = lazy(() => import('../pages/home/Homepage'));
const EntriesPage = lazy(() => import('../pages/entries/EntriesPage'));
const LoginPage = lazy(() => import('../pages/login/LoginPage'));

const LoadingFallback = () => <div>Loading...</div>;

function AppRoutes() {
  return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="entries" element={<EntriesPage />} />
          </Route>
        </Routes>
      </Suspense>
  );
}

export default AppRoutes;