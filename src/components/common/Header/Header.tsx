// src/components/BaseCard.tsx
import React from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import './Header.scss';
import { useGoogleLogin } from '@react-oauth/google';

const todayDate = `Today, ${new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Ho_Chi_Minh',
  month: 'long',
  day: 'numeric',
})}`;

const HomeHeader: React.FC = () => {

  const login = useGoogleLogin({
    onSuccess: codeResponse => console.log(codeResponse),
    flow: 'auth-code',
  });
    return (
        <header className="home-header">
            <div className="app-logo-background">
                <span className="app-logo">
                    <span className="app-logo--primary">Reflect</span>
                    <span className="app-logo--secondary">ly</span>
                </span>
                <AccountCircleOutlinedIcon className="profile-icon" onClick={() => login()}/>
            </div>
            <h1 className="date">{todayDate}</h1>
        </header>
    );
};

export default HomeHeader;