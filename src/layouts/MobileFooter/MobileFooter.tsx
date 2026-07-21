import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LuBookOpen, LuHeart, LuTreePine, LuUser, LuZap } from 'react-icons/lu';
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
        id: 'garden',
        labelKey: 'mobileFooter.garden',
        icon: <LuTreePine size={22} />,
        activeIcon: <LuTreePine size={24} />,
    },
    {
        id: 'entries',
        labelKey: 'mobileFooter.journal',
        icon: <LuBookOpen size={22} />,
        activeIcon: <LuBookOpen size={24} />,
        requiresAuth: true,
    },
    {
        id: 'add',
        labelKey: '',
        icon: <AddIcon sx={{ fontSize: 26 }} />,
        activeIcon: <AddIcon sx={{ fontSize: 26 }} />,
        isFab: true,
        requiresAuth: true,
    },
    {
        id: 'emotion',
        labelKey: 'mobileFooter.emotion',
        icon: <LuHeart size={22} />,
        activeIcon: <LuHeart size={24} />,
        requiresAuth: true,
    },
    {
        id: 'energy',
        labelKey: 'mobileFooter.energy',
        icon: <LuZap size={22} />,
        activeIcon: <LuZap size={24} />,
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
            case 'garden':
                return location.pathname === APP_ROUTES.WELCOME || location.pathname === APP_ROUTES.HOME;
            case 'entries':
                return location.pathname.startsWith(APP_ROUTES.ENTRIES);
            case 'emotion':
                return location.pathname === APP_ROUTES.EMOTION_ZONE;
            case 'energy':
                return location.pathname === APP_ROUTES.ENERGY_HISTORY;
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
            case 'garden':
                navigate(APP_ROUTES.WELCOME);
                break;
            case 'entries':
                navigate(APP_ROUTES.ENTRIES_LIST);
                break;
            case 'add':
                navigate(APP_ROUTES.ENTRIES_NEW);
                break;
            case 'emotion':
                navigate(APP_ROUTES.EMOTION_ZONE);
                break;
            case 'energy':
                navigate(APP_ROUTES.ENERGY_HISTORY);
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
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleNavClick(item)}
                                className="mobile-footer__fab"
                            >
                                <IconButton className="mobile-footer__fab-button">
                                    {item.icon}
                                </IconButton>
                            </button>
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
