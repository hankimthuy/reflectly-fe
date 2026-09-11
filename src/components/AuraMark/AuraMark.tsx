import './AuraMark.scss';

/**
 * Aura's face: the brand mark, used wherever Aura itself speaks or is named — the chat bubbles
 * and Catch panel on Talk, Today's opener card, the sidebar and public header wordmark, the
 * session archive. Aura Soft v2 replaced the flush-left "Aura" text label that Modernist and
 * Hearth used with this mark sitting beside what Aura says (see artboards 5c, 5d, 6f).
 *
 * The file lives in public/ rather than src/assets/ because index.html serves it as the favicon
 * too, and Vite would otherwise fingerprint the bundled copy and leave the two out of sync.
 */
const SIZES = { sm: 34, md: 38, lg: 44 } as const;

interface AuraMarkProps {
  size?: keyof typeof SIZES;
  className?: string;
}

const AuraMark = ({ size = 'md', className = '' }: AuraMarkProps) => (
  <img
    src="/logo-mark.png"
    alt=""
    aria-hidden="true"
    width={SIZES[size]}
    height={SIZES[size]}
    className={`aura-mark aura-mark--${size} ${className}`}
  />
);

export default AuraMark;
