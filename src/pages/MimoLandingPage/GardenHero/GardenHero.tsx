import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../providers/AuthProvider';
import { APP_ROUTES } from '../../../constants/route';
import { Button } from '../../../components/Button/Button';
import useReducedMotion from '../../../hooks/useReducedMotion';

const GardenHero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const reducedMotion = useReducedMotion();

  const handleCta = () => {
    navigate(currentUser ? APP_ROUTES.COACH_CHAT : APP_ROUTES.SIGNUP);
  };

  const Wrapper = reducedMotion ? 'div' : motion.div;
  const fadeUp = (delay: number) =>
    reducedMotion
      ? {}
      : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay } };

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-5 pb-6 text-center sm:pt-6">
      {/* Brand name/acronym intentionally not repeated here — the header logo already shows
          "Aura Self AI"; duplicating it in the hero just pushed the headline down. */}
      <Wrapper {...fadeUp(0)}>
        <h1 className="mb-4 text-[clamp(1.9rem,4.5vw,2.75rem)] leading-tight font-bold text-coach-text [font-family:var(--font-family-heading)]">
          {t('brand.slogan')}
        </h1>
      </Wrapper>

      {/* Bold → light → bold rhythm: an assertion, a soft explanation, then an accented close —
          reads as three distinct beats instead of one flat paragraph. */}
      <Wrapper {...fadeUp(0.1)} className="flex max-w-md flex-col gap-1.5">
        <p className="text-base font-semibold text-coach-text">{t('brand.heroLine1')}</p>
        <p className="text-sm leading-relaxed text-coach-text-muted">{t('brand.heroLine2')}</p>
        <p className="text-base font-semibold text-coach-primary italic">{t('brand.heroLine3')}</p>
      </Wrapper>

      <Wrapper {...fadeUp(0.2)}>
        {/* id used by ChatFab (via scroll-visibility check) to know when this CTA has scrolled
            out of view, so it can reveal itself instead of duplicating this button on-screen. */}
        <Button id="hero-cta" variant="primary" size="lg" shape="pill" className="mt-5" onClick={handleCta}>
          {t(currentUser ? 'brand.ctaLoggedIn' : 'brand.ctaLoggedOut')}
        </Button>
      </Wrapper>
    </section>
  );
};

export default GardenHero;
