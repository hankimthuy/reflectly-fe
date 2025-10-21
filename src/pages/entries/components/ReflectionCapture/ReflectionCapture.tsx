import React, { useState } from 'react';
import { Emotion, EMOTION_DATA } from '../../../../models/emotion';
import './ReflectionCapture.scss';

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
  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();

  return (
    <div className="reflection-capture">
      <div className="step-header">
        <div className="header-controls">
          <button className="back-button" onClick={onBack}>
            ←
          </button>
        </div>
        
        <div className="date-info">
          <div className="date-card">
            <div className="date-icon">📅</div>
            <div className="date-content">
              <div className="date-main">{formattedDate}</div>
              <div className="date-subtitle">Today's Reflection</div>
            </div>
          </div>
        </div>
      </div>

      <div className="step-content">
        <div className="selected-emotions">
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
        <button
          className="complete-button"
          onClick={handleSave}
          disabled={!title.trim() || !reflection.trim() || isLoading}
        >
          {isLoading ? 'SAVING...' : 'COMPLETE CHECK-IN'}
        </button>
      </div>
    </div>
  );
};

export default ReflectionCapture;
