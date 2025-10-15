import './NavigationBar.scss';
import AddIcon from '@mui/icons-material/Add';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import {Link, useLocation} from 'react-router-dom';
import {APP_ROUTES} from '../../constants/route';

const NavigationBar = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'item--active' : '';
    };

    return (
        <nav className="nav-bar">
            <Link to={APP_ROUTES.HOME} className={`item ${isActive(APP_ROUTES.HOME)}`}>
                <HomeOutlinedIcon/>
                <span>Home</span>
            </Link>
            <Link to={APP_ROUTES.ENTRIES} className="add-button">
                <AddIcon/>
            </Link>
            <Link to={APP_ROUTES.PROFILE} className={`item ${isActive(APP_ROUTES.PROFILE)}`}>
                <PersonOutlinedIcon/>
                <span>Profile</span>
            </Link>
        </nav>
    );
};

export default NavigationBar;