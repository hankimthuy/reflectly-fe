import { useTranslation } from 'react-i18next';

// Kept entirely within the existing coach-* palette (see documentation/01-UX-UI-Specs/
// Design-System.md) — no new colors invented for the 4 quadrants, just varying weight/tint so
// each reads distinct without a rainbow of one-off hex values.
const JOHARI_QUADRANTS = [
  { key: 'open', className: 'bg-coach-primary text-white' },
  { key: 'blind', className: 'bg-coach-accent/15 border border-coach-accent/40 text-coach-text' },
  { key: 'hidden', className: 'bg-coach-primary-light/15 border border-coach-primary-light/50 text-coach-text' },
  { key: 'unknown', className: 'border border-dashed border-coach-border text-coach-text-muted' },
] as const;

/**
 * Static, illustrative rendering of the Johari Window — 4 always-visible quadrants (previously
 * this shared a card with the relationship map behind a view-switcher dropdown, which buried a
 * concept the homepage exists to promote; it's now its own section, see HomeSection usage in
 * HomeValueSections.tsx).
 */
const JohariWindowCard = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto grid max-w-md grid-cols-2 grid-rows-2 gap-2.5 rounded-2xl border border-coach-border bg-coach-surface p-3">
      {JOHARI_QUADRANTS.map((q) => (
        <div key={q.key} className={`flex aspect-square flex-col justify-center rounded-xl p-3 ${q.className}`}>
          <p className="text-sm font-semibold">{t(`homePreview.johari.${q.key}.label`)}</p>
          <p className="mt-1 text-xs leading-snug opacity-80">{t(`homePreview.johari.${q.key}.desc`)}</p>
        </div>
      ))}
    </div>
  );
};

export default JohariWindowCard;
