// src/components/DailyReflectionCard.tsx
import React from 'react';
import './DailyReflectionCard.scss'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

/**
 * @interface DailyReflectionCardProps
 * @description Props for the DailyReflectionCard component.
 */
type DailyReflectionCardProps = object

/**
 * @component DailyReflectionCard
 * @description Displays the daily reflection prompt and input area.
 * @returns {JSX.Element} The rendered DailyReflectionCard component.
 */
const DailyReflectionCard: React.FC<DailyReflectionCardProps> = () => {
    return (
        <section className="daily-reflection-card">
            <h2 className="title">Daily Reflection</h2>
            <p className="prompt">
                What brought you a moment of peace today?
            </p>
            <div className="input-area">
                <div className="icon-wrapper icon-wrapper--gradient">
                    <EditOutlinedIcon />
                </div>
                <span className="placeholder">Start writing...</span>
                <div className="icon-wrapper icon-wrapper--primary">
                    <KeyboardArrowRightIcon />
                </div>
            </div>
        </section>
    );
};

export default DailyReflectionCard;