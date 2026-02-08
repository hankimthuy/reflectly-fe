import { useTranslation } from 'react-i18next';
import { LuUsers, LuZap, LuMap, LuLock, LuActivity } from 'react-icons/lu';
import './OuterversePage.scss';

const SECTIONS = [
  { key: 'socialMirror', icon: LuUsers, color: 'orange' },
  { key: 'selfRegulation', icon: LuZap, color: 'amber' },
  { key: 'growthVision', icon: LuMap, color: 'rose' },
] as const;

const OuterversePage = () => {
  const { t } = useTranslation();

  return (
    <div className="outerverse-page">

      {/* ── HERO ── */}
      <section className="ov-hero">
        <div className="ov-hero__container">
          <div className="ov-hero__badge">
            <LuActivity size={14} />
            <span>{t('outerversePage.hero.badge')}</span>
          </div>
          <h1 dangerouslySetInnerHTML={{ __html: t('outerversePage.hero.title') }} />
          <p className="ov-hero__subtitle">{t('outerversePage.hero.subtitle')}</p>
        </div>
      </section>

      {/* ── SECTIONS GRID ── */}
      <section className="ov-sections">
        <div className="ov-sections__container">
          {SECTIONS.map((section) => (
            <div
              key={section.key}
              className={`ov-card ov-card--${section.color}`}
            >
              <div className="ov-card__icon">
                <section.icon size={28} />
              </div>
              <h3>{t(`outerversePage.sections.${section.key}.title`)}</h3>
              <p>{t(`outerversePage.sections.${section.key}.description`)}</p>

              <div className="ov-card__cta">
                <LuLock size={14} />
                <span>{t(`outerversePage.sections.${section.key}.cta`)}</span>
              </div>

              {/* Placeholder dashboard widget */}
              <div className="ov-card__placeholder">
                <div className="ov-card__placeholder-bar" style={{ width: '75%' }} />
                <div className="ov-card__placeholder-bar" style={{ width: '50%' }} />
                <div className="ov-card__placeholder-bar" style={{ width: '65%' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OuterversePage;
