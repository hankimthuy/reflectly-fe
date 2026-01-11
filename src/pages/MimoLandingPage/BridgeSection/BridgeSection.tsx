import React from 'react';
import { LuAperture } from "react-icons/lu";
import './BridgeSection.scss';
import MimoCharacter from '../../../components/MimoCharacter/MimoCharacter';

const BridgeSection = () => {
  return (
    <section className="bridge-section">
      <div className="bridge-section-container">
        
        {/* --- HEADER BLOCK --- */}
        <div className="bridge-header">
          <div className="badge-pill">
            <LuAperture size={14} /> 
            <span>The Mimo Method</span>
          </div>
          
          <h2>
            From Insight to <span className="highlight">Action.</span>
          </h2>
          
          <p className="description">
            Mimo bridges the gap. We take the raw data from your <strong>Innerverse</strong> and convert it into actionable steps for your <strong>Outerverse</strong>.
          </p>
        </div>

        {/* --- PROCESS VISUAL BLOCK --- */}
        <div className="process-visual">
          
          {/* Card 1: Awareness */}
          <div className="step-card start">
            <h4>1. Awareness</h4>
            <p>I feel anxious.</p>
          </div>

          {/* Left Connector */}
          <div className="connector"></div>

          {/* Center Character */}
          <div className="center-piece">
             {/* Character Component - Đã ignore theo yêu cầu, giữ placeholder */}
             <div className="mimo-placeholder">
                <div className="glow-effect"></div>
                <MimoCharacter theme="bridge" className="character-svg" />
             </div>
          </div>

          {/* Right Connector */}
          <div className="connector"></div>

          {/* Card 2: Regulation */}
          <div className="step-card end">
            <h4>2. Regulation</h4>
            <p>I will set a boundary.</p>
          </div>

        </div>

        {/* --- CTA BUTTON --- */}
        <button className="btn-primary">
          Start Leading Yourself
        </button>

      </div>
    </section>
  );
};

export default BridgeSection;