import { useTranslation } from 'react-i18next';
import HomePreviewGrid from '../../components/HomePreviewGrid/HomePreviewGrid';
import GardenHero from './GardenHero/GardenHero';
import './MimoLandingPage.scss';

const MimoLandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      <GardenHero />
      <HomePreviewGrid />
      <footer className="footer">
        <span>{t('brand.footer')}</span>
      </footer>
    </div>
  );
};

export default MimoLandingPage;
