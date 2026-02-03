import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LuAperture } from "react-icons/lu";
import { useAuth } from '../../../providers/AuthProvider';
import { APP_ROUTES } from '../../../constants/route';
import './BridgeSection.scss';

const BridgeSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const handleCTAClick = () => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.ENTRIES_LIST);
    } else {
      navigate(APP_ROUTES.LOGIN);
    }
  };

  return (
    <section className="bridge-section">
      <div className="bridge-section-container">
        
        {/* --- HEADER BLOCK --- */}
        <div className="bridge-header">
          <div className="badge-pill">
            <LuAperture size={14} /> 
            <span>{t('bridgeSection.badge')}</span>
          </div>
          
          <h2
            dangerouslySetInnerHTML={{ __html: t('bridgeSection.title') }}
          />
          
          <p className="description"
            dangerouslySetInnerHTML={{ __html: t('bridgeSection.description') }}
          />
        </div>

        {/* --- PROCESS VISUAL BLOCK --- */}
        <div className="process-visual">
          
          {/* Card 1: Awareness */}
          <div className="step-card start">
            <h4>{t('bridgeSection.steps.awareness.title')}</h4>
            <p>{t('bridgeSection.steps.awareness.example')}</p>
          </div>

          {/* Left Connector */}
          <div className="connector"></div>

          {/* Center Character */}
          <div className="center-piece">
             <div className="mimo-placeholder">
                <div className="glow-effect"></div>
                {/* <MimoCharacter theme="bridge" className="character-svg" /> */}
             </div>
          </div>

          {/* Right Connector */}
          <div className="connector"></div>

          {/* Card 2: Regulation */}
          <div className="step-card end">
            <h4>{t('bridgeSection.steps.regulation.title')}</h4>
            <p>{t('bridgeSection.steps.regulation.example')}</p>
          </div>

        </div>

        {/* --- CTA BUTTON --- */}
        <button className="btn-primary" onClick={handleCTAClick}>
          {t('bridgeSection.cta')}
        </button>

      </div>
    </section>
  );
};

export default BridgeSection;