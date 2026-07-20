import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Emotion, EMOTION_DATA } from '../../../../models/emotion';
import './ReflectionCapture.scss';

interface ReflectionCaptureProps {
  selectedEmotions: Emotion[];
  onFormChange?: (title: string, reflection: string) => void;
  initialTitle?: string;
  initialReflection?: string;
  guidingPrompts?: string[];
}

const ReflectionCapture: React.FC<ReflectionCaptureProps> = ({
  selectedEmotions,
  onFormChange,
  initialTitle = '',
  initialReflection = '',
  guidingPrompts
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [reflection, setReflection] = useState(initialReflection);

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

        {guidingPrompts && guidingPrompts.length > 0 && (
          <div className="guiding-prompts">
            <p className="guiding-prompts__heading">{t('entryTemplates.guidingPromptsHeading')}</p>
            <ul className="guiding-prompts__list">
              {guidingPrompts.map((prompt, index) => (
                <li key={index} className="guiding-prompts__item">{prompt}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="reflection-form">
          <div className="input-group">
            <input
              id="title-input"
              type="text"
              className="title-input"
              placeholder={t('newEntryPage.titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="input-group">
            <textarea
              id="reflection-input"
              className="reflection-input"
              placeholder={t('newEntryPage.reflectionPlaceholder')}
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
