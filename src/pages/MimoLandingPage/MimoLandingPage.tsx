import { useTranslation } from 'react-i18next';
import FrameworkPanels from '../../components/FrameworkPanels/FrameworkPanels';
import GardenHero from './GardenHero/GardenHero';
import './MimoLandingPage.scss';

const MimoLandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page landing-page--garden">
      <GardenHero />
      <FrameworkPanels variant="compact" />
      <footer className="footer">
        <span>{t('brand.footer')}</span>
      </footer>
    </div>
  );
};

export default MimoLandingPage;
