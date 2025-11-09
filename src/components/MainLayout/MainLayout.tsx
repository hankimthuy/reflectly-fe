import './MainLayout.scss';
import HomeHeader from "../Header/Header.tsx";
import NavigationBar from "../NavigationBar/NavigationBar.tsx";
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
      <div className="main-layout-page">
        <div className="main-layout-container">
          <HomeHeader />
          {children}
          <NavigationBar />
        </div>
      </div>
  );
};

export default MainLayout;