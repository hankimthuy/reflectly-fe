import { useTranslation } from 'react-i18next';
import { LuChartLine } from 'react-icons/lu';
import { ButtonLink } from '../Button/Button';
import { APP_ROUTES } from '../../constants/route';

/**
 * Static, illustrative preview of the insight timeline for the (public, unauthenticated)
 * homepage — modeled on InsightCard.tsx's visual language but with hardcoded example entries
 * instead of real data (which requires an authenticated useInsightsInfiniteQuery()).
 *
 * Styled as an actual connected timeline (dot + line + timestamp + category tag) rather than a
 * flat list, so it reads as a log of moments rather than two disconnected bullet points.
 */
const InsightTimelinePreviewCard = () => {
  const { t } = useTranslation();

  const entries = [
    { dateKey: 'today', timeKey: 'todayTime', categoryKey: 'todayCategory', textKey: 'todayText' },
    { dateKey: 'lastWeek', timeKey: 'lastWeekTime', categoryKey: 'lastWeekCategory', textKey: 'lastWeekText' },
  ] as const;

  return (
    <div className="rounded-2xl border border-coach-border bg-coach-surface p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-coach-text">
        <LuChartLine size={18} className="text-coach-primary" />
        {t('homePreview.insights.title')}
      </h3>

      <div className="relative flex flex-col gap-5">
        {/* Connecting line running through the center of each dot */}
        <div className="absolute top-1.5 bottom-1.5 left-[5px] w-px bg-coach-border" aria-hidden="true" />

        {entries.map((entry) => (
          <div key={entry.dateKey} className="relative flex gap-3 pl-0.5">
            <span
              className="relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full bg-coach-accent ring-4 ring-coach-surface"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-xs font-semibold text-coach-text">
                  {t(`homePreview.insights.${entry.dateKey}`)}
                </span>
                <span className="text-xs text-coach-text-muted">{t(`homePreview.insights.${entry.timeKey}`)}</span>
                <span className="rounded-full bg-coach-bg px-2 py-0.5 text-[11px] font-medium text-coach-primary">
                  {t(`homePreview.insights.${entry.categoryKey}`)}
                </span>
              </div>
              <p className="rounded-xl border border-coach-border bg-coach-bg px-3 py-2 text-sm leading-relaxed text-coach-text">
                {t(`homePreview.insights.${entry.textKey}`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <ButtonLink to={APP_ROUTES.DASHBOARD} variant="ghost" size="sm" className="mt-4 self-start !px-0">
        {t('homePreview.cta')}
      </ButtonLink>
    </div>
  );
};

export default InsightTimelinePreviewCard;
