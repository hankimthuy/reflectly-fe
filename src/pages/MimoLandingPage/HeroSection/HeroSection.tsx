import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MimoCharacter from '../../../components/MimoCharacter/MimoCharacter';
import { useTheme } from '../../../providers/ThemeContext';
import './HeroSection.scss';
import { LuInfinity } from 'react-icons/lu';

const HeroSection = () => {
  const { t } = useTranslation();
  const { mobileTab, setMobileTab } = useTheme();
  const [activeTab, setActiveTab] = useState<'inner' | 'outer'>(mobileTab as 'inner' | 'outer');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setMobileTab(activeTab);
    }
  }, [activeTab, isMobile, setMobileTab]);

  const handleTabChange = (tab: 'inner' | 'outer') => {
    setActiveTab(tab);
  };

  return (
    <section className="hero-split">

      {/* === DESKTOP VIEW (side by side) === */}
      <div className="hero-split__desktop">
        <div className="hero-split__left group">
          <div className="bg-blob"></div>

          <div className="content">
            <div className="kicker kicker--inner">
              <span className="kicker__line" />
              <span className="kicker__text">{t('heroSection.internalAwareness')}</span>
            </div>

            <h1>
              <span className="gradient-text inner">{t('heroSection.innerverse')}</span>
            </h1>

            <p className="desc inner">
              {t('heroSection.innerDescription')}
            </p>

            <div className="tags inner">
              <span>{t('heroSection.innerTags.safeSpace')}</span> • <span>{t('heroSection.innerTags.coreValues')}</span> • <span>{t('heroSection.innerTags.patterns')}</span>
            </div>
          </div>
        </div>

        <div className="hero-split__bridge" aria-hidden="true">
          <div className="hero-split__bridge-line"></div>

          <div className="hero-split__bridge-node">
            <div className="hero-split__bridge-ping" aria-hidden="true"></div>
            <div className="hero-split__bridge-pulse" aria-hidden="true"></div>
            <div className="hero-split__bridge-ring" aria-hidden="true"></div>

            <div className="hero-split__bridge-icon">
              <LuInfinity size={32} strokeWidth={1.5} />
            </div>

            <div className="hero-split__bridge-hint hero-split__bridge-hint--left">
              <span className="hero-split__bridge-label hero-split__bridge-label--input">{t('heroSection.bridge.insight')}</span>
              <div className="hero-split__bridge-seg hero-split__bridge-seg--indigo"></div>
              <div className="hero-split__bridge-dot hero-split__bridge-dot--indigo"></div>
            </div>

            <div className="hero-split__bridge-hint hero-split__bridge-hint--right">
              <div className="hero-split__bridge-dot hero-split__bridge-dot--orange"></div>
              <div className="hero-split__bridge-seg hero-split__bridge-seg--orange"></div>
              <span className="hero-split__bridge-label hero-split__bridge-label--output">{t('heroSection.bridge.action')}</span>
            </div>
          </div>
        </div>

        <div className="mimo-center">
          <MimoCharacter theme="bridge" />
        </div>

        <div className="hero-split__right group">
          <div className="bg-blob"></div>

          <div className="hero-content">
            <div className="kicker kicker--outer">
              <span className="kicker__text">{t('heroSection.externalAction')}</span>
              <span className="kicker__line" />
            </div>

            <h1>
              <span className="gradient-text outer">{t('heroSection.outerverse')}</span>
            </h1>

            <p className="desc outer">
              {t('heroSection.outerDescription')}
            </p>

            <div className="tags outer">
              <span>{t('heroSection.outerTags.socialMirror')}</span> • <span>{t('heroSection.outerTags.regulation')}</span> • <span>{t('heroSection.outerTags.growth')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* === MOBILE VIEW (tab switcher) === */}
      <div className={`hero-split__mobile hero-split__mobile--${activeTab}`}>

        {/* Tab Switcher */}
        <div className="hero-split__tab-switcher">
          <div className="tab-container">
            <button
              onClick={() => handleTabChange('inner')}
              className={`tab-btn ${activeTab === 'inner' ? 'tab-btn--active-inner' : ''}`}
            >
              {t('heroSection.innerverse')}
            </button>
            <button
              onClick={() => handleTabChange('outer')}
              className={`tab-btn ${activeTab === 'outer' ? 'tab-btn--active-outer' : ''}`}
            >
              {t('heroSection.outerverse')}
            </button>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="hero-split__mobile-content">
          <div className="bg-blob"></div>

          <div className={`kicker-mobile kicker-mobile--${activeTab}`}>
            <span className="kicker-mobile__line" />
            <span className="kicker-mobile__text">
              {activeTab === 'inner' ? t('heroSection.internalAwareness') : t('heroSection.externalAction')}
            </span>
            <span className="kicker-mobile__line" />
          </div>

          <h1 className="mobile-title">
            <span className={`gradient-text ${activeTab}`}>
              {activeTab === 'inner' ? t('heroSection.innerverse') : t('heroSection.outerverse')}
            </span>
          </h1>

          <p className="mobile-desc">
            {activeTab === 'inner'
              ? t('heroSection.innerDescription')
              : t('heroSection.outerDescription')
            }
          </p>

          <div className={`tags-mobile ${activeTab}`}>
            {activeTab === 'inner' ? (
              <>
                <span>{t('heroSection.innerTags.safeSpace')}</span> • <span>{t('heroSection.innerTags.coreValues')}</span> • <span>{t('heroSection.innerTags.patterns')}</span>
              </>
            ) : (
              <>
                <span>{t('heroSection.outerTags.socialMirror')}</span> • <span>{t('heroSection.outerTags.regulation')}</span> • <span>{t('heroSection.outerTags.growth')}</span>
              </>
            )}
          </div>

          {/* MimoCharacter */}
          <div className="mimo-mobile">
            <div className="mimo-glow"></div>
            <MimoCharacter theme={activeTab === 'inner' ? 'inner' : 'outer'} />
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;