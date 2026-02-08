import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LuBrainCircuit, LuActivity, LuList, LuUser } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeContext';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import './MobileFooter.scss';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    isFab?: boolean;
    requiresAuth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    {
        id: 'innerverse',
        label: 'Inner',
        icon: <LuBrainCircuit size={22} />,
        activeIcon: <LuBrainCircuit size={24} />,
    },
    {
        id: 'entries',
        label: 'Entries',
        icon: <LuList size={22} />,
        activeIcon: <LuList size={24} />,
        requiresAuth: true,
    },
    {
        id: 'add',
        label: '',
        icon: <AddIcon sx={{ fontSize: 26 }} />,
        activeIcon: <AddIcon sx={{ fontSize: 26 }} />,
        isFab: true,
        requiresAuth: true,
    },
    {
        id: 'outerverse',
        label: 'Outer',
        icon: <LuActivity size={22} />,
        activeIcon: <LuActivity size={24} />,
    },
    {
        id: 'profile',
        label: 'Me',
        icon: <LuUser size={22} />,
        activeIcon: <LuUser size={24} />,
    },
];

const MobileFooter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const { mobileTab, setMobileTab } = useTheme();
    const [authDialogOpen, setAuthDialogOpen] = useState(false);

    const isActive = (id: string): boolean => {
        switch (id) {
            case 'innerverse':
                return mobileTab === 'inner';
            case 'entries':
                return location.pathname === APP_ROUTES.ENTRIES_LIST;
            case 'outerverse':
                return mobileTab === 'outer';
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
            case 'innerverse':
                setMobileTab('inner');
                navigate(APP_ROUTES.INNERVERSE);
                break;
            case 'entries':
                navigate(APP_ROUTES.ENTRIES_LIST);
                break;
            case 'add':
                navigate(APP_ROUTES.ENTRIES_NEW);
                break;
            case 'outerverse':
                setMobileTab('outer');
                navigate(APP_ROUTES.OUTERVERSE);
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

    const modeClass = mobileTab === 'outer' ? 'mobile-footer--outer' : 'mobile-footer--inner';

    return (
        <>
            <Box className={`mobile-footer ${modeClass}`}>
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
                                <span className="mobile-footer__label">{item.label}</span>
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
