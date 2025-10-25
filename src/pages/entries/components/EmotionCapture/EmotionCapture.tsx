import React from 'react';
import { Emotion, EMOTION_DATA } from '../../../../models/emotion';
import './EmotionCapture.scss';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import IconWrapper from '../../../../components/IconWrapper/IconWrapper';

interface EmotionCaptureProps {
  selectedEmotions: Emotion[];
  onEmotionToggle: (emotion: Emotion) => void;
  onNext: () => void;
  maxSelections?: number;
}

const EmotionCapture: React.FC<EmotionCaptureProps> = ({
  selectedEmotions,
  onEmotionToggle,
  onNext,
  maxSelections = 10
}) => {
  const emotions = Object.values(EMOTION_DATA);
  const canSelectMore = selectedEmotions.length < maxSelections;

  const handleEmotionClick = (emotion: Emotion) => {
    if (selectedEmotions.includes(emotion)) {
      onEmotionToggle(emotion);
    } else if (canSelectMore) {
      onEmotionToggle(emotion);
    }
  };

  const onClickEmotionCapture = () => {
    if (selectedEmotions.length > 0) {
      onNext();
    }
  }

  const isSelected = (emotion: Emotion) => selectedEmotions.includes(emotion);

  return (
    <div className="emotion-capture">
      <div className="step-header">
        <div className="default-emotion">
          <div className="default-emotion-icon">
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

      {selectedEmotions.length > 0 && (<div className="emotion-next-step">
        <IconWrapper variant="primary" onClick={onClickEmotionCapture}>
          <KeyboardArrowRightIcon />
        </IconWrapper>
      </div>)}
    </div>
  );
};

export default EmotionCapture;
