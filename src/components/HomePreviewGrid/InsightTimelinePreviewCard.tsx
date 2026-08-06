import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { LuArrowRight, LuBatteryLow, LuZap } from 'react-icons/lu';
import { ButtonLink } from '../Button/Button';
import { APP_ROUTES } from '../../constants/route';
import useReducedMotion from '../../hooks/useReducedMotion';

type Energy = 'high' | 'low';

/**
 * Static, illustrative preview of the insight timeline for the (public, unauthenticated)
 * homepage — modeled on InsightCard.tsx's visual language but with hardcoded example entries
 * instead of real data (which requires an authenticated useInsightsInfiniteQuery()).
 *
 * Styled as an actual connected timeline (dot + line + timestamp + category tag) rather than a
 * flat list, so it reads as a log of moments rather than two disconnected bullet points. Each
 * entry also carries a small energy-level indicator (icon + color, both from the existing
 * coach-* palette — no new colors) so someone scanning their own history can start spotting
 * patterns (e.g. "I'm consistently low-energy after X") at a glance, not just re-read old text.
 *
 * No internal title — it lives inside a HomeSection, which already renders the section heading.
 */
const InsightTimelinePreviewCard = () => {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const entries: { dateKey: string; timeKey: string; categoryKey: string; textKey: string; energy: Energy }[] = [
    { dateKey: 'today', timeKey: 'todayTime', categoryKey: 'todayCategory', textKey: 'todayText', energy: 'high' },
    { dateKey: 'lastWeek', timeKey: 'lastWeekTime', categoryKey: 'lastWeekCategory', textKey: 'lastWeekText', energy: 'low' },
  ];

  const ENERGY_STYLE: Record<Energy, { icon: typeof LuZap; className: string; labelKey: string }> = {
    high: { icon: LuZap, className: 'bg-coach-primary text-white', labelKey: 'homePreview.insights.energyHigh' },
    low: { icon: LuBatteryLow, className: 'bg-coach-accent text-white', labelKey: 'homePreview.insights.energyLow' },
  };

  return (
    <div className="mx-auto flex max-w-md flex-col rounded-2xl border border-coach-border bg-coach-surface p-4">
      <div className="relative flex flex-col gap-3">
        {/* Connecting line running through the center of each dot */}
        <div className="absolute top-2.5 bottom-2.5 left-[9px] w-px bg-coach-border" aria-hidden="true" />

        {entries.map((entry, index) => {
          const energy = ENERGY_STYLE[entry.energy];
          const EnergyIcon = energy.icon;
          return (
            <motion.div
              key={entry.dateKey}
              className="relative flex gap-3"
              {...(reducedMotion
                ? {}
                : {
                    initial: { opacity: 0, x: -8 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.3, delay: index * 0.12 },
                  })}
            >
              <span
                className={`relative z-10 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full ring-4 ring-coach-surface ${energy.className}`}
                title={t(energy.labelKey)}
              >
                <EnergyIcon size={11} />
              </span>
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
                <p className="rounded-xl border border-coach-border bg-coach-bg px-3 py-1.5 text-sm leading-relaxed text-coach-text">
                  {t(`homePreview.insights.${entry.textKey}`)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <ButtonLink to={APP_ROUTES.DASHBOARD} variant="ghost" size="sm" className="mt-3 self-end !px-0">
        {t('homePreview.cta')}
        <LuArrowRight size={14} />
      </ButtonLink>
    </div>
  );
};

export default InsightTimelinePreviewCard;
