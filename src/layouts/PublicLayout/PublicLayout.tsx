import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import { ButtonLink } from '../../components/Button/Button';
import './PublicLayout.scss';

interface PublicLayoutProps {
    children: ReactNode;
}

/**
 * The marketing landing page's own shell: a top header with the wordmark and the two doors in
 * (sign in / start free), never the authenticated app's sidebar — see mockups 3a/4a. Login,
 * Signup, Onboarding and 404 render with no chrome at all, so they don't use this layout either.
 */
const PublicLayout = ({ children }: PublicLayoutProps) => {
    const { t } = useTranslation();
    const { currentUser } = useAuth();

    return (
        <div className="public-layout">
            <header className="public-layout__header">
                <div className="public-layout__brand">
                    <Link to={APP_ROUTES.WELCOME} className="public-layout__wordmark">{t('brand.name')}</Link>
                    <span className="public-layout__tagline">{t('brand.tagline')}</span>
                </div>
                <div className="public-layout__actions">
                    {currentUser ? (
                        <ButtonLink to={APP_ROUTES.HOME} variant="primary">{t('publicLayout.goToToday')}</ButtonLink>
                    ) : (
                        <>
                            <ButtonLink to={APP_ROUTES.LOGIN} variant="ghost">{t('nav.login')}</ButtonLink>
                            <ButtonLink to={APP_ROUTES.SIGNUP} variant="primary">{t('publicLayout.startFree')}</ButtonLink>
                        </>
                    )}
                </div>
            </header>
            <main className="public-layout__content">{children}</main>
        </div>
    );
};

export default PublicLayout;
