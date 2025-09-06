// src/components/BaseCard.tsx
import React from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import './Header.scss';
import {Link} from "react-router-dom";

const todayDate = `Today, ${new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Ho_Chi_Minh',
  month: 'long',
  day: 'numeric',
})}`;

const HomeHeader: React.FC = () => {

   return (
        <header className="home-header">
            <div className="app-logo-background">
                <span className="app-logo">
                    <span className="app-logo--primary">Reflect</span>
                    <span className="app-logo--secondary">ly</span>
                </span>
              <Link to="/login" className="item">
                <AccountCircleOutlinedIcon className="profile-icon"/>
              </Link>
            </div>
            <h1 className="date">{todayDate}</h1>
        </header>
    );
};

export default HomeHeader;