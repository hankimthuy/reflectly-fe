import './App.scss';
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes"; // Import the SCSS file for styling

const App: React.FC = () => {

  return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
  );
};
export default App
