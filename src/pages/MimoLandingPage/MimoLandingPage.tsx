import { useTranslation } from 'react-i18next';
import FrameworkPanels from '../../components/FrameworkPanels/FrameworkPanels';
import GardenMap from '../../components/GardenMap/GardenMap';
import GardenHero from './GardenHero/GardenHero';
import TodayBridgePanel from './TodayBridgePanel/TodayBridgePanel';
import './MimoLandingPage.scss';

const MimoLandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page landing-page--garden">
      <GardenHero />
      <GardenMap />
      <TodayBridgePanel />
      <FrameworkPanels variant="compact" />
      <footer className="footer">
        <span>{t('brand.footer')}</span>
      </footer>
    </div>
  );
};

export default MimoLandingPage;
