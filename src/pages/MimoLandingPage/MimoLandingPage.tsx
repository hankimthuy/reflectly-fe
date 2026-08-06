import { useTranslation } from 'react-i18next';
import HomeValueSections from '../../components/HomePreviewGrid/HomeValueSections';
import GardenHero from './GardenHero/GardenHero';
import './MimoLandingPage.scss';

const MimoLandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      <GardenHero />
      <HomeValueSections />
      <footer className="footer">
        <span>{t('brand.footer')}</span>
      </footer>
    </div>
  );
};

export default MimoLandingPage;
