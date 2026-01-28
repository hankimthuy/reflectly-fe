import { useState, useEffect } from 'react';
import MimoCharacter from '../../../components/MimoCharacter/MimoCharacter';
import { useTheme } from '../../../providers/ThemeContext';
import './HeroSection.scss';
import { LuInfinity } from 'react-icons/lu';

const HeroSection = () => {
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
              <span className="kicker__text">Internal Awareness</span>
            </div>

            <h1>
              <span className="gradient-text inner">Innerverse.</span>
            </h1>

            <p className="desc inner">
              Dive into the depths of your thoughts and emotions with clarity. No noise, just signal.
            </p>

            <div className="tags inner">
              <span>Safe Space</span> • <span>Core Values</span> • <span>Patterns</span>
            </div>
          </div>
        </div>

        <div className="hero-split__bridge" aria-hidden="true">
          <div className="hero-split__bridge-line"></div>

          <div className="hero-split__bridge-tile">
            <div className="hero-split__bridge-icon">
              <LuInfinity size={32} strokeWidth={1.5} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>

            <div className="hero-split__bridge-hint hero-split__bridge-hint--left">
              <span className="hero-split__bridge-label hero-split__bridge-label--input">Insight</span>
              <div className="hero-split__bridge-seg hero-split__bridge-seg--indigo"></div>
              <div className="hero-split__bridge-dot hero-split__bridge-dot--indigo"></div>
            </div>

            <div className="hero-split__bridge-hint hero-split__bridge-hint--right">
              <div className="hero-split__bridge-dot hero-split__bridge-dot--orange"></div>
              <div className="hero-split__bridge-seg hero-split__bridge-seg--orange"></div>
              <span className="hero-split__bridge-label hero-split__bridge-label--output">Action</span>
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
              <span className="kicker__text">External Action</span>
              <span className="kicker__line" />
            </div>

            <h1>
              <span className="gradient-text outer">Outerverse.</span>
            </h1>

            <p className="desc outer">
              Translate insights into tangible actions. Set boundaries, communicate, and lead.
            </p>

            <div className="tags outer">
              <span>Social Mirror</span> • <span>Regulation</span> • <span>Growth</span>
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
              Innerverse
            </button>
            <button
              onClick={() => handleTabChange('outer')}
              className={`tab-btn ${activeTab === 'outer' ? 'tab-btn--active-outer' : ''}`}
            >
              Outerverse
            </button>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="hero-split__mobile-content">
          <div className="bg-blob"></div>

          <div className={`kicker-mobile kicker-mobile--${activeTab}`}>
            <span className="kicker-mobile__line" />
            <span className="kicker-mobile__text">
              {activeTab === 'inner' ? 'Internal Awareness' : 'External Action'}
            </span>
            <span className="kicker-mobile__line" />
          </div>

          <h1 className="mobile-title">
            {activeTab === 'inner' ? 'Explore Your' : 'Master Your'} <br />
            <span className={`gradient-text ${activeTab}`}>
              {activeTab === 'inner' ? 'Innerverse.' : 'Outerverse.'}
            </span>
          </h1>

          <p className="mobile-desc">
            {activeTab === 'inner'
              ? 'Dive into the depths of your thoughts and emotions with clarity. No noise, just signal.'
              : 'Translate insights into tangible actions. Set boundaries, communicate, and lead.'
            }
          </p>

          <div className={`tags-mobile ${activeTab}`}>
            {activeTab === 'inner' ? (
              <>
                <span>Safe Space</span> • <span>Core Values</span> • <span>Patterns</span>
              </>
            ) : (
              <>
                <span>Social Mirror</span> • <span>Regulation</span> • <span>Growth</span>
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