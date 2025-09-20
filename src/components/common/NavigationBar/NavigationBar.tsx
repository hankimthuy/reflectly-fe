// src/components/NavigationBar.tsx
import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddIcon from '@mui/icons-material/Add';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import './NavigationBar.scss'
import { Link, useLocation } from 'react-router-dom';

type NavigationBarProps = object

const NavigationBar: React.FC<NavigationBarProps> = () => {
    const location = useLocation();
    
    const isActive = (path: string) => {
        return location.pathname === path ? 'item--active' : '';
    };

    return (
        <nav className="nav-bar">
          <Link  to="/entries" className={`item ${isActive('/entries')}`}>
            <HomeOutlinedIcon />
            <span>Home</span>
          </Link>
          <Link to="/new-entry" className="add-button">
            <AddIcon />
          </Link>
          <Link to="/profile" className={`item ${isActive('/profile')}`}>
            <PersonOutlinedIcon />
            <span>Profile</span>
          </Link>
        </nav>
    );
};

export default NavigationBar;