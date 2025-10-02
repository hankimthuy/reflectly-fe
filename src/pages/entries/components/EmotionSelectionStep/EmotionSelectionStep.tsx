import React from 'react';
import { Emotion, EMOTION_DATA } from '../../../../models/emotion';
import './EmotionSelectionStep.scss';

interface EmotionSelectionStepProps {
  selectedEmotions: Emotion[];
  onEmotionToggle: (emotion: Emotion) => void;
  onNext: () => void;
  maxSelections?: number;
}

const EmotionSelectionStep: React.FC<EmotionSelectionStepProps> = ({
  selectedEmotions,
  onEmotionToggle,
  onNext,
  maxSelections = 10
}) => {
  const emotions = Object.values(EMOTION_DATA);
  const canSelectMore = selectedEmotions.length < maxSelections;

  const handleEmotionClick = (emotion: Emotion) => {
    if (selectedEmotions.includes(emotion)) {
      // Remove emotion if already selected
      onEmotionToggle(emotion);
    } else if (canSelectMore) {
      // Add emotion if under limit
      onEmotionToggle(emotion);
    }
  };

  const isSelected = (emotion: Emotion) => selectedEmotions.includes(emotion);

  return (
    <div className="emotion-selection-step">
      <div className="step-header">
        <div className="mascot">
          <div className="mascot-icon">
            {selectedEmotions.length > 0 ? EMOTION_DATA[selectedEmotions[0]].icon : '😊'}
          </div>
        </div>
        <h2 className="question">How are you feeling today?</h2>
        <p className="instruction">SELECT UP TO {maxSelections} FEELINGS</p>
      </div>

      <div className="emotions-grid">
        {emotions.map((emotionData) => (
          <button
            key={emotionData.id}
            className={`emotion-button ${isSelected(emotionData.id) ? 'selected' : ''}`}
            onClick={() => handleEmotionClick(emotionData.id)}
            disabled={!isSelected(emotionData.id) && !canSelectMore}
            style={{
              '--emotion-color': emotionData.color
            } as React.CSSProperties}
          >
            <div className="emotion-icon">{emotionData.icon}</div>
            <span className="emotion-label">{emotionData.label}</span>
          </button>
        ))}
      </div>


      <div style={{ 
        position: 'fixed',
        bottom: '100px',
        left: '0',
        right: '0',
        padding: '20px',
        backgroundColor: 'transparent',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => {
            if (selectedEmotions.length > 0) {
              onNext();
            }
          }}
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: selectedEmotions.length > 0 ? '#87CEEB' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: selectedEmotions.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selectedEmotions.length > 0 ? '0 4px 15px rgba(135, 206, 235, 0.3)' : 'none',
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {selectedEmotions.length > 0 ? '→' : '○'}
        </button>
      </div>
    </div>
  );
};

export default EmotionSelectionStep;
