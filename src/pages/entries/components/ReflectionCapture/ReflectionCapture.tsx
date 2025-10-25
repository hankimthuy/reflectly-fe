import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import React, { useState } from 'react';
import { Emotion, EMOTION_DATA } from '../../../../models/emotion';
import './ReflectionCapture.scss';
import IconWrapper from '../../../../components/IconWrapper/IconWrapper';

interface ReflectionCaptureProps {
  selectedEmotions: Emotion[];
  onBack: () => void;
  onSave: (title: string, reflection: string) => void;
  isLoading?: boolean;
}

const ReflectionCapture: React.FC<ReflectionCaptureProps> = ({
  selectedEmotions,
  onBack,
  onSave,
  isLoading = false
}) => {
  const [title, setTitle] = useState('');
  const [reflection, setReflection] = useState('');

  const handleSave = () => {
    if (title.trim() && reflection.trim()) {
      onSave(title.trim(), reflection.trim());
    }
  };

  const selectedEmotionData = selectedEmotions.map(emotion => EMOTION_DATA[emotion]);

  return (
    <div className="reflection-capture">

      <div className="step-content">
        <div className="selected-emotions">
          <label htmlFor="title-input" className="section-title">Feelings</label>
          <div className="emotion-tags">
            {selectedEmotionData.map((emotion) => (
              <div
                key={emotion.id}
                className="emotion-tag"
                style={{
                  '--emotion-color': emotion.color
                } as React.CSSProperties}
              >
                <span className="emotion-icon">{emotion.icon}</span>
                <span className="emotion-label">{emotion.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reflection-form">
          <div className="input-group">
            <label htmlFor="title-input" className="input-label">
              Title
            </label>
            <input
              id="title-input"
              type="text"
              className="title-input"
              placeholder="Title ..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="input-group">
            <label htmlFor="reflection-input" className="input-label">
              Reflection
            </label>
            <textarea
              id="reflection-input"
              className="reflection-input"
              placeholder="Add some notes ..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={6}
              maxLength={1000}
            />
          </div>
        </div>
      </div>
      <div className="step-footer">
        <IconWrapper variant="primary" onClick={onBack}>
          <KeyboardArrowLeftIcon />
        </IconWrapper>
        <button
          className="complete-button"
          onClick={handleSave}
          disabled={!title.trim() || !reflection.trim() || isLoading}
        >
          {isLoading ? 'Saving...' : 'Check-in'}
        </button>
      </div>
    </div>
  );
};

export default ReflectionCapture;
