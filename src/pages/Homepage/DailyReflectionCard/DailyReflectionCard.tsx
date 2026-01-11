import './DailyReflectionCard.scss'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import IconWrapper from '../../../components/IconWrapper/IconWrapper';
import BaseCard from '../../../components/BaseCard/BaseCard';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../constants/route';

/**
 * @component DailyReflectionCard
 * @description Displays the daily reflection prompt and input area.
 */
const DailyReflectionCard = () => {
    const navigate = useNavigate();
    const handleNavigateToNewEntry = () => {
        navigate(APP_ROUTES.ENTRIES_NEW, { state: { from: APP_ROUTES.HOME } });
    };
    
    return (
        <BaseCard className="daily-reflection-card" onClick={handleNavigateToNewEntry}>
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
        </BaseCard>
    );
};

export default DailyReflectionCard;