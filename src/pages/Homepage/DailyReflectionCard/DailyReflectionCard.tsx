import './DailyReflectionCard.scss'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import IconWrapper from '../../../components/IconWrapper/IconWrapper';

/**
 * @component DailyReflectionCard
 * @description Displays the daily reflection prompt and input area.
 */
const DailyReflectionCard = () => {
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