import { useMemo, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import PageTransition from '../../components/PageTransition/PageTransition';
import { AppShellContext } from './AppShellContext';
import './AppShell.scss';

interface AppShellProps {
    children: ReactNode;
}

interface NavItem {
    to: string;
    label: string;
    match: (pathname: string) => boolean;
}

// Routes that go full-bleed on mobile — a live conversation and a page mid-write both lose
// their bottom tab bar so nothing competes with the composer, matching mockups 2b/2d (neither
// shows the tab bar the other mobile screens do).
const MOBILE_FULL_BLEED_PREFIXES = [APP_ROUTES.COACH_CHAT, '/entries/new', '/entries/edit'];

const AppShell = ({ children }: AppShellProps) => {
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    const location = useLocation();
    const [sidebarFooter, setSidebarFooter] = useState<ReactNode>(null);

    const navItems: NavItem[] = useMemo(
        () => [
            { to: APP_ROUTES.HOME, label: t('nav.today'), match: (p) => p === APP_ROUTES.HOME },
            { to: APP_ROUTES.COACH_CHAT, label: t('nav.talk'), match: (p) => p.startsWith(APP_ROUTES.COACH_CHAT) },
            {
                to: APP_ROUTES.REFLECT,
                label: t('nav.reflect'),
                match: (p) => p.startsWith(APP_ROUTES.REFLECT) || p.startsWith(APP_ROUTES.DASHBOARD) || p.startsWith(APP_ROUTES.ENTRIES),
            },
            { to: APP_ROUTES.PROFILE, label: t('nav.you'), match: (p) => p.startsWith(APP_ROUTES.PROFILE) },
        ],
        [t],
    );

    const hideMobileTabs = MOBILE_FULL_BLEED_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

    return (
        <AppShellContext.Provider value={{ setSidebarFooter }}>
            <div className="app-shell">
                <aside className="app-shell__sidebar">
                    <div className="app-shell__brand">
                        <div className="app-shell__wordmark">{t('brand.name')}</div>
                        <div className="app-shell__tagline">{t('brand.tagline')}</div>
                    </div>
                    <nav className="app-shell__nav">
                        {navItems.map((item) => {
                            const active = item.match(location.pathname);
                            return (
                                <NavLink key={item.to} to={item.to} className={`app-shell__nav-item ${active ? 'app-shell__nav-item--active' : ''}`}>
                                    <span className="app-shell__nav-dot" aria-hidden="true" />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </nav>
                    <div className="app-shell__footer">
                        {sidebarFooter ?? (
                            <>
                                <div className="app-shell__footer-label">{t('appShell.defaultFooter.label')}</div>
                                <div className="app-shell__footer-name">{currentUser?.fullName}</div>
                            </>
                        )}
                    </div>
                </aside>

                <main className="app-shell__content">
                    <PageTransition>{children}</PageTransition>
                </main>

                <nav className={`app-shell__tabbar ${hideMobileTabs ? 'app-shell__tabbar--hidden' : ''}`}>
                    {navItems.map((item) => {
                        const active = item.match(location.pathname);
                        return (
                            <NavLink key={item.to} to={item.to} className={`app-shell__tab ${active ? 'app-shell__tab--active' : ''}`}>
                                <span className="app-shell__tab-dot" aria-hidden="true" />
                                <span className="app-shell__tab-label">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </AppShellContext.Provider>
    );
};

export default AppShell;
