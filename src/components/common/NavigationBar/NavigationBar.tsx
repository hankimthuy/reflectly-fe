// src/components/NavigationBar.tsx
import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddIcon from '@mui/icons-material/Add';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import './NavigationBar.scss'
import { Link } from 'react-router-dom';

/**
 * @interface NavigationBarProps
 * @description Props for the NavigationBar component.
 */
type NavigationBarProps = object

/**
 * @component NavigationBar
 * @description Displays the main navigation bar at the bottom of the page.
 * @param {NavigationBarProps} props The component props.
 * @returns {JSX.Element} The rendered NavigationBar component.
 */
const NavigationBar: React.FC<NavigationBarProps> = () => {
    return (
        <nav className="nav-bar">
          <Link to="/" className="item item--active">
            <HomeOutlinedIcon />
            <span>Home</span>
          </Link>
          <Link to="/new-entry" className="add-button">
            <AddIcon />
          </Link>
          <Link to="/entries" className="item">
            <SettingsOutlinedIcon />
            <span>Entries</span>
          </Link>
        </nav>
    );
};

export default NavigationBar;