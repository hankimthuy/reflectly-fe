import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import NotFoundPage from '../components/NotFound/NotFound';
import { APP_ROUTES } from '../constants/route';
import AppShell from '../layouts/AppShell/AppShell';
import PublicLayout from '../layouts/PublicLayout/PublicLayout';
import ProtectedRoute from './ProtectedRoute';

const NewEntryPage = lazy(() => import('../pages/EntriesPage/NewEntryPage/NewEntryPage'));
const EditEntryPage = lazy(() => import('../pages/EntriesPage/EditEntryPage/EditEntryPage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage/ProfilePage'));
const MimoLandingPage = lazy(() => import('../pages/MimoLandingPage/MimoLandingPage'));
const SignupPage = lazy(() => import('../pages/SignupPage/SignupPage'));
const CoachChatPage = lazy(() => import('../pages/CoachChatPage/CoachChatPage'));
const CoachHistoryListPage = lazy(() => import('../pages/CoachHistoryPage/CoachHistoryListPage'));
const CoachHistoryDetailPage = lazy(() => import('../pages/CoachHistoryPage/CoachHistoryDetailPage'));
const OnboardingPage = lazy(() => import('../pages/OnboardingPage/OnboardingPage'));
const TodayPage = lazy(() => import('../pages/TodayPage/TodayPage'));
const ReflectPage = lazy(() => import('../pages/ReflectPage/ReflectPage'));

// Old bookmarks/links into the pre-redesign Dashboard and Entries list now land on the
// matching Reflect tab instead of a dead route — see constants/route.ts.
const RedirectToReflect = ({ tab }: { tab: 'people' | 'journal' }) => {
    const location = useLocation();
    return <Navigate to={`${APP_ROUTES.REFLECT}/${tab}`} replace state={location.state} />;
};

export const AppRoutes = () => {
    return (
        <Routes>
            {/* No chrome at all — each of these owns its whole screen (see mockups 2c, 3b, 3c). */}
            <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={APP_ROUTES.SIGNUP} element={<SignupPage />} />
            <Route path={APP_ROUTES.ONBOARDING} element={
                <ProtectedRoute skipOnboardingGate>
                    <OnboardingPage />
                </ProtectedRoute>
            } />

            {/* The public marketing home — top header, not the authenticated app shell. */}
            <Route element={<PublicLayout><Outlet /></PublicLayout>}>
                <Route path={APP_ROUTES.WELCOME} element={<MimoLandingPage />} />
            </Route>

            {/* The authenticated app: Today / Talk / Reflect / You, sidebar (desktop) or bottom
                tabs (mobile), no top header and no FAB — see the redesign brief, section 02. */}
            <Route element={<AppShell><Outlet /></AppShell>}>
                <Route path={APP_ROUTES.HOME} element={
                    <ProtectedRoute>
                        <TodayPage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.COACH_CHAT} element={
                    <ProtectedRoute>
                        <CoachChatPage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.COACH_HISTORY} element={
                    <ProtectedRoute>
                        <CoachHistoryListPage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.COACH_HISTORY_DETAIL} element={
                    <ProtectedRoute>
                        <CoachHistoryDetailPage />
                    </ProtectedRoute>
                } />
                <Route path={`${APP_ROUTES.REFLECT}/:tab`} element={
                    <ProtectedRoute>
                        <ReflectPage />
                    </ProtectedRoute>
                } />
                <Route path={APP_ROUTES.REFLECT} element={<Navigate to={`${APP_ROUTES.REFLECT}/people`} replace />} />
                <Route path={APP_ROUTES.DASHBOARD} element={<RedirectToReflect tab="people" />} />
                <Route path={APP_ROUTES.ENTRIES_LIST} element={<RedirectToReflect tab="journal" />} />
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
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
