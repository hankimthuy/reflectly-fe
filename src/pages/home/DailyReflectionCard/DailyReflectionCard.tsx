// src/components/DailyReflectionCard.tsx
import React from 'react';
import './DailyReflectionCard.scss'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconWrapper } from '../../../components/common/IconWrapper/IconWrapper';
// Removed Typography import

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
            <h1 className="title">
              Daily Reflection
            </h1>
            <p className="prompt">
                What brought you a moment of peace today?
            </p>
            <div className="input-area">
                <IconWrapper variant="primary">
                    <EditOutlinedIcon />
                </IconWrapper>
                <span className="placeholder">Start writing...</span>
                <IconWrapper variant="gradient">
                    <KeyboardArrowRightIcon />
                </IconWrapper>
            </div>
        </section>
    );
};

export default DailyReflectionCard;