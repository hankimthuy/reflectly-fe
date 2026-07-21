import React from 'react';
import { useTranslation } from 'react-i18next';
import { ENTRY_TEMPLATES } from '../../models/entryTemplate';
import './TemplatePicker.scss';

interface TemplatePickerProps {
  selectedTemplateKey: string | null;
  onSelect: (templateKey: string | null) => void;
}

const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectedTemplateKey,
  onSelect
}) => {
  const { t } = useTranslation();

  return (
    <div className="template-picker">
      <div className="step-header">
        <h2 className="question">{t('entryTemplates.picker.heading')}</h2>
        <p className="instruction">{t('entryTemplates.picker.subheading')}</p>
      </div>

      <div className="template-picker__grid">
        <button
          type="button"
          className={`template-card ${selectedTemplateKey === null ? 'selected' : ''}`}
          onClick={() => onSelect(null)}
        >
          <div className="template-card__icon">✍️</div>
          <span className="template-card__label">{t('entryTemplates.freeform.label')}</span>
          <span className="template-card__description">{t('entryTemplates.freeform.description')}</span>
        </button>

        {ENTRY_TEMPLATES.map((template) => (
          <button
            type="button"
            key={template.key}
            className={`template-card ${selectedTemplateKey === template.key ? 'selected' : ''}`}
            onClick={() => onSelect(template.key)}
          >
            <div className="template-card__icon">{template.icon}</div>
            <span className="template-card__label">{t(template.labelKey)}</span>
            <span className="template-card__description">{t(template.descriptionKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplatePicker;
