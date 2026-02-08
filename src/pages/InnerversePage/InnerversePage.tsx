import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LuShield, LuCompass, LuLayers, LuPenLine, LuBrainCircuit, LuLock, LuBookOpen } from 'react-icons/lu';
import { useAuth } from '../../providers/AuthProvider';
import { APP_ROUTES } from '../../constants/route';
import './InnerversePage.scss';

const SECTIONS = [
  { key: 'safeSpace', icon: LuShield, color: 'teal', actionable: true },
  { key: 'innerCompass', icon: LuCompass, color: 'indigo', actionable: false },
  { key: 'senseConnection', icon: LuLayers, color: 'violet', actionable: false },
] as const;

const InnerversePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSafeSpace = () => {
    navigate(isAuthenticated ? APP_ROUTES.ENTRIES_NEW : APP_ROUTES.LOGIN);
  };

  const handleViewJournal = () => {
    navigate(isAuthenticated ? APP_ROUTES.ENTRIES_LIST : APP_ROUTES.LOGIN);
  };

  return (
    <div className="innerverse-page">

      {/* ── HERO ── */}
      <section className="iv-hero">
        <div className="iv-hero__container">
          <div className="iv-hero__badge">
            <LuBrainCircuit size={14} />
            <span>{t('innerversePage.hero.badge')}</span>
          </div>
          <h1 dangerouslySetInnerHTML={{ __html: t('innerversePage.hero.title') }} />
          <p className="iv-hero__subtitle">{t('innerversePage.hero.subtitle')}</p>
        </div>
      </section>

      {/* ── SECTIONS GRID ── */}
      <section className="iv-sections">
        <div className="iv-sections__container">
          {SECTIONS.map((section) => (
            <div
              key={section.key}
              className={`iv-card iv-card--${section.color} ${section.actionable ? 'iv-card--actionable' : ''}`}
              onClick={section.actionable ? handleSafeSpace : undefined}
            >
              <div className="iv-card__icon">
                <section.icon size={28} />
              </div>
              <h3>{t(`innerversePage.sections.${section.key}.title`)}</h3>
              <p>{t(`innerversePage.sections.${section.key}.description`)}</p>

              {section.actionable ? (
                <div className="iv-card__actions">
                  <button className="iv-card__cta iv-card__cta--primary" onClick={(e) => { e.stopPropagation(); handleSafeSpace(); }}>
                    <LuPenLine size={16} />
                    <span>{t(`innerversePage.sections.${section.key}.cta`)}</span>
                  </button>
                  <button className="iv-card__cta iv-card__cta--secondary" onClick={(e) => { e.stopPropagation(); handleViewJournal(); }}>
                    <LuBookOpen size={16} />
                    <span>{t(`innerversePage.sections.${section.key}.ctaView`)}</span>
                  </button>
                </div>
              ) : (
                <div className="iv-card__cta">
                  <LuLock size={14} />
                  <span>{t(`innerversePage.sections.${section.key}.cta`)}</span>
                </div>
              )}

              {/* Placeholder dashboard widget for non-actionable cards */}
              {!section.actionable && (
                <div className="iv-card__placeholder">
                  <div className="iv-card__placeholder-bar" style={{ width: '80%' }} />
                  <div className="iv-card__placeholder-bar" style={{ width: '55%' }} />
                  <div className="iv-card__placeholder-bar" style={{ width: '70%' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InnerversePage;
