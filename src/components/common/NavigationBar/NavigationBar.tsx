// src/components/NavigationBar.tsx
import AddIcon from '@mui/icons-material/Add';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavigationBar.scss';
import { APP_ROUTES } from '../../../config/route';

type NavigationBarProps = object

const NavigationBar: React.FC<NavigationBarProps> = () => {
    const location = useLocation();
    
    const isActive = (path: string) => {
        return location.pathname === path ? 'item--active' : '';
    };

    return (
        <nav className="nav-bar">
          <Link  to={APP_ROUTES.HOME} className={`item ${isActive(APP_ROUTES.HOME)}`}>
            <HomeOutlinedIcon />
            <span>Home</span>
          </Link>
          <Link to={APP_ROUTES.ENTRIES} className="add-button">
            <AddIcon />
          </Link>
          <Link to={APP_ROUTES.PROFILE} className={`item ${isActive(APP_ROUTES.PROFILE)}`}>
            <PersonOutlinedIcon />
            <span>Profile</span>
          </Link>
        </nav>
    );
};

export default NavigationBar;