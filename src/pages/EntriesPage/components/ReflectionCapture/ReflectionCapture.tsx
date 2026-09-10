import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ReflectionCaptureProps {
  onFormChange?: (title: string, reflection: string) => void;
  initialTitle?: string;
  initialReflection?: string;
  guidingPrompts?: string[];
  templateLabel?: string;
}

/** Title + the reflection itself, plus the selected template's guiding questions rendered as an
 * accent-bordered aside — see mockup 2d's "DIFFICULT CONVERSATION · 2 OF 4" block. */
const ReflectionCapture: React.FC<ReflectionCaptureProps> = ({
  onFormChange,
  initialTitle = '',
  initialReflection = '',
  guidingPrompts,
  templateLabel,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [reflection, setReflection] = useState(initialReflection);

  useEffect(() => {
    onFormChange?.(title, reflection);
  }, [title, reflection, onFormChange]);

  return (
    <div className="entry-editor__reflection">
      <input
        type="text"
        className="entry-editor__title-input"
        placeholder={t('newEntryPage.titlePlaceholder') as string}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
      />
      <textarea
        className="input entry-editor__body-input"
        placeholder={t('newEntryPage.reflectionPlaceholder') as string}
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        rows={6}
        maxLength={1000}
      />

      {guidingPrompts && guidingPrompts.length > 0 && (
        <div className="entry-editor__prompts">
          {templateLabel && (
            <div className="entry-editor__prompts-label">{templateLabel} · {guidingPrompts.length} {t('entryTemplates.guidingPromptsHeading')}</div>
          )}
          <ul className="entry-editor__prompts-list">
            {guidingPrompts.map((prompt, index) => (
              <li key={index}>{prompt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReflectionCapture;
