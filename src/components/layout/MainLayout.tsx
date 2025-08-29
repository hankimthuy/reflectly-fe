import React from 'react';
import './MainLayout.scss';
import HomeHeader from "../common/Header/Header.tsx";
import NavigationBar from "../common/NavigationBar/NavigationBar.tsx"; // Import the SCSS file for styling
import { Outlet } from 'react-router-dom';

/**
 * @component MainLayout
 * @description The main dashboard screen for the Reflectly app, now composed of smaller,
 * reusable TypeScript components.
 * @returns {JSX.Element} The rendered MainLayout component.
 */

const MainLayout: React.FC = () => {
  const todayDate = `Today, ${new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    month: 'long',
    day: 'numeric',
  })}`;

  return (
      <div className="page">
        <div className="container">
          <HomeHeader date={todayDate} />
          <Outlet />
          <NavigationBar />
        </div>
      </div>
  );
};


export default MainLayout;