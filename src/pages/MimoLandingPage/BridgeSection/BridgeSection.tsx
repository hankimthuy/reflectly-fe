import { useTranslation } from 'react-i18next';
import { LuAperture, LuArrowRight } from "react-icons/lu";
import './BridgeSection.scss';

const BridgeSection = () => {
  const { t } = useTranslation();

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

        {/* --- LAPTOP MOCKUP --- */}
        <div className="laptop-mockup">
          {/* Camera notch */}
          <div className="laptop-notch">
            <span className="laptop-camera" />
          </div>

          {/* Screen */}
          <div className="laptop-screen">
            <div className="screen-glow" />

            <div className="bridge-flow">
              {/* Card 1: Awareness */}
              <div className="flow-card flow-card--start">
                <h4>{t('bridgeSection.steps.awareness.title')}</h4>
                <p>{t('bridgeSection.steps.awareness.example')}</p>
              </div>

              {/* Animated connector */}
              <div className="flow-connector">
                <div className="flow-connector__line" />
                <div className="flow-connector__icon">
                  <LuArrowRight size={16} />
                </div>
                <div className="flow-connector__line" />
              </div>

              {/* Center – Mimo glow node with labels */}
              <div className="flow-node">
                <div className="flow-node__ping" />

                {/* Insight label (left) */}
                <div className="flow-node__label flow-node__label--left">
                  <span className="flow-node__tag flow-node__tag--insight">
                    {t('heroSection.bridge.insight')}
                  </span>
                  <div className="flow-node__seg flow-node__seg--indigo" />
                  <div className="flow-node__dot flow-node__dot--indigo" />
                </div>

                <div className="flow-node__core">
                  <LuAperture size={24} />
                </div>

                {/* Action label (right) */}
                <div className="flow-node__label flow-node__label--right">
                  <div className="flow-node__dot flow-node__dot--orange" />
                  <div className="flow-node__seg flow-node__seg--orange" />
                  <span className="flow-node__tag flow-node__tag--action">
                    {t('heroSection.bridge.action')}
                  </span>
                </div>
              </div>

              {/* Animated connector */}
              <div className="flow-connector">
                <div className="flow-connector__line" />
                <div className="flow-connector__icon">
                  <LuArrowRight size={16} />
                </div>
                <div className="flow-connector__line" />
              </div>

              {/* Card 2: Regulation */}
              <div className="flow-card flow-card--end">
                <h4>{t('bridgeSection.steps.regulation.title')}</h4>
                <p>{t('bridgeSection.steps.regulation.example')}</p>
              </div>
            </div>
          </div>

          {/* Laptop base / hinge */}
          <div className="laptop-base">
            <div className="laptop-base__indent" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default BridgeSection;