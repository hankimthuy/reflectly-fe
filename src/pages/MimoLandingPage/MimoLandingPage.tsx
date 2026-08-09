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
        <a
          className="footer__contact-link"
          href="https://hankimthuy.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('brand.contactLink')}
        </a>
      </footer>
    </div>
  );
};

export default MimoLandingPage;
