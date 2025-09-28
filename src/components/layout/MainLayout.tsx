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
  return (
      <div className="main-layout-page">
        <div className="main-layout-container">
          <HomeHeader />
          <Outlet />
          <NavigationBar />
        </div>
      </div>
  );
};


export default MainLayout;