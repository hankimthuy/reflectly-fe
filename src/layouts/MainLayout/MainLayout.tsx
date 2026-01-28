import { useEffect, useRef, useState, type ReactNode } from 'react';
import MimoHeader from '../MimoHeader/MimoHeader.tsx';
import MobileFooter from '../MobileFooter/MobileFooter';
import { useTheme } from '../../providers/ThemeContext';
import './MainLayout.scss';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({children}: MainLayoutProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [activeTheme, setActiveTheme] = useState<'split' | 'inner' | 'outer'>('split');
    const [isMobile, setIsMobile] = useState(false);
    const { mobileTab } = useTheme();
    
    const scrollRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        const handleScroll = () => {
            const scrollTop = scrollElement.scrollTop; 
            const heroH = window.innerHeight;

            setScrolled(scrollTop > 50);

            if (scrollTop < heroH * 0.8) {
                setActiveTheme('split');
            } else if (scrollTop < heroH * 1.8) {
                setActiveTheme('inner');
            } else {
                setActiveTheme('outer');
            }
        };

        scrollElement.addEventListener('scroll', handleScroll);
        return () => scrollElement.removeEventListener('scroll', handleScroll);
    }, []);

    const headerTheme = isMobile ? mobileTab : activeTheme;

    return (
        <div className="main-layout-page">
            <div className="main-layout-container">
                <MimoHeader activeTheme={headerTheme} scrolled={scrolled} />
                
                <main className="main-content-scroll" ref={scrollRef}>
                    <div className="content-wrapper">
                        {children}
                    </div>
                </main>

                <MobileFooter />
            </div>
        </div>
    );
};

export default MainLayout;