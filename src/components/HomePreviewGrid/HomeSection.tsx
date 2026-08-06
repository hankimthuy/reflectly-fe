import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

interface HomeSectionProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  /** Alternates a subtle surface tint between sections so each one reads as its own "chapter"
   * on scroll, without needing hard dividers. */
  tinted?: boolean;
}

/**
 * Shared layout for each homepage value-proposition section (AI Coach / Relationship Map /
 * Johari Window / Insight Timeline): a centered heading + one-line value description, then the
 * section's own illustrative preview below. Replaces the old single 2-column "preview grid" —
 * each concept now gets its own scannable space instead of being packed into a shared card.
 */
const HomeSection = ({ id, title, description, children, tinted = false }: HomeSectionProps) => {
  const reducedMotion = useReducedMotion();
  const Wrapper = reducedMotion ? 'div' : motion.div;
  const animProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.4 },
      };

  return (
    // scroll-mt gives ValuePillarsStrip's jump-links a little breathing room above the heading
    // instead of snapping it flush against the viewport edge.
    <section id={id} className={`scroll-mt-4 ${tinted ? 'bg-coach-surface' : ''}`}>
      <Wrapper {...animProps} className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-5 text-center">
          <h2 className="text-xl font-bold text-coach-text [font-family:var(--font-family-heading)] sm:text-2xl">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-coach-text-muted">{description}</p>
        </div>
        {children}
      </Wrapper>
    </section>
  );
};

export default HomeSection;
