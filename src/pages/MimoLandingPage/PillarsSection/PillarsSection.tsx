import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LuActivity, LuBrainCircuit, LuChevronRight, LuCompass, LuLayers, LuMap, LuShield, LuUsers, LuZap } from 'react-icons/lu';
import { useAuth } from '../../../providers/AuthProvider';
import { APP_ROUTES } from '../../../constants/route';
import './PillarsSection.scss';

const PillarsSection = () => {
  const [activePillar, setActivePillar] = useState(0);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePillarClick = (pillarId: number) => {
    // Safe Space pillar (id: 0) navigates to New Entry Page
    if (pillarId === 0) {
      if (isAuthenticated) {
        navigate(APP_ROUTES.ENTRIES_NEW);
      } else {
        navigate(APP_ROUTES.LOGIN);
      }
    }
  };

  const pillars = [
    { id: 0, titleKey: 'pillarsSection.pillars.safeSpace.title', descKey: 'pillarsSection.pillars.safeSpace.description', icon: LuShield, type: 'inner' },
    { id: 1, titleKey: 'pillarsSection.pillars.innerCompass.title', descKey: 'pillarsSection.pillars.innerCompass.description', icon: LuCompass, type: 'inner' },
    { id: 2, titleKey: 'pillarsSection.pillars.senseConnection.title', descKey: 'pillarsSection.pillars.senseConnection.description', icon: LuLayers, type: 'inner' },
    { id: 3, titleKey: 'pillarsSection.pillars.socialMirror.title', descKey: 'pillarsSection.pillars.socialMirror.description', icon: LuUsers, type: 'outer' },
    { id: 4, titleKey: 'pillarsSection.pillars.selfRegulation.title', descKey: 'pillarsSection.pillars.selfRegulation.description', icon: LuZap, type: 'outer' },
    { id: 5, titleKey: 'pillarsSection.pillars.growthVision.title', descKey: 'pillarsSection.pillars.growthVision.description', icon: LuMap, type: 'outer' },
  ];

  return (
    <section id="pillars" className="pillars-section">
      <div className="pillars-section__container">
        
        <div className="pillars-section__header">
          <h2>{t('pillarsSection.title')}</h2>
          <p>{t('pillarsSection.subtitle')}</p>
        </div>

        {/* DESKTOP VIEW */}
        <div className="pillars-section__grid">
          {pillars.map((pillar, index) => (
            <div 
              key={pillar.id}
              onMouseEnter={() => setActivePillar(index)}
              onClick={() => handlePillarClick(pillar.id)}
              className={`pillar-card pillar-card--${pillar.type} ${activePillar === index ? 'expanded' : 'collapsed'} ${pillar.id === 0 ? 'cursor-pointer' : ''}`}
            >
              <div className="indicator"></div>
              <div className="content">
                <div className="top-meta">
                  <span className="number">0{index + 1}</span>
                  <div className="icon-circle">
                    <pillar.icon size={24} />
                  </div>
                </div>

                <div className="text-wrapper">
                  <div className="vertical-text">{t(pillar.titleKey)}</div>
                  <div className="expanded-content">
                     <h3 className="title">{t(pillar.titleKey)}</h3>
                     <p className="desc">{t(pillar.descKey)}</p>
                     <div className="link">
                        {t('pillarsSection.learnMore')} <LuChevronRight size={16} />
                     </div>
                  </div>
                </div>
                <div className="absolute inset-0 border-x border-white/5 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE VIEW */}
        <div className="pillars-section__mobile-stack">
           <div className="mobile-group-header inner">
              <LuBrainCircuit size={16} /> <span>{t('pillarsSection.groups.innerPsychology')}</span>
           </div>
           {pillars.slice(0,3).map((pillar) => (
              <div 
                key={pillar.id} 
                className={`mobile-card inner ${pillar.id === 0 ? 'cursor-pointer' : ''}`}
                onClick={() => handlePillarClick(pillar.id)}
              >
                 <div className="icon mt-1"><pillar.icon size={24} /></div>
                 <div>
                    <h4>{t(pillar.titleKey)}</h4>
                    <p>{t(pillar.descKey)}</p>
                 </div>
              </div>
           ))}

           <div className="mobile-group-header outer">
             <LuActivity size={16} /> <span>{t('pillarsSection.groups.externalBehavior')}</span>
           </div>
           {pillars.slice(3,6).map((pillar) => (
              <div key={pillar.id} className="mobile-card outer">
                 <div className="icon mt-1"><pillar.icon size={24} /></div>
                 <div>
                    <h4>{t(pillar.titleKey)}</h4>
                    <p>{t(pillar.descKey)}</p>
                 </div>
              </div>
           ))}
        </div>

      </div>
    </section>
  );
};

export default PillarsSection;