// src/components/NavigationBar.tsx
import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddIcon from '@mui/icons-material/Add';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

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
            <a href="#home" className="nav-bar__item nav-bar__item--active">
                <HomeOutlinedIcon />
                <span>Home</span>
            </a>
            <a href="#new-entry" className="nav-bar__add-button">
                <AddIcon />
            </a>
            <a href="#entries" className="nav-bar__item">
                <SettingsOutlinedIcon />
                <span>Entries</span>
            </a>
        </nav>
    );
};

export default NavigationBar;