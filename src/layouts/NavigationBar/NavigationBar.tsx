import AddIcon from '@mui/icons-material/Add';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import ListIcon from '@mui/icons-material/List';
import { Link, useLocation } from 'react-router-dom';
import IconWrapper from '../../components/IconWrapper/IconWrapper';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { APP_ROUTES } from '../../constants/route';
import './NavigationBar.scss';

const NavigationBar = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'item--active' : '';
    };

    return (
        <nav className="nav-bar">
            <Link to={APP_ROUTES.HOME} className={`item ${isActive(APP_ROUTES.HOME)}`}>
                <HomeOutlinedIcon />
            </Link>
            <Link to={APP_ROUTES.QUOTES} className={`item ${isActive(APP_ROUTES.QUOTES)}`}>
                <FormatQuoteIcon />
            </Link>
            <Link to={APP_ROUTES.ENTRIES_NEW} className="add-button">
                <IconWrapper variant="primary">
                    <AddIcon />
                </IconWrapper>
            </Link>
            <Link to={APP_ROUTES.STATISTICS} className={`item ${isActive(APP_ROUTES.STATISTICS)}`}>
                <InsightsIcon />
            </Link>
            <Link to={APP_ROUTES.ENTRIES_LIST} className={`item ${isActive(APP_ROUTES.ENTRIES_LIST)}`}>
                <ListIcon />
            </Link>
        </nav>
    );
};

export default NavigationBar;

