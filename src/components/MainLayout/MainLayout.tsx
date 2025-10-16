import './MainLayout.scss';
import HomeHeader from "../Header/Header.tsx";
import NavigationBar from "../NavigationBar/NavigationBar.tsx"; // Import the SCSS file for styling
import { Outlet } from 'react-router-dom';

/**
 * @component MainLayout
 * @description The main dashboard screen for the Reflectly app, now composed of smaller, reusable TypeScript components.
 */
const MainLayout = () => {
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