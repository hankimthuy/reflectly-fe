import { type ReactNode } from 'react';
import MimoHeader from '../MimoHeader/MimoHeader.tsx';
import MobileFooter from '../MobileFooter/MobileFooter';
import PageTransition from '../../components/PageTransition/PageTransition';
import ChatFab from '../../components/ChatFab/ChatFab';
import './MainLayout.scss';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="main-layout-page main-layout-page--garden">
            <div className="main-layout-container">
                <MimoHeader />
                <main className="main-content-scroll">
                    <div className="content-wrapper">
                        <PageTransition>{children}</PageTransition>
                    </div>
                </main>
                <MobileFooter />
                <ChatFab />
            </div>
        </div>
    );
};

export default MainLayout;
