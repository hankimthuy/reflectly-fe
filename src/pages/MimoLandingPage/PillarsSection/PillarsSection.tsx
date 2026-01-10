import { useState } from 'react';
import { LuActivity, LuBrainCircuit, LuChevronRight, LuCompass, LuLayers, LuMap, LuShield, LuUsers, LuZap } from 'react-icons/lu';
import './PillarsSection.scss';

const PillarsSection = () => {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    { id: 0, title: "Safe Space", icon: LuShield, type: 'inner', desc: "Unmask yourself. A private, judgment-free zone to vent, cry, or celebrate." },
    { id: 1, title: "Inner Compass", icon: LuCompass, type: 'inner', desc: "Define your Core Values. Understand the 'Why' behind your 'Who'." },
    { id: 2, title: "Sense Connection", icon: LuLayers, type: 'inner', desc: "Connect the dots. Detect hidden patterns in your mood and behaviors." },
    { id: 3, title: "Social Mirror", icon: LuUsers, type: 'outer', desc: "Visualize your network. Who fuels your growth and who drains it?" },
    { id: 4, title: "Self-Regulation", icon: LuZap, type: 'outer', desc: "Turn insight into Action. Master your impulses and set boundaries." },
    { id: 5, title: "Growth Vision", icon: LuMap, type: 'outer', desc: "Map your evolution. Set a clear trajectory for your future self." },
  ];

  return (
    <section id="pillars" className="pillars-section">
      <div className="pillars-section__container">
        
        <div className="pillars-section__header">
          <h2>The Pillars of Self-Leadership</h2>
          <p>Hover over the pillars to explore the structure of your mind.</p>
        </div>

        {/* DESKTOP VIEW */}
        <div className="pillars-section__grid">
          {pillars.map((pillar, index) => (
            <div 
              key={pillar.id}
              onMouseEnter={() => setActivePillar(index)}
              className={`pillar-card pillar-card--${pillar.type} ${activePillar === index ? 'expanded' : 'collapsed'}`}
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
                  <div className="vertical-text">{pillar.title}</div>
                  <div className="expanded-content">
                     <h3 className="title">{pillar.title}</h3>
                     <p className="desc">{pillar.desc}</p>
                     <div className="link">
                        Learn More <LuChevronRight size={16} />
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
              <LuBrainCircuit size={16} /> <span>Inner Psychology</span>
           </div>
           {pillars.slice(0,3).map((pillar) => (
              <div key={pillar.id} className="mobile-card inner">
                 <div className="icon mt-1"><pillar.icon size={24} /></div>
                 <div>
                    <h4>{pillar.title}</h4>
                    <p>{pillar.desc}</p>
                 </div>
              </div>
           ))}

           <div className="mobile-group-header outer">
             <LuActivity size={16} /> <span>External Behavior</span>
           </div>
           {pillars.slice(3,6).map((pillar) => (
              <div key={pillar.id} className="mobile-card outer">
                 <div className="icon mt-1"><pillar.icon size={24} /></div>
                 <div>
                    <h4>{pillar.title}</h4>
                    <p>{pillar.desc}</p>
                 </div>
              </div>
           ))}
        </div>

      </div>
    </section>
  );
};

export default PillarsSection;