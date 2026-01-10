
// Components

// Styles
import BridgeSection from './BridgeSection/BridgeSection';
import HeroSection from './HeroSection/HeroSection';
import './MimoLandingPage.scss';
import PillarsSection from './PillarsSection/PillarsSection';

const MimoLandingPage = () => {

  return (
    <div className="landing-page">
      
      {/* Header with Theme Prop */}

      {/* --- HERO SECTION --- */}
      <HeroSection />

      {/* --- PILLARS SECTION --- */}
      <PillarsSection />

      {/* --- BRIDGE SECTION --- */}
      <BridgeSection />

      {/* --- Footer --- */}
      <footer className="footer">
        <span>© 2026 MimoSe Inc. - The Science of Leading Self.</span>
      </footer>
    </div>
  );
};

export default MimoLandingPage;