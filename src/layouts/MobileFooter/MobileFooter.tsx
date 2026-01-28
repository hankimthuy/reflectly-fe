import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import AddIcon from '@mui/icons-material/Add';
import InsightsIcon from '@mui/icons-material/Insights';
import ListIcon from '@mui/icons-material/List';
import { APP_ROUTES } from '../../constants/route';
import './MobileFooter.scss';

interface NavItem {
    id: string;
    path: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    isFab?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    {
        id: 'home',
        path: APP_ROUTES.HOME,
        icon: <HomeOutlinedIcon sx={{ fontSize: 22 }} />,
        activeIcon: <HomeOutlinedIcon sx={{ fontSize: 24 }} />,
    },
    {
        id: 'quotes',
        path: APP_ROUTES.QUOTES,
        icon: <FormatQuoteIcon sx={{ fontSize: 22 }} />,
        activeIcon: <FormatQuoteIcon sx={{ fontSize: 24 }} />,
    },
    {
        id: 'add',
        path: APP_ROUTES.ENTRIES_NEW,
        icon: <AddIcon sx={{ fontSize: 26 }} />,
        activeIcon: <AddIcon sx={{ fontSize: 26 }} />,
        isFab: true,
    },
    {
        id: 'statistics',
        path: APP_ROUTES.STATISTICS,
        icon: <InsightsIcon sx={{ fontSize: 22 }} />,
        activeIcon: <InsightsIcon sx={{ fontSize: 24 }} />,
    },
    {
        id: 'entries',
        path: APP_ROUTES.ENTRIES_LIST,
        icon: <ListIcon sx={{ fontSize: 22 }} />,
        activeIcon: <ListIcon sx={{ fontSize: 24 }} />,
    },
];

const MobileFooter = () => {
    const location = useLocation();
    const [navIndex, setNavIndex] = useState(() => {
        const currentIndex = NAV_ITEMS.findIndex(item => item.path === location.pathname);
        return currentIndex >= 0 ? currentIndex : 0;
    });

    const isActive = (path: string, idx: number) => {
        return location.pathname === path || navIndex === idx;
    };

    return (
        <Box className="mobile-footer">
            <Box className="mobile-footer__container">
                {NAV_ITEMS.map((item, idx) => (
                    item.isFab ? (
                        <Link 
                            key={item.id} 
                            to={item.path}
                            className="mobile-footer__fab"
                        >
                            <IconButton className="mobile-footer__fab-button">
                                {item.icon}
                            </IconButton>
                        </Link>
                    ) : (
                        <Link
                            key={item.id}
                            to={item.path}
                            onClick={() => setNavIndex(idx)}
                            className={`mobile-footer__item ${isActive(item.path, idx) ? 'mobile-footer__item--active' : ''}`}
                        >
                            {isActive(item.path, idx) ? item.activeIcon : item.icon}
                            {isActive(item.path, idx) && <span className="mobile-footer__indicator"></span>}
                        </Link>
                    )
                ))}
            </Box>
        </Box>
    );
};

export default MobileFooter;
