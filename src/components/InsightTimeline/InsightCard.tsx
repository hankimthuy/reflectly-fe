import { useTranslation } from 'react-i18next';
import type { Insight } from '../../models/insight';

interface InsightCardProps {
  insight: Insight;
}

const CATEGORY_LABEL_KEY: Record<Insight['category'], string> = {
  VALUE: 'dashboard.category.value',
  BEHAVIOR_PATTERN: 'dashboard.category.behaviorPattern',
  RELATIONSHIP: 'dashboard.category.relationship',
};

const InsightCard = ({ insight }: InsightCardProps) => {
  const { t, i18n } = useTranslation();

  const dateLabel = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'short',
  }).format(new Date(insight.createdAt));

  return (
    <div className="rounded-xl border border-coach-border bg-coach-surface p-4">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="rounded-full bg-coach-bg px-2 py-0.5 text-xs font-medium text-coach-primary">
          {t(CATEGORY_LABEL_KEY[insight.category])}
        </span>
        <span className="text-xs text-coach-text-muted">{dateLabel}</span>
      </div>
      <p className="text-sm text-coach-text">{insight.insightText}</p>
    </div>
  );
};

export default InsightCard;
