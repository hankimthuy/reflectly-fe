import './AuraMark.scss';

/**
 * Aura's face: the brand mark, used wherever Aura itself speaks or is named — the chat bubbles
 * and Catch panel on Talk, Today's opener card, the sidebar and public header wordmark, the
 * session archive. Aura Soft v2 replaced the flush-left "Aura" text label that Modernist and
 * Hearth used with this mark sitting beside what Aura says (see artboards 5c, 5d, 6f).
 *
 * Uses the full, uncropped badge (ring + sparkle) rather than a tight face-only crop, so the
 * antenna tips and ring aren't cut off at small sizes.
 *
 * The file lives in public/ rather than src/assets/ so Vite doesn't fingerprint the bundled copy
 * and leave it out of sync with any other place that references it by this fixed path.
 */
const SIZES = { sm: 34, md: 38, lg: 44 } as const;

interface AuraMarkProps {
  size?: keyof typeof SIZES;
  className?: string;
}

const AuraMark = ({ size = 'md', className = '' }: AuraMarkProps) => (
  <img
    src="/aura-idle.png"
    alt=""
    aria-hidden="true"
    width={SIZES[size]}
    height={SIZES[size]}
    className={`aura-mark aura-mark--${size} ${className}`}
  />
);

export default AuraMark;
