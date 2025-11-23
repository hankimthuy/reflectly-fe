import './App.scss';
import {Suspense, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Loading from "./components/Loading/Loading.tsx";
import NavigationService from "./services/utils/navigationService";
import {useAuth} from "./providers/AuthProvider";
import {AppRoutes} from "./routes/AppRoutes";

const App = () => {
    const navigate = useNavigate();
    const {isLoading} = useAuth();

    useEffect(() => {
        NavigationService.setNavigate(navigate);
    }, [navigate]);

    // Auth loading - checking authentication on app initialization
    if (isLoading) {
        return (
            <div className="loading-overlay">
                <Loading message="Loading page..." fullHeight />
            </div>
        );
    }

    return (
        <Suspense fallback={<Loading message="Loading page..." fullHeight />}>
            <AppRoutes />
        </Suspense>
    );
};

export default App
