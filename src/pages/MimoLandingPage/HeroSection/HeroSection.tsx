import MimoCharacter from '../../../components/MimoCharacter/MimoCharacter';
import './HeroSection.scss';

const HeroSection = () => {
  return (
    <section className="hero-split">
        
        <div className="hero-split__left group">
           <div className="bg-blob"></div>
           
           <div className="content">
              <div className="badge badge--inner">
                ● &nbsp; Internal Awareness
              </div>
              
              <h1>
                Explore Your <br/>
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

        <div className="mimo-center">
            <MimoCharacter theme="bridge" />
        </div>

        <div className="hero-split__right group">
           <div className="bg-blob"></div>

           <div className="hero-content">
              <div className="badge badge--outer">
                ● &nbsp; External Action
              </div>
              
              <h1>
                Master Your <br/>
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
        
    </section>
  );
};

export default HeroSection;