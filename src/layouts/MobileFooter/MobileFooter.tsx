import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { LuBookOpen, LuLayoutDashboard, LuMessageCircle, LuUser } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import './MobileFooter.scss';

interface NavItem {
    id: string;
    labelKey: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    isFab?: boolean;
    requiresAuth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    {
        id: 'coach',
        labelKey: 'mobileFooter.coach',
        icon: <LuMessageCircle size={22} />,
        activeIcon: <LuMessageCircle size={24} />,
        requiresAuth: true,
    },
    {
        id: 'dashboard',
        labelKey: 'mobileFooter.dashboard',
        icon: <LuLayoutDashboard size={22} />,
        activeIcon: <LuLayoutDashboard size={24} />,
        requiresAuth: true,
    },
    {
        id: 'add',
        labelKey: '',
        icon: <ChatBubbleOutlineIcon sx={{ fontSize: 24 }} />,
        activeIcon: <ChatBubbleOutlineIcon sx={{ fontSize: 24 }} />,
        isFab: true,
        requiresAuth: true,
    },
    {
        id: 'entries',
        labelKey: 'mobileFooter.journal',
        icon: <LuBookOpen size={22} />,
        activeIcon: <LuBookOpen size={24} />,
        requiresAuth: true,
    },
    {
        id: 'profile',
        labelKey: 'mobileFooter.profile',
        icon: <LuUser size={22} />,
        activeIcon: <LuUser size={24} />,
    },
];

const MobileFooter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [authDialogOpen, setAuthDialogOpen] = useState(false);

    const isActive = (id: string): boolean => {
        switch (id) {
            case 'coach':
                return location.pathname === APP_ROUTES.COACH_CHAT;
            case 'dashboard':
                return location.pathname === APP_ROUTES.DASHBOARD;
            case 'entries':
                return location.pathname.startsWith(APP_ROUTES.ENTRIES);
            case 'profile':
                return location.pathname === APP_ROUTES.PROFILE;
            default:
                return false;
        }
    };

    const handleNavClick = (item: NavItem) => {
        if (item.requiresAuth && !isAuthenticated) {
            setAuthDialogOpen(true);
            return;
        }

        switch (item.id) {
            case 'coach':
            case 'add':
                navigate(APP_ROUTES.COACH_CHAT);
                break;
            case 'dashboard':
                navigate(APP_ROUTES.DASHBOARD);
                break;
            case 'entries':
                navigate(APP_ROUTES.ENTRIES_LIST);
                break;
            case 'profile':
                if (isAuthenticated) {
                    navigate(APP_ROUTES.PROFILE);
                } else {
                    navigate(APP_ROUTES.LOGIN);
                }
                break;
        }
    };

    const handleAuthConfirm = () => {
        setAuthDialogOpen(false);
        navigate(APP_ROUTES.LOGIN);
    };

    return (
        <>
            <Box className="mobile-footer mobile-footer--garden">
                <Box className="mobile-footer__container">
                    {NAV_ITEMS.map((item) => (
                        item.isFab ? (
                            <IconButton
                                key={item.id}
                                onClick={() => handleNavClick(item)}
                                className="mobile-footer__fab mobile-footer__fab-button"
                            >
                                {item.icon}
                            </IconButton>
                        ) : (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleNavClick(item)}
                                className={`mobile-footer__item ${isActive(item.id) ? 'mobile-footer__item--active' : ''}`}
                            >
                                {isActive(item.id) ? item.activeIcon : item.icon}
                                <span className="mobile-footer__label">{t(item.labelKey)}</span>
                            </button>
                        )
                    ))}
                </Box>
            </Box>

            <ConfirmDialog
                open={authDialogOpen}
                title={t('mobileFooter.authDialog.title')}
                message={t('mobileFooter.authDialog.message')}
                confirmText={t('mobileFooter.authDialog.confirm')}
                cancelText={t('mobileFooter.authDialog.cancel')}
                onConfirm={handleAuthConfirm}
                onCancel={() => setAuthDialogOpen(false)}
            />
        </>
    );
};

export default MobileFooter;
