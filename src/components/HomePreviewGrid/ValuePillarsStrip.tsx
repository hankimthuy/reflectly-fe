import { useTranslation } from 'react-i18next';
import { LuChartLine, LuLayoutGrid, LuMessageCircle, LuUsers } from 'react-icons/lu';
import useReducedMotion from '../../hooks/useReducedMotion';

const PILLARS = [
  { key: 'coach', icon: LuMessageCircle, sectionId: 'section-coach' },
  { key: 'map', icon: LuUsers, sectionId: 'section-map' },
  { key: 'johari', icon: LuLayoutGrid, sectionId: 'section-johari' },
  { key: 'insights', icon: LuChartLine, sectionId: 'section-insights' },
] as const;

/**
 * An always-visible, clickable summary of the four things Aura Self AI delivers, placed right
 * below the Hero. Exists so the homepage's branding value lands even for a visitor who never
 * scrolls further — and each one jumps straight to its full HomeSection for whoever does want
 * more, instead of being purely decorative.
 *
 * A fixed 2-col/4-col grid (not flex-wrap) so it never orphans a single item onto its own row —
 * flex-wrap's break point depends on the sum of item widths, which reliably looked lopsided with
 * 4 unevenly-sized labels.
 */
const ValuePillarsStrip = () => {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const goToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    const scrollRoot = document.querySelector('.main-content-scroll');
    if (!target || !scrollRoot) return;
    // Computed manually rather than target.scrollIntoView(): the app scrolls inside
    // `.main-content-scroll`, not the window, and scrollIntoView's "find the nearest scrollable
    // ancestor" logic doesn't reliably resolve to it — a direct scrollTo() on the known
    // container does.
    const targetTop = target.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top + scrollRoot.scrollTop;
    scrollRoot.scrollTo({ top: targetTop, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2.5 px-4 pb-4 sm:grid-cols-4 sm:gap-3">
      {PILLARS.map(({ key, icon: Icon, sectionId }) => (
        <button
          key={key}
          type="button"
          onClick={() => goToSection(sectionId)}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-coach-border bg-coach-surface px-3 py-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-coach-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coach-primary"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coach-primary/10 text-coach-primary transition-colors group-hover:bg-coach-primary group-hover:text-white">
            <Icon size={20} />
          </span>
          <span className="text-xs leading-snug font-semibold text-coach-text sm:text-sm">
            {t(`homePreview.pillars.${key}`)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ValuePillarsStrip;
