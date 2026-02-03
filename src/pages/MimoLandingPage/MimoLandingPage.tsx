import { useTranslation } from 'react-i18next';

// Components

// Styles
import BridgeSection from './BridgeSection/BridgeSection';
import HeroSection from './HeroSection/HeroSection';
import './MimoLandingPage.scss';
import PillarsSection from './PillarsSection/PillarsSection';

const MimoLandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      
      {/* --- HERO SECTION --- */}
      <HeroSection />

      {/* --- PILLARS SECTION --- */}
      <PillarsSection />

      {/* --- BRIDGE SECTION --- */}
      <BridgeSection />

      {/* --- Footer --- */}
      <footer className="footer">
        <span>{t('landingPage.footer.copyright')}</span>
      </footer>
    </div>
  );
};

export default MimoLandingPage;