import React from 'react';
import './Homepage.scss'; // Import the SCSS file for styling

import HomeHeader from '../../components/common/HomeHeader/HomeHeader';
import DailyReflectionCard from '../../components/common/DailyReflectionCard/DailyReflectionCard';
import QuickActionCard from '../../components/common/QuickActionCard/QuickActionCard';
import InfoCard from '../../components/common/InfoCard/InfoCard';
import NavigationBar from '../../components/common/NavigationBar/NavigationBar';

import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';

/**
 * @component HomePage
 * @description The main dashboard screen for the Reflectly app, now composed of smaller,
 * reusable TypeScript components.
 * @returns {JSX.Element} The rendered HomePage component.
 */
const HomePage: React.FC = () => {
    const todayDate = `Today, ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', month: 'long', day: 'numeric' })}`;

    return (
        <div className="home-page">
            <div className="home-page__container">

                {/* --- Header --- */}
                <HomeHeader date={todayDate} />

                <main className="home-page__main-content">
                    {/* --- Daily Reflection Card --- */}
                    <DailyReflectionCard />

                    <div className="quick-actions-grid">
                        {/* --- Mood Check Card --- */}
                        <QuickActionCard
                            icon={EmojiEmotionsOutlinedIcon}
                            title="Mood Check"
                            description="Track your daily emotions"
                            variant="secondary"
                        />

                        {/* --- Gratitude Card --- */}
                        <QuickActionCard
                            icon={StarBorderOutlinedIcon}
                            title="Gratitude"
                            description="Three things you're grateful for"
                            variant="primary"
                        />
                    </div>

                    {/* --- Latest Check-in Card --- */}
                    <InfoCard
                        icon={SentimentSatisfiedOutlinedIcon}
                        title="Latest Check-in"
                        description={
                            <>
                                <span>Yesterday:</span>
                                <span>Peaceful</span>
                            </>
                        }
                        variant="secondary"
                    />

                    {/* --- Daily Affirmation Card --- */}
                    <InfoCard
                        icon={StarBorderOutlinedIcon}
                        title="Daily Affirmation"
                        description="Every moment is a fresh beginning. Breathe deeply and trust your journey."
                        variant="primary"
                    />
                </main>

                {/* --- Navigation Bar --- */}
                <NavigationBar />

            </div>
        </div>
    );
};

export default HomePage;