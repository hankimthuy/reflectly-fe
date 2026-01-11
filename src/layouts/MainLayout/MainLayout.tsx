import { useEffect, useState, useRef, type ReactNode } from 'react';
import MimoHeader from '../MimoHeader/MimoHeader.tsx';
import NavigationBar from "../NavigationBar/NavigationBar.tsx";
import './MainLayout.scss';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({children}: MainLayoutProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [activeTheme, setActiveTheme] = useState<'split' | 'inner' | 'outer'>('split');
    
    const scrollRef = useRef<HTMLDivElement>(null); 

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

    return (
        <div className="main-layout-page">
            <div className="main-layout-container">
                <MimoHeader activeTheme={activeTheme} scrolled={scrolled} />
                
                <main className="main-content-scroll" ref={scrollRef}>
                    <div className="content-wrapper">
                        {children}
                    </div>
                </main>

                <NavigationBar/>
            </div>
        </div>
    );
};

export default MainLayout;