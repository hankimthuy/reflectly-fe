import './App.scss';
import {Suspense, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Loading from "./components/Loading/Loading.tsx";
import NavigationUtil from "./utils/navigationUtil.ts";
import {AppRoutes} from "./routes/AppRoutes";

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        NavigationUtil.setNavigate(navigate);
    }, [navigate]);

    return (
        <Suspense fallback={<Loading message="Loading page..." fullHeight />}>
            <AppRoutes />
        </Suspense>
    );
};

export default App
