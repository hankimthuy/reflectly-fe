import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LuAperture, LuArrowRight, LuBrainCircuit, LuCompass, LuInfinity, LuZap } from 'react-icons/lu';
import { useAuth } from '../../providers/AuthProvider';
import { APP_ROUTES } from '../../constants/route';
import './MimoMethodPage.scss';

const STEPS = [
  { key: 'feel', icon: LuBrainCircuit, color: 'indigo' },
  { key: 'understand', icon: LuCompass, color: 'teal' },
  { key: 'decide', icon: LuInfinity, color: 'violet' },
  { key: 'act', icon: LuZap, color: 'orange' },
] as const;

const MimoMethodPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCTA = () => {
    navigate(isAuthenticated ? APP_ROUTES.ENTRIES_NEW : APP_ROUTES.LOGIN);
  };

  return (
    <div className="mimo-method-page">

      {/* ── HOW IT WORKS (with inline hero header) ── */}
      <section className="mm-steps">
        <div className="mm-steps__container">
          <div className="mm-steps__badge">
            <LuAperture size={14} />
            <span>{t('mimoMethodPage.hero.badge')}</span>
          </div>
          <h2 dangerouslySetInnerHTML={{ __html: t('mimoMethodPage.hero.title') }} />
          <p className="mm-steps__subtitle">{t('mimoMethodPage.howItWorks.subtitle')}</p>

          <div className="mm-steps__grid">
            {STEPS.map((step, idx) => (
              <div key={step.key} className={`mm-step-card mm-step-card--${step.color}`}>
                <div className="mm-step-card__number">
                  {t(`mimoMethodPage.howItWorks.steps.${step.key}.number`)}
                </div>
                <div className="mm-step-card__icon">
                  <step.icon size={28} />
                </div>
                <h3>{t(`mimoMethodPage.howItWorks.steps.${step.key}.title`)}</h3>
                <p>{t(`mimoMethodPage.howItWorks.steps.${step.key}.description`)}</p>
                <span className="mm-step-card__tag">
                  {t(`mimoMethodPage.howItWorks.steps.${step.key}.tag`)}
                </span>

                {/* Connector arrow between cards */}
                {idx < STEPS.length - 1 && (
                  <div className="mm-step-card__arrow">
                    <LuArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRIDGE VISUAL ── */}
      <section className="mm-bridge">
        <div className="mm-bridge__container">
          <h2>{t('mimoMethodPage.bridge.title')}</h2>

          <div className="mm-bridge__visual">
            {/* Inner side */}
            <div className="mm-bridge__side mm-bridge__side--inner">
              <div className="mm-bridge__side-icon"><LuBrainCircuit size={24} /></div>
              <h4>{t('mimoMethodPage.bridge.innerLabel')}</h4>
              <p>{t('mimoMethodPage.bridge.innerDesc')}</p>
            </div>

            {/* Connector left */}
            <div className="mm-bridge__connector">
              <div className="mm-bridge__connector-line" />
              <div className="mm-bridge__connector-dot mm-bridge__connector-dot--indigo" />
            </div>

            {/* Center node */}
            <div className="mm-bridge__center">
              <div className="mm-bridge__center-ping" />
              <div className="mm-bridge__center-core">
                <LuInfinity size={28} />
              </div>
              <span className="mm-bridge__center-label mm-bridge__center-label--left">
                {t('heroSection.bridge.insight')}
              </span>
              <span className="mm-bridge__center-label mm-bridge__center-label--right">
                {t('heroSection.bridge.action')}
              </span>
            </div>

            {/* Connector right */}
            <div className="mm-bridge__connector">
              <div className="mm-bridge__connector-dot mm-bridge__connector-dot--orange" />
              <div className="mm-bridge__connector-line" />
            </div>

            {/* Outer side */}
            <div className="mm-bridge__side mm-bridge__side--outer">
              <div className="mm-bridge__side-icon"><LuZap size={24} /></div>
              <h4>{t('mimoMethodPage.bridge.outerLabel')}</h4>
              <p>{t('mimoMethodPage.bridge.outerDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mm-cta">
        <div className="mm-cta__container">
          <h2>{t('mimoMethodPage.cta.title')}</h2>
          <p>{t('mimoMethodPage.cta.subtitle')}</p>
          <button className="mm-cta__button" onClick={handleCTA}>
            {t('mimoMethodPage.cta.button')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default MimoMethodPage;
