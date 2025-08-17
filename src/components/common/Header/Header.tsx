// src/components/BaseCard.tsx
import React from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

/**
 * @interface HomeHeaderProps
 * @description Props for the BaseCard component.
 */
interface HomeHeaderProps {
    date: string;
}

/**
 * @component BaseCard
 * @description Displays the app logo, profile icon, and current date.
 * @param {HomeHeaderProps} props The component props.
 * @returns {JSX.Element} The rendered BaseCard component.
 */
const NavigationBar: React.FC<HomeHeaderProps> = ({ date }) => {
    return (
        <header className="home-header">
            <div className="app-logo-background">
                <span className="app-logo">
                    <span className="app-logo--primary">Reflect</span>
                    <span className="app-logo--secondary">ly</span>
                </span>
                <AccountCircleOutlinedIcon className="home-header__profile-icon"/>
            </div>
            <h1 className="home-header__date">{date}</h1>
        </header>
    );
};

export default NavigationBar;