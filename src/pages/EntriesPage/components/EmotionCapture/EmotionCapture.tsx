import React from 'react';
import { useTranslation } from 'react-i18next';
import { Emotion, EMOTION_DATA } from '../../../../models/emotion';

interface EmotionCaptureProps {
  selectedEmotions: Emotion[];
  onEmotionToggle: (emotion: Emotion) => void;
  maxSelections?: number;
}

/** Typographic mood tags, not emoji buttons — see the design system's "One visual language"
 * direction (section 05 of the redesign brief): emoji mood icons are replaced by words. */
const EmotionCapture: React.FC<EmotionCaptureProps> = ({ selectedEmotions, onEmotionToggle, maxSelections = 10 }) => {
  const { t } = useTranslation();
  const emotions = Object.values(EMOTION_DATA);
  const canSelectMore = selectedEmotions.length < maxSelections;

  const isSelected = (emotion: Emotion) => selectedEmotions.includes(emotion);

  return (
    <div className="entry-editor__emotions">
      <div className="entry-editor__section-label">{t('newEntryPage.emotionQuestion')}</div>
      <div className="entry-editor__tags">
        {emotions.map((emotionData) => {
          const selected = isSelected(emotionData.id);
          return (
            <button
              key={emotionData.id}
              type="button"
              className={`tag ${selected ? 'tag-accent' : ''} entry-editor__tag-btn`}
              onClick={() => onEmotionToggle(emotionData.id)}
              disabled={!selected && !canSelectMore}
            >
              {t(`emotion.${emotionData.id}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionCapture;
