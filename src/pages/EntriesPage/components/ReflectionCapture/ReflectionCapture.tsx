import React, { useState, useEffect } from 'react';
import { Emotion, EMOTION_DATA } from '../../../../models/emotion';
import './ReflectionCapture.scss';

interface ReflectionCaptureProps {
  selectedEmotions: Emotion[];
  onFormChange?: (title: string, reflection: string) => void;
}

const ReflectionCapture: React.FC<ReflectionCaptureProps> = ({
  selectedEmotions,
  onFormChange
}) => {
  const [title, setTitle] = useState('');
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    if (onFormChange) {
      onFormChange(title, reflection);
    }
  }, [title, reflection, onFormChange]);

  const selectedEmotionData = selectedEmotions.map(emotion => EMOTION_DATA[emotion]);

  return (
    <div className="reflection-capture">
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
            <textarea
              id="reflection-input"
              className="reflection-input"
              placeholder="Add some notes ..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
              maxLength={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionCapture;
